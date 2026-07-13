import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function useEntityForm({
  schema,
  defaultValues,
  fetchOne,
  createEntity,
  updateEntity,
  mapRecordToForm = (r) => r,
  listRoute,
  entityLabel = 'Item',
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [isLoadingEntity, setIsLoadingEntity] = useState(isEditMode);
  const [loadError, setLoadError] = useState(null);

  const resolvedDefaults =
    typeof defaultValues === 'function' ? defaultValues({ id }) : defaultValues;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: resolvedDefaults,
    mode: 'onBlur',
  });

  const loadEntity = useCallback(async () => {
    if (!isEditMode) return;
    setIsLoadingEntity(true);
    setLoadError(null);
    try {
      const record = await fetchOne(id);
      form.reset(mapRecordToForm(record));
    } catch (err) {
      setLoadError(err.message || `Failed to load ${entityLabel.toLowerCase()}`);
    } finally {
      setIsLoadingEntity(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode]);

  useEffect(() => {
    if (isEditMode) {
      loadEntity();
    } else {
      form.reset(resolvedDefaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (isEditMode) {
        await updateEntity(id, values);
        toast.success(`${entityLabel} updated`);
      } else {
        await createEntity(values);
        toast.success(`${entityLabel} created`);
      }
      navigate(listRoute);
    } catch (err) {
      // Map server-side field errors (from the Zod validate() middleware)
      // straight onto React Hook Form so inline messages match the backend.
      if (err.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([field, messages]) => {
          form.setError(field, { type: 'server', message: messages[0] });
        });
      }
      toast.error(err.message || `Failed to save ${entityLabel.toLowerCase()}`);
    }
  });

  return {
    form,
    isEditMode,
    isLoadingEntity,
    loadError,
    retryLoad: loadEntity,
    isSubmitting: form.formState.isSubmitting,
    onSubmit,
  };
}