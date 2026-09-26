/**
 * Storage Service
 * Uploads actual browser File objects to private Supabase Storage bucket 'client-files'
 * and resolves temporary signed URLs for viewing private images.
 */
import { supabase } from '../lib/supabase';

const PRIMARY_BUCKET = 'booking-reference-files';
const FALLBACK_BUCKET = 'client-files';

export const storageService = {
  /**
   * Upload an actual browser File object to Supabase Storage
   */
  async uploadClientFile(bookingId, file) {
    if (!supabase) {
      console.error('❌ Supabase client is not initialized.');
      return { success: false, message: 'Supabase client is not initialized' };
    }

    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const uniqueId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
        ? crypto.randomUUID() 
        : `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const uniqueFilename = `${uniqueId}-${cleanFileName}`;
      const storagePath = `bookings/${bookingId}/${uniqueFilename}`;

      console.log('--- Storage upload started ---');
      console.log('Storage bucket:', PRIMARY_BUCKET);
      console.log('Storage file path:', storagePath);
      console.log('Original filename:', file.name);
      console.log('File type:', file.type);
      console.log('File size:', file.size);

      // Upload actual File binary object to Supabase Storage bucket 'booking-reference-files'
      let targetBucket = PRIMARY_BUCKET;
      let uploadRes = await supabase.storage
        .from(targetBucket)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'application/octet-stream'
        });

      // Fallback if booking-reference-files bucket does not exist yet on Supabase
      if (uploadRes.error && (uploadRes.error.message?.includes('not found') || uploadRes.error.statusCode === '404' || uploadRes.error.error === 'Bucket not found')) {
        console.warn(`Notice: Primary bucket ${PRIMARY_BUCKET} missing, trying fallback bucket ${FALLBACK_BUCKET}...`);
        targetBucket = FALLBACK_BUCKET;
        uploadRes = await supabase.storage
          .from(targetBucket)
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type || 'application/octet-stream'
          });
      }

      console.log('Storage upload response:', uploadRes.data);

      if (uploadRes.error) {
        console.error('❌ Storage upload error:', uploadRes.error);
        return {
          success: false,
          error: uploadRes.error.message || 'Storage upload failed',
          rawError: uploadRes.error
        };
      }

      const fileRef = {
        fileName: file.name,
        storagePath: storagePath,
        bucket: targetBucket,
        mimeType: file.type,
        fileSize: file.size,
        uploadedAt: new Date().toISOString()
      };

      return {
        success: true,
        fileRef,
        storagePath,
        bucket: targetBucket
      };
    } catch (err) {
      console.error('❌ Storage upload exception:', err);
      return {
        success: false,
        error: err.message || 'Unexpected storage upload failure'
      };
    }
  },

  /**
   * Generate a temporary signed URL for a private image/file in Supabase Storage
   */
  async getSignedFileUrl(filePath, bucketName = PRIMARY_BUCKET, expiresIn = 3600) {
    if (!supabase || !filePath) return null;

    try {
      // Clean leading bucket name from path if present
      const cleanPath = filePath.replace(/^(client-files|booking-reference-files|booking-references)\//, '');

      const { data, error } = await supabase.storage
        .from(PRIMARY_BUCKET)
        .createSignedUrl(cleanPath, expiresIn);

      if (error) {
        // Fallback check if path was stored under legacy bucket name
        const fallbackBucket = bucketName !== PRIMARY_BUCKET ? bucketName : 'booking-reference-files';
        const fallbackRes = await supabase.storage
          .from(fallbackBucket)
          .createSignedUrl(cleanPath, expiresIn);
          
        if (!fallbackRes.error && fallbackRes.data) {
          return fallbackRes.data.signedUrl;
        }
        console.warn('Could not generate signed URL:', error.message);
        return null;
      }

      if (data && data.signedUrl) {
        return data.signedUrl;
      }

      return null;
    } catch (err) {
      console.warn('Signed URL generation exception:', err);
      return null;
    }
  },

  /**
   * Resolve signed URLs for a list of file reference objects
   */
  async getSignedUrlsForFiles(filesList = [], expiresIn = 3600) {
    if (!Array.isArray(filesList) || filesList.length === 0) return [];

    const resolvedFiles = await Promise.all(
      filesList.map(async (fileItem) => {
        const path = fileItem.path || fileItem.storage_path || fileItem.name;
        const bucket = fileItem.bucket || PRIMARY_BUCKET;
        const signedUrl = await this.getSignedFileUrl(path, bucket, expiresIn);

        return {
          ...fileItem,
          name: fileItem.name || fileItem.file_name || 'Attached File',
          size: fileItem.size || fileItem.file_size || 0,
          type: fileItem.type || fileItem.mime_type || '',
          signedUrl
        };
      })
    );

    return resolvedFiles;
  }
};

export default storageService;
