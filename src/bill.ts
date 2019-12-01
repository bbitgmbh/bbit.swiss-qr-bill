import { ReferenceValidator } from './reference/reference';
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
  private _reference = new ReferenceValidator();
  public async generate(params: IQRBill): Promise<Buffer | Blob> {
    // create document and pipe stream
    // const doc = new PDFDocument();
    const doc = new PDFDocument({
      layout: 'landscape',
      size: [300, 595.28],
      margin: 0,
    });
    const stream = new CustomWritableStream();
    doc.pipe(stream);

    // create code
    const code = await this._qr.generate(params);

    // load translations
    const t = translations[params.language];

    // font sizes
    const titleFontSie = 11;
    const receiptTitleFontSize = 6;
    const receiptFontSize = 8;
    const paymentTitleFontSize = 8;
    const paymentFontSize = 10;

    // define default positions
    const topPos = 15;
    const receiptPos = 15;
    const paymentPartLeftPos = 200;
    const paymentPartRightPos = 360;
    const amountPos = topPos + 190;
    let newPos;

    // render receipt
    doc
      .fontSize(titleFontSie)
      .font('Helvetica-Bold')
      .text(t.receipt, receiptPos, topPos);
    newPos = topPos + titleFontSie * 2;
    doc
      .fontSize(receiptTitleFontSize)
      .font('Helvetica-Bold')
      .text(t.accountPayableTo, receiptPos, newPos);
    newPos = newPos + receiptFontSize + 1;
    doc
      .fontSize(receiptFontSize)
      .font('Helvetica')
      .text(this._iban.printFormat(params.account), receiptPos, newPos);
    newPos = newPos + receiptFontSize + 1;
    doc
      .fontSize(receiptFontSize)
      .font('Helvetica')
      .text(params.debtor.name, receiptPos, newPos);
    newPos = newPos + receiptFontSize + 1;
    doc
      .fontSize(receiptFontSize)
      .font('Helvetica')
      .text(params.debtor.address, receiptPos, newPos);
    newPos = newPos + receiptFontSize + 1;
    doc
      .fontSize(receiptFontSize)
      .font('Helvetica')
      .text(params.debtor.postalCode + ' ' + params.debtor.locality, receiptPos, newPos);
    if (params.reference) {
      newPos = newPos + (receiptFontSize + 1) * 2;
      doc
        .fontSize(receiptTitleFontSize)
        .font('Helvetica-Bold')
        .text(t.reference, receiptPos, newPos);
      newPos = newPos + receiptFontSize + 1;
      doc
        .fontSize(receiptFontSize)
        .font('Helvetica')
        .text(this._reference.format(params.reference), receiptPos, newPos);
    }
    newPos = newPos + (receiptFontSize + 1) * 2;
    doc
      .fontSize(receiptTitleFontSize)
      .font('Helvetica-Bold')
      .text(t.payableBy, receiptPos, newPos);
    newPos = newPos + receiptFontSize + 1;
    doc
      .fontSize(receiptFontSize)
      .font('Helvetica')
      .text(params.creditor.name, receiptPos, newPos);
    newPos = newPos + receiptFontSize + 1;
    doc
      .fontSize(receiptFontSize)
      .font('Helvetica')
      .text(params.creditor.address, receiptPos, newPos);
    newPos = newPos + receiptFontSize + 1;
    doc
      .fontSize(receiptFontSize)
      .font('Helvetica')
      .text(params.creditor.postalCode + ' ' + params.creditor.locality, receiptPos, newPos);

    newPos = amountPos;
    doc
      .fontSize(receiptTitleFontSize)
      .font('Helvetica-Bold')
      .text(t.currency, receiptPos, newPos);
    newPos = newPos + receiptFontSize + 1;
    doc
      .fontSize(receiptFontSize)
      .font('Helvetica')
      .text(params.currency, receiptPos, newPos);

    newPos = amountPos;
    doc
      .fontSize(receiptTitleFontSize)
      .font('Helvetica-Bold')
      .text(t.amount, receiptPos + 40, newPos);
    newPos = newPos + receiptFontSize + 1;
    doc
      .fontSize(receiptFontSize)
      .font('Helvetica')
      .text(this._parseAmount(params.amount), receiptPos + 40, newPos);

    newPos = amountPos + 30;
    doc
      .fontSize(receiptTitleFontSize)
      .font('Helvetica-Bold')
      .text(t.acceptancePoint, receiptPos + 40, newPos, { width: 110, align: 'right' });

    // render payment part
    newPos = topPos;
    doc
      .moveTo(paymentPartLeftPos - 20, newPos - 20) // set the current point
      .lineTo(paymentPartLeftPos - 20, newPos + 300)
      .stroke();
    doc
      .fontSize(titleFontSie)
      .font('Helvetica-Bold')
      .text(t.paymentPart, paymentPartLeftPos, newPos);
    newPos = topPos + 30;
    doc.image(code, paymentPartLeftPos, newPos, { width: 140 });

    newPos = amountPos;
    doc
      .fontSize(paymentTitleFontSize)
      .font('Helvetica-Bold')
      .text(t.currency, paymentPartLeftPos, newPos);
    newPos = newPos + paymentFontSize + 1;
    doc
      .fontSize(paymentFontSize)
      .font('Helvetica')
      .text(params.currency, paymentPartLeftPos, newPos);

    newPos = amountPos;
    doc
      .fontSize(paymentTitleFontSize)
      .font('Helvetica-Bold')
      .text(t.amount, paymentPartLeftPos + 50, newPos);
    newPos = newPos + paymentFontSize + 1;
    doc
      .fontSize(paymentFontSize)
      .font('Helvetica')
      .text(this._parseAmount(params.amount), paymentPartLeftPos + 50, newPos);

    newPos = topPos;
    doc
      .fontSize(paymentTitleFontSize)
      .font('Helvetica-Bold')
      .text(t.accountPayableTo, paymentPartRightPos, newPos);
    newPos = newPos + paymentFontSize + 1;
    doc
      .fontSize(paymentFontSize)
      .font('Helvetica')
      .text(this._iban.printFormat(params.account), paymentPartRightPos, newPos);
    newPos = newPos + paymentFontSize + 1;
    doc
      .fontSize(paymentFontSize)
      .font('Helvetica')
      .text(params.debtor.name, paymentPartRightPos, newPos);
    newPos = newPos + paymentFontSize + 1;
    doc
      .fontSize(paymentFontSize)
      .font('Helvetica')
      .text(params.debtor.address, paymentPartRightPos, newPos);
    newPos = newPos + paymentFontSize + 1;
    doc
      .fontSize(paymentFontSize)
      .font('Helvetica')
      .text(params.debtor.postalCode + ' ' + params.debtor.locality, paymentPartRightPos, newPos);
    if (params.reference) {
      newPos = newPos + (paymentFontSize + 1) * 2;
      doc
        .fontSize(paymentTitleFontSize)
        .font('Helvetica-Bold')
        .text(t.reference, paymentPartRightPos, newPos);
      newPos = newPos + paymentFontSize + 1;
      doc
        .fontSize(paymentFontSize)
        .font('Helvetica')
        .text(this._reference.format(params.reference), paymentPartRightPos, newPos, { lineBreak: false });
    }

    if (params.unstructeredMessage && params.billInformation) {
      newPos = newPos + (paymentFontSize + 1) * 2;
      doc
        .fontSize(paymentTitleFontSize)
        .font('Helvetica-Bold')
        .text(t.additionalInfo, paymentPartRightPos, newPos);
      const message = params.billInformation || params.unstructeredMessage;
      for (const line of message.split('\n')) {
        newPos = newPos + paymentFontSize + 1;
        doc
          .fontSize(paymentFontSize)
          .font('Helvetica')
          .text(line, paymentPartRightPos, newPos);
      }
    }

    newPos = newPos + (paymentFontSize + 1) * 2;
    doc
      .fontSize(paymentTitleFontSize)
      .font('Helvetica-Bold')
      .text(t.payableBy, paymentPartRightPos, newPos);
    newPos = newPos + paymentFontSize + 1;
    doc
      .fontSize(paymentFontSize)
      .font('Helvetica')
      .text(params.creditor.name, paymentPartRightPos, newPos);
    newPos = newPos + paymentFontSize + 1;
    doc
      .fontSize(paymentFontSize)
      .font('Helvetica')
      .text(params.creditor.address, paymentPartRightPos, newPos);
    newPos = newPos + paymentFontSize + 1;
    doc
      .fontSize(paymentFontSize)
      .font('Helvetica')
      .text(params.creditor.postalCode + ' ' + params.creditor.locality, paymentPartRightPos, newPos);

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

  private _parseAmount(amount: number): string {
    return amount.toFixed(2).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1 ');
  }

  // private _mmToPt(mm: number): number {
  //   return mm * 2.83465;
  // }
}
