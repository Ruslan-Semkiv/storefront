/**
 * Shrinks a picked photo to fit `maxSize` px and re-encodes it as JPEG,
 * so it fits comfortably in localStorage (~50-150 KB instead of several MB).
 */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export async function resizeImageToDataUrl(file: File, maxSize = 800, quality = 0.85): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file');
  if (file.size > MAX_UPLOAD_BYTES) throw new Error('Image must be under 10 MB');

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not process the image');

  ctx.fillStyle = '#f5f5f5'; // transparent PNGs get the tile background instead of black
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return canvas.toDataURL('image/jpeg', quality);
}
