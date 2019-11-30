import { QRCodeGenerator } from './qr';
import { CustomWritableStream } from './stream';
import { isNodeJs } from './utils';
import { IQRBill } from './interfaces';
import PDFDocument from 'pdfkit';
import { translations } from './translations';
import { IBAN } from './iban/iban';

export class QRBillGenerator {
  private _qr = new QRCodeGenerator();
  private _iban = new IBAN();
  public async generate(params: IQRBill): Promise<Buffer | Blob> {
    // create document and pipe stream
    const doc = new PDFDocument();
    const stream = new CustomWritableStream();
    doc.pipe(stream);

    // create code
    const code = await this._qr.generate(params);

    // load translations
    const t = translations[params.language];

    // define default positions
    const topPos = 100;
    const receiptPos = 20;
    const paymentPartPos = 220;
    let newPos;

    // render receipt
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(t.receipt, receiptPos, topPos);
    newPos = topPos + 30;
    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .text(t.accountPayableTo, receiptPos, newPos);
    newPos = newPos + 12;
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(this._iban.printFormat(params.account), receiptPos, newPos);
    newPos = newPos + 12;
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(params.debtor.name, receiptPos, newPos);
    newPos = newPos + 12;
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(params.debtor.address, receiptPos, newPos);
    newPos = newPos + 12;
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(params.debtor.postalCode + ' ' + params.debtor.locality, receiptPos, newPos);
    newPos = newPos + 30;
    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .text(t.reference, receiptPos, newPos);
    newPos = newPos + 12;
    doc
      .fontSize(10)
      .font('Helvetica')
      // TODO format this
      .text(params.reference, receiptPos, newPos);
    newPos = newPos + 30;
    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .text(t.payableBy, receiptPos, newPos);
    newPos = newPos + 12;
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(params.creditor.name, receiptPos, newPos);
    newPos = newPos + 12;
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(params.creditor.address, receiptPos, newPos);
    newPos = newPos + 12;
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(params.creditor.postalCode + ' ' + params.debtor.locality, receiptPos, newPos);

    // render payment part
    newPos = topPos;
    doc
      .moveTo(paymentPartPos - 20, newPos - 20) // set the current point
      .lineTo(paymentPartPos - 20, newPos + 400)
      .stroke();
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(t.paymentPart, paymentPartPos, newPos);
    newPos = topPos + 30;
    doc.image(code, paymentPartPos, newPos, { width: 150 });

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
