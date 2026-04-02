import { useState, useCallback } from 'react';

export function useProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const process = useCallback(async (type: string, data: any) => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // For now, we'll just return the file or handle simple cases
      // In a real app, this would use a Web Worker
      if (type === 'COMPRESS_IMAGE') {
        const { file, options } = data;
        const imageCompression = (await import('browser-image-compression')).default;
        
        // Mock progress
        const interval = setInterval(() => {
          setProgress(prev => Math.min(prev + 10, 90));
        }, 100);

        const compressedFile = await imageCompression(file, {
          ...options,
          onProgress: (p) => setProgress(p),
        });

        clearInterval(interval);
        setProgress(100);
        return compressedFile;
      }
      
      return data.file;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { process, isProcessing, progress, error };
}
