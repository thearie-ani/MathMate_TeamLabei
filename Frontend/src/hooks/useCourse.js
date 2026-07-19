import { useState, useEffect, useCallback } from 'react';
import * as courseApi from '../api/courseApi';

// Small data-fetching hook so pages don't repeat loading/error boilerplate.
export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCourses = useCallback(() => {
    courseApi
      .getCourses()
      .then(setCourses)
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  const refresh = useCallback(() => {
    setLoading(true);
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return { courses, loading, error, refresh };
}
