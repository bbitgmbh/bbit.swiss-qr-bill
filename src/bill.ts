import { QRCodeGenerator } from './qr';
import { CustomWritableStream } from './stream';
import { isNodeJs } from './utils';
import { IQRBill } from './../dist/types/interfaces.d';
import PDFDocument from 'pdfkit';

export class QRBillGenerator {
  private _qr = new QRCodeGenerator();
  public async generate(params: IQRBill): Promise<Buffer | Blob> {
    const doc = new PDFDocument();
    const stream = new CustomWritableStream();
    const code = await this._qr.generate(params);
    doc.pipe(stream);

    doc.fontSize(25).text('Swiss QR bill', 100, 100);

    doc.image(code, 200, 200, { width: 100 });

    doc.end();

    return new Promise((resolve): void => {
      stream.on('finish', (): void => {
        if (isNodeJs) {
          resolve(stream.toBuffer());
        } else {
          resolve(stream.toBlob());
        }
      });
    });
  }
}
