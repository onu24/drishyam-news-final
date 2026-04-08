'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AlertCircle, Camera, CheckCircle2, X } from 'lucide-react';

interface AvatarUploadProps {
  onAvatarUpload: (url: string) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  currentAvatar?: string;
  folder?: string;
  inputId?: string;
  buttonLabel?: string;
  alt?: string;
}

const DEFAULT_AVATAR = '/placeholder-user.jpg';

export function AvatarUpload({
  onAvatarUpload,
  onUploadingChange,
  currentAvatar,
  folder = 'authors',
  inputId = 'avatar-upload-input',
  buttonLabel = 'Upload Avatar',
  alt = 'Avatar preview',
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentAvatar || DEFAULT_AVATAR);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onUploadingChange?.(uploading);
  }, [uploading, onUploadingChange]);

  useEffect(() => {
    setPreviewUrl(currentAvatar || DEFAULT_AVATAR);
  }, [currentAvatar]);

  const clearAvatar = () => {
    setPreviewUrl(DEFAULT_AVATAR);
    onAvatarUpload('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid format. Please use JPG, PNG, WebP or GIF.');
      return;
    }

    const MAX_SIZE = 3 * 1024 * 1024; // 3MB
    if (file.size > MAX_SIZE) {
      setError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Limit is 3MB.`);
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const progressInterval = setInterval(() => {
        setProgress((p) => (p < 90 ? p + 10 : p));
      }, 250);

      const { uploadImageAction } = await import('@/lib/actions/dashboard-actions');
      const result = await uploadImageAction(formData);

      clearInterval(progressInterval);
      setProgress(100);

      if (!result.success || !result.url) {
        throw new Error(result.error || 'Failed to upload avatar');
      }

      setPreviewUrl(result.url);
      onAvatarUpload(result.url);
      setUploading(false);
      setProgress(0);
    } catch (err) {
      console.warn('[AvatarUpload] Upload error:', err);
      setError(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-border bg-secondary/40">
          <Image
            src={previewUrl}
            alt={alt}
            fill
            sizes="96px"
            className="object-cover"
          />
          {!uploading && previewUrl !== DEFAULT_AVATAR && (
            <button
              type="button"
              onClick={clearAvatar}
              className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              aria-label="Remove avatar"
            >
              <X size={12} />
            </button>
          )}
          {!uploading && previewUrl !== DEFAULT_AVATAR && (
            <div className="absolute bottom-0 right-0 p-1 bg-emerald-500 text-white rounded-full">
              <CheckCircle2 size={12} />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id={inputId}
          />
          <label
            htmlFor={inputId}
            className={`inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold uppercase tracking-wide text-xs rounded-sm hover:bg-black transition-colors cursor-pointer ${
              uploading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <Camera size={14} />
            {uploading ? 'Uploading...' : buttonLabel}
          </label>
          <p className="text-[11px] text-muted-foreground">JPG, PNG, WebP or GIF. Max 3MB.</p>
        </div>
      </div>

      {uploading && (
        <div className="space-y-1">
          <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Uploading... {progress}%</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-sm text-xs">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
