import { uploadBase64File } from '../../infra/storage.js';

export async function uploadFile(req, res, next) {
  try {
    const { fileData, fileName, folder } = req.body;
    const publicUrl = await uploadBase64File(fileData, fileName, folder);
    res.json({
      success: true,
      publicUrl,
    });
  } catch (error) {
    next(error);
  }
}
