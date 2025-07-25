// src/hooks/useBlockedDates.js (Updated)
import { useState, useEffect } from 'react';
import { api } from '../config/api';
import { useErrorHandler } from './useErrorHandler';

export const useBlockedDates = () => {
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const { handleError, withErrorHandling } = useErrorHandler();

  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  const fetchBlockedDates = async (isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
        setError('');
      }

      const result = await withErrorHandling(async () => {
        return await api.getBlockedDates();
      });
      
      const dates = Array.isArray(result.data)
        ? result.data.flatMap((event) => {
            const start = new Date(new Date(event.start).toLocaleString('en-US', { timeZone: 'Asia/Makassar' }));
            const end = new Date(new Date(event.end).toLocaleString('en-US', { timeZone: 'Asia/Makassar' }));
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            
            const range = [];
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
              range.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
            }
            return range;
          })
        : [];
        
      const uniqueDates = [...new Set(dates.map(d => d.toISOString()))].map(d => new Date(d));
      setBlockedDates(uniqueDates);
      setError('');
      setRetryCount(0); // Reset retry count on success
      
    } catch (err) {
      console.error('[ERROR] Fetching blocked dates:', err.message);
      
      const errorMessage = err.isNetworkError 
        ? 'Unable to load availability. Please check your connection.'
        : 'Failed to load availability. Some dates may appear available when they are not.';
      
      setError(errorMessage);
      
      // Retry logic for network errors
      if (err.isNetworkError && retryCount < maxRetries) {
        console.log(`Retrying... (${retryCount + 1}/${maxRetries})`);
        setRetryCount(prev => prev + 1);
        
        setTimeout(() => {
          fetchBlockedDates(true);
        }, retryDelay * (retryCount + 1)); // Exponential backoff
      } else {
        // Set empty array as fallback - allow booking but show warning
        setBlockedDates([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  const retry = () => {
    setRetryCount(0);
    fetchBlockedDates();
  };

  return { 
    blockedDates, 
    loading, 
    error,
    retry,
    isRetrying: retryCount > 0
  };
};