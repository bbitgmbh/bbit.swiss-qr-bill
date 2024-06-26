import { createCanvas } from 'canvas';
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as PDFJS from 'pdfjs-dist/legacy/build/pdf.mjs';

class NodeCanvasFactory {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public create(width: number, height: number): any {
    // assert(width > 0 && height > 0, 'Invalid canvas size');
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    return {
      canvas,
      context,
    };
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public reset(canvasAndContext: any, width: number, height: number): void {
    // assert(canvasAndContext.canvas, 'Canvas is not specified');
    // assert(width > 0 && height > 0, 'Invalid canvas size');
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public destroy(canvasAndContext: any): void {
    // assert(canvasAndContext.canvas, 'Canvas is not specified');

    // Zeroing the width and height cause Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

export const pdfBufferToImage = async (pdfBuffer: Uint8Array): Promise<Buffer> => {
  // Use standard fonts for testing so it should work on all systems
  const pdf = await PDFJS.getDocument({
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    data: pdfBuffer as any,
    disableFontFace: true,
    // useSystemFonts: false,
    standardFontDataUrl: './node_modules/pdfjs-dist/standard_fonts/',
  }).promise;
  const page1 = await pdf.getPage(1);
  const viewport = page1.getViewport({ scale: 1.5 });
  const canvasFactory = new NodeCanvasFactory();
  const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);
  const renderContext = {
    canvasContext: canvasAndContext.context,
    viewport: viewport,
    canvasFactory: canvasFactory,
  };
  await page1.render(renderContext).promise;
  return Promise.resolve(canvasAndContext.canvas.toBuffer());
};
