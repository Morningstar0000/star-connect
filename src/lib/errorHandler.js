// src/utils/errorHandler.js
export const isAbortError = (error) => {
  return (
    error?.name === 'AbortError' ||
    error?.message?.includes('abort') ||
    error?.message?.includes('lock') ||
    error?.message?.includes('steal') ||
    error?.message?.includes('signal is aborted')
  );
};

export const handleSupabaseError = (error, context = '') => {
  if (isAbortError(error)) {
    // These are expected during page refresh/navigation
    console.log(`${context}: Request aborted (normal during refresh)`);
    return null;
  }
  console.error(`${context}:`, error);
  return error;
};