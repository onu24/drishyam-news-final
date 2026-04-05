'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { AlertCircle, CheckCircle2, UploadCloud, X } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  currentImage?: string;
}

export function ImageUpload({ onImageUpload, onUploadingChange, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal uploading state to parent component
  useEffect(() => {
    onUploadingChange?.(uploading);
  }, [uploading, onUploadingChange]);

  const clearImage = () => {
    setPreviewUrl(null);
    onImageUpload('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 1. Production Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid format. Please use JPG, PNG, WebP or GIF.');
      return;
    }
    
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      setError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Limit is 5MB.`);
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      // Create FormData to send over Server Action
      const formData = new FormData();
      formData.append('file', file);

      // Fake progress for UX
      const progressInterval = setInterval(() => {
         setProgress(p => (p < 90 ? p + 10 : p));
      }, 300);

      const { uploadImageAction } = await import('@/lib/actions/dashboard-actions');
      const result = await uploadImageAction(formData);

      clearInterval(progressInterval);
      setProgress(100);

      if (!result.success || !result.url) {
         throw new Error(result.error || 'Failed to upload image');
      }

      setPreviewUrl(result.url);
      onImageUpload(result.url);
      setUploading(false);
      setProgress(0);

    } catch (err) {
      console.warn('[ImageUpload] Storage Error:', err);
      setError(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}. Falling back to Data URL for development.`);
      
      // Fallback (Data URL for localhost/development) if absolutely necessary
      const reader = new FileReader();
      reader.onload = e => {
        const res = e.target?.result as string;
        setPreviewUrl(res);
        onImageUpload(res);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${
        previewUrl ? 'border-emerald-200 bg-emerald-50/10' : 'border-border hover:border-primary/50 bg-secondary/5'
      }`}>
        
        {previewUrl ? (
          <div className="relative group">
            <div className="relative w-full h-72 rounded-lg overflow-hidden border border-border bg-zinc-100">
               <Image 
                 src={previewUrl} 
                 alt="Preview" 
                 fill 
                 className="object-cover"
                 sizes="(max-width: 1024px) 100vw, 800px" 
               />
               <div className="absolute top-4 right-4 bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                  <CheckCircle2 size={16} />
               </div>
            </div>
            <button 
              onClick={clearImage}
              type="button"
              className="absolute -top-3 -right-3 p-1.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="py-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-4">
               <UploadCloud className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-sm font-bold text-foreground mb-1">Click to upload cover image</h4>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">JPG, PNG, WebP or GIF (max 5MB)</p>
          </div>
        )}

        {/* Real-time Progress */}
        {uploading && (
          <div className="mt-4 space-y-2">
            <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">
               Uploading... {progress}%
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id="image-input"
        />
        
        {!previewUrl && (
          <label
            htmlFor="image-input"
            className={`mt-4 inline-flex px-8 py-3 bg-primary text-primary-foreground font-black uppercase tracking-tighter rounded-sm hover:bg-black transition-all cursor-pointer shadow-md ${
              uploading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {uploading ? 'Processing Assets...' : 'Select Cover Image'}
          </label>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <p className="font-medium text-left">{error}</p>
        </div>
      )}
    </div>
  );
}
