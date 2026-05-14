import { useEffect, useState } from 'react';

type GlobalErrorHandler = (error: Error, isFatal?: boolean) => void;

interface ErrorUtilsLike {
  getGlobalHandler?: () => GlobalErrorHandler;
  setGlobalHandler: (handler: GlobalErrorHandler) => void;
}

export function useGlobalErrorHandler(): Error | null {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorUtils = (
      globalThis as typeof globalThis & { ErrorUtils?: ErrorUtilsLike }
    ).ErrorUtils;

    if (!errorUtils) {
      return;
    }

    const previousHandler = errorUtils.getGlobalHandler?.();
    const errorHandler: GlobalErrorHandler = (caughtError, isFatal) => {
      console.log('Global error caught:', caughtError);
      setError(caughtError);
      previousHandler?.(caughtError, isFatal);
    };

    errorUtils.setGlobalHandler(errorHandler);

    return () => {
      if (previousHandler) {
        errorUtils.setGlobalHandler(previousHandler);
      }
    };
  }, []);

  return error;
}
