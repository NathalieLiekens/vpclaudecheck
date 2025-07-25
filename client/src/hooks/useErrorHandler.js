// src/hooks/useErrorHandler.js
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((error) => {
    console.error('Error handled:', error);
    
    let userMessage = 'An unexpected error occurred. Please try again.';
    
    if (error.isNetworkError) {
      userMessage = 'Connection problem. Please check your internet and try again.';
    } else if (error.isCorsError) {
      userMessage = 'Service temporarily unavailable. Please try again later.';
    } else if (error.message) {
      userMessage = error.message;
    }
    
    setError(userMessage);
    toast.error(userMessage);
    
    return userMessage;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const withErrorHandling = useCallback(async (asyncFunction) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await asyncFunction();
      return result;
    } catch (err) {
      const errorMessage = handleError(err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  return {
    error,
    isLoading,
    handleError,
    clearError,
    withErrorHandling,
  };
};