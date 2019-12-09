import * as PDFJS from 'pdfjs-dist';
import { createCanvas } from 'canvas';

class NodeCanvasFactory {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public create(width, height): any {
    // assert(width > 0 && height > 0, 'Invalid canvas size');
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    return {
      canvas,
      context,
    };
  }

  public reset(canvasAndContext, width, height): void {
    // assert(canvasAndContext.canvas, 'Canvas is not specified');
    // assert(width > 0 && height > 0, 'Invalid canvas size');
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  public destroy(canvasAndContext): void {
    // assert(canvasAndContext.canvas, 'Canvas is not specified');

    // Zeroing the width and height cause Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

export const pdfBufferToImage = async (pdfBuffer: Buffer | ArrayBuffer): Promise<Buffer> => {
  const pdf = await PDFJS.getDocument({ data: pdfBuffer, disableFontFace: false }).promise;
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
