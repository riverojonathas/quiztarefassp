import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface UseImageUploadOptions {
  maxSize?: number; // in bytes, default 2MB
  allowedTypes?: string[]; // default ['image/jpeg', 'image/png', 'image/webp']
  bucket?: string; // default 'question-images'
}

interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<string | null>;
  uploading: boolean;
  error: string | null;
  progress: number;
  reset: () => void;
}

export function useImageUpload(options: UseImageUploadOptions = {}): UseImageUploadReturn {
  const {
    maxSize = 2 * 1024 * 1024, // 2MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    bucket = 'question-images'
  } = options;

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const reset = useCallback(() => {
    setError(null);
    setProgress(0);
    setUploading(false);
  }, []);

  const compressImage = useCallback(async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1200px width/height)
        const maxDimension = 1200;
        let { width, height } = img;

        if (width > height) {
          if (width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/webp', // Convert to WebP for better compression
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Fallback to original file
            }
          },
          'image/webp',
          0.8 // 80% quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      setError(null);
      setProgress(0);

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Tipo de arquivo não permitido. Use: ${allowedTypes.join(', ')}`);
      }

      // Validate file size
      if (file.size > maxSize) {
        throw new Error(`Arquivo muito grande. Máximo: ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
      }

      setProgress(10);

      // Compress image
      const compressedFile = await compressImage(file);
      setProgress(30);

      // Generate unique filename
      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      setProgress(50);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      setProgress(80);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      setProgress(100);

      return publicUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido no upload';
      setError(errorMessage);
      console.error('Image upload error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  }, [maxSize, allowedTypes, bucket, compressImage]);

  return {
    uploadImage,
    uploading,
    error,
    progress,
    reset
  };
}