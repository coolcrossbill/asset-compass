import { useState, useEffect } from 'react';

export function useApiQuery<T>(
  fetchFn: () => Promise<T>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch };
}

export function useApiMutation<T, P = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (mutateFn: (params: P) => Promise<T>, params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutateFn(params);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMessage);
      console.error('Mutation Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

