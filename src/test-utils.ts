import { pdfToPng } from 'pdf-to-png-converter';

export const pdfBufferToImage = async (pdfBuffer: Uint8Array): Promise<Buffer> => {
  // Convert PDF buffer to PNG images (returns array of pages)
  // Using useSystemFonts to ensure consistent font rendering across platforms
  // biome-ignore lint/suspicious/noExplicitAny: only for testing :)
  const pngPages = await pdfToPng(pdfBuffer as any, {
    disableFontFace: true, // Disable embedded fonts to use standard fonts
    useSystemFonts: true, // Use system fonts for better consistency
    viewportScale: 1.5,
  });

  // Return the first page as a buffer
  return pngPages[0].content;
};
