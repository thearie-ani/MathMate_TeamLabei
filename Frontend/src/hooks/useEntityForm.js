import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useEntityForm({
  schema,
  defaultValues,
  fetchOne,
  createEntity,
  updateEntity,
  mapRecordToForm = (record) => record,
  transformSubmit = (data) => data,
  listRoute,
  listQueryKey,
  entityLabel = "Item",
}) {

  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const resolvedDefaults = useMemo( () =>
      typeof defaultValues === "function"
        ? defaultValues({ id })
        : defaultValues,
    [defaultValues, id]
  );

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: resolvedDefaults,
    mode: "onBlur",
  });

  const [isLoadingEntity, setIsLoadingEntity] =
    useState(isEditMode);

  const [loadError, setLoadError] =
    useState(null);

  const loadEntity = useCallback(async () => {
    if (!isEditMode) return;
    setIsLoadingEntity(true);
    setLoadError(null);

    try {
      const record = await fetchOne(id);
      form.reset(
        mapRecordToForm(record)
      );

    } catch(error){
      setLoadError(
        error.response?.data?.message ||
        error.message ||
        `Failed to load ${entityLabel}`
      );

    } finally {
      setIsLoadingEntity(false);
    }

  }, [
    id,
    isEditMode,
    fetchOne,
    mapRecordToForm,
    entityLabel,
    form
  ]);

  useEffect(()=>{
    if(isEditMode){
      loadEntity();
    }
    else{
      form.reset(resolvedDefaults);
    }

  },[id]);

  const onSubmit = form.handleSubmit( async(values)=>{
      try{
        const payload = transformSubmit(values);

        if(isEditMode){
          await updateEntity(
            id,
            payload
          );
          toast.success(
            `${entityLabel} updated`
          );
        }
        else{
          await createEntity(
            payload
          );
          toast.success(
            `${entityLabel} created`
          );
        }

        if(listQueryKey){
          queryClient.invalidateQueries({
            queryKey:listQueryKey
          });
        }

        navigate(listRoute);
      }
      catch(error){
        console.error(error);

        toast.error(
          error.response?.data?.message ||
          error.message ||
          `Failed to save ${entityLabel}`
        );
      }
    },

    (errors)=>{
      console.log(
        "Validation errors:",
        errors
      );
    }
  );

  return {
    id,
    form,
    isEditMode,
    isLoadingEntity,
    loadError,
    retryLoad:loadEntity,
    isSubmitting:
      form.formState.isSubmitting,
    onSubmit,
  };

}