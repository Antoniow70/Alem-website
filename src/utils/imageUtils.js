/**
 * Compress an image file to a base64 JPEG data URL.
 * Extracted from Admin.jsx where this logic was duplicated 3 times.
 *
 * @param {File} file - The image file to compress
 * @param {number} maxWidth - Maximum width in pixels (default: 800)
 * @param {number} quality - JPEG quality 0–1 (default: 0.6)
 * @returns {Promise<string|null>} Base64 data URL or null on failure
 */
export function compressImage(file, maxWidth = 800, quality = 0.6) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(null);
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Read a file as base64 data URL using FileReader.
 *
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => resolve(ev.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
