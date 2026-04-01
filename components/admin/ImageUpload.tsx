'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
}

export function ImageUpload({ onImageUpload, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Create a preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const res = e.target?.result as string;
        setPreviewUrl(res);
        onImageUpload(res); // Pass the data URL directly as mock uploaded image URL
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        {previewUrl ? (
          <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="mb-4">
            <svg
              className="w-12 h-12 mx-auto text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
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

        <label
          htmlFor="image-input"
          className="inline-block px-6 py-2 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : previewUrl ? 'Change Image' : 'Upload Image'}
        </label>

        <p className="text-xs text-muted-foreground mt-2">
          PNG, JPG or GIF (max. 5MB)
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
