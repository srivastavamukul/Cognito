import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../config';

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
}

/**
 * Uploads a file to Cloudinary using an unsigned upload preset.
 * @param file The file to upload
 * @param folder Optional folder to organize uploads in Cloudinary
 */
export const uploadToCloudinary = async (
  file: File,
  folder: string = 'cognito_uploads'
): Promise<CloudinaryUploadResponse> => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to upload to Cloudinary');
    }

    return await response.json();
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};
