import { supabaseAdmin } from './supabaseAdmin.js';

/**
 * Uploads a base64 file to Supabase Storage
 * @param {string} base64Data - Base64 string of the file (e.g., data:image/png;base64,...)
 * @param {string} filename - Original filename or file extension
 * @param {string} folder - Destination folder inside the bucket
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadBase64File(base64Data, filename, folder = 'projects') {
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Formato base64 inválido.');
  }

  const contentType = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  
  const fileExt = filename.split('.').pop() || 'png';
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${folder}/${uniqueName}`;

  const { data, error } = await supabaseAdmin.storage
    .from('project-media')
    .upload(filePath, buffer, {
      contentType,
      duplex: 'half'
    });

  if (error) {
    throw error;
  }

  const { data: urlData } = supabaseAdmin.storage
    .from('project-media')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
