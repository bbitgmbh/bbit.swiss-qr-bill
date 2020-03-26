/* eslint-disable @typescript-eslint/no-explicit-any */
import { Reference } from './reference/reference';
import { QRCodeGenerator } from './qr';
import { isNodeJs, CustomWritableStream, translations } from './utils';
import { IQRBill, QRBillAddressType, ITranslations } from './interfaces';
import PDFDocument from 'pdfkit';
import { IBAN } from './iban/iban';
import * as fs from 'fs';
import Helvetica from 'pdfkit/js/data/Helvetica.afm';
import HelveticaBold from 'pdfkit/js/data/Helvetica-Bold.afm';

interface IPDFOptions {
  titleFontSize: number;
  receiptTitleFontSize: number;
  receiptFontSize: number;
  paymentTitleFontSize: number;
  paymentFontSize: number;
  topX: number;
  receiptX: number;
  paymentPartLeftX: number;
  paymentPartRightX: number;
  amountY: number;
}

export class QRBillGenerator {
  private _qr = new QRCodeGenerator();
  private _iban = new IBAN();
  private _reference = new Reference();
  private _t: ITranslations;
  public constructor() {
    if (!isNodeJs) {
      fs.writeFileSync('data/Helvetica.afm', Helvetica);
      fs.writeFileSync('data/Helvetica-Bold.afm', HelveticaBold);
    }
  }

  public async generate(params: IQRBill): Promise<Buffer | Blob> {
    // create document and pipe stream
    const doc = new PDFDocument({
      layout: 'landscape',
      size: [300, 595.28],
      margin: 0,
    });
    const stream = new CustomWritableStream();
    doc.pipe(stream as any);

    // create qr code
    const code = await this._qr.generate(params);

    // set translations
    this._t = translations[params.language];

    // prepare rendering options
    const topX = 15;
    const options: IPDFOptions = {
      titleFontSize: 11,
      receiptTitleFontSize: 6,
      receiptFontSize: 8,
      paymentTitleFontSize: 8,
      paymentFontSize: 10,

      // define default positions
      topX,
      receiptX: 15,
      paymentPartLeftX: 200,
      paymentPartRightX: 360,
      amountY: topX + 190,
    };

    this._renderReceipt(doc, params, options);

    this._renderPayment(doc, params, code, options);

    doc.end();

    return new Promise((resolve): void => {
      stream.on(
        'finish',
        async (): Promise<void> => {
          if (isNodeJs) {
            resolve(stream.toBuffer());
          } else {
            resolve(stream.toBlob());
          }
        },
      );
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _renderReceipt(doc: any, params: IQRBill, options: IPDFOptions): void {
    // render receipt
    let newY = options.topX;
    doc.fontSize(options.titleFontSize).font('Helvetica-Bold').text(this._t.receipt, options.receiptX, newY);

    newY = options.topX + options.titleFontSize * 2;

    newY = this._renderPayableTo(doc, options.receiptX, newY, options.receiptTitleFontSize, options.receiptFontSize, params);

    newY = this._renderReference(doc, options.receiptX, newY, options.receiptTitleFontSize, options.receiptFontSize, params);

    newY = this._renderPayableBy(doc, options.receiptX, newY, options.receiptTitleFontSize, options.receiptFontSize, params);

    newY = this._renderAmount(doc, options.receiptX, options.amountY, options.receiptTitleFontSize, options.receiptFontSize, params);

    newY = options.amountY + 30;
    doc
      .fontSize(options.receiptTitleFontSize)
      .font('Helvetica-Bold')
      .text(this._t.acceptancePoint, options.receiptX + 40, newY, { width: 110, align: 'right' });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _renderPayment(doc: any, params: IQRBill, code: Buffer | ArrayBuffer, options: IPDFOptions): void {
    // left part
    // line
    let newY = options.topX;
    doc
      .moveTo(options.paymentPartLeftX - 20, newY - 20) // set the current point
      .lineTo(options.paymentPartLeftX - 20, newY + 300)
      .stroke();

    // titile
    doc.fontSize(options.titleFontSize).font('Helvetica-Bold').text(this._t.paymentPart, options.paymentPartLeftX, newY);

    // qr code
    newY = options.topX + 30;
    doc.image(code, options.paymentPartLeftX, newY, { width: 140 });

    newY = this._renderAmount(
      doc,
      options.paymentPartLeftX,
      options.amountY,
      options.paymentTitleFontSize,
      options.paymentFontSize,
      params,
    );

    // right part
    newY = options.topX;
    newY = this._renderPayableTo(doc, options.paymentPartRightX, newY, options.paymentTitleFontSize, options.paymentFontSize, params);
    newY = this._renderReference(doc, options.paymentPartRightX, newY, options.paymentTitleFontSize, options.paymentFontSize, params);

    if (params.unstructeredMessage && params.billInformation) {
      newY = newY + (options.paymentFontSize + 1) * 2;
      doc.fontSize(options.paymentTitleFontSize).font('Helvetica-Bold').text(this._t.additionalInfo, options.paymentPartRightX, newY);
      const message = params.billInformation || params.unstructeredMessage;
      for (const line of message.split('\n')) {
        newY = newY + options.paymentFontSize + 1;
        doc.fontSize(options.paymentFontSize).font('Helvetica').text(line, options.paymentPartRightX, newY);
      }
    }
  }

  private _renderPayableTo(doc: any, x: number, y: number, titleFontSize: number, fontSize: number, params: IQRBill): number {
    doc.fontSize(titleFontSize).font('Helvetica-Bold').text(this._t.accountPayableTo, x, y);

    y = y + fontSize + 1;
    doc.fontSize(fontSize).font('Helvetica').text(this._iban.printFormat(params.account), x, y);

    y = y + fontSize + 1;
    doc.fontSize(fontSize).font('Helvetica').text(params.debtor.name, x, y);

    y = y + fontSize + 1;
    doc
      .fontSize(fontSize)
      .font('Helvetica')
      .text(
        params.debtor.type === QRBillAddressType.STRUCTURED
          ? params.debtor.street + ' ' + params.debtor.buildingNumber
          : params.debtor.address,
        x,
        y,
      );

    y = y + fontSize + 1;
    doc
      .fontSize(fontSize)
      .font('Helvetica')
      .text(params.debtor.postalCode + ' ' + params.debtor.locality, x, y);

    return y;
  }

  private _renderReference(doc: any, x: number, y: number, titleFontSize: number, fontSize: number, params: IQRBill): number {
    if (params.reference) {
      y = y + (fontSize + 1) * 2;
      doc.fontSize(titleFontSize).font('Helvetica-Bold').text(this._t.reference, x, y);

      y = y + fontSize + 1;
      doc.fontSize(fontSize).font('Helvetica').text(this._reference.format(params.reference), x, y);
    }
    return y;
  }

  private _renderPayableBy(doc: any, x: number, y: number, titleFontSize: number, fontSize: number, params: IQRBill): number {
    y = y + (fontSize + 1) * 2;
    doc.fontSize(titleFontSize).font('Helvetica-Bold').text(this._t.payableBy, x, y);

    y = y + fontSize + 1;
    doc.fontSize(fontSize).font('Helvetica').text(params.creditor.name, x, y);

    y = y + fontSize + 1;
    doc
      .fontSize(fontSize)
      .font('Helvetica')
      .text(
        params.creditor.type === QRBillAddressType.STRUCTURED
          ? params.creditor.street + ' ' + params.creditor.buildingNumber
          : params.creditor.address,
        x,
        y,
      );
    y = y + fontSize + 1;

    doc
      .fontSize(fontSize)
      .font('Helvetica')
      .text(params.creditor.postalCode + ' ' + params.creditor.locality, x, y);

    return y;
  }

  private _renderAmount(doc: any, x: number, y: number, titleFontSize: number, fontSize: number, params: IQRBill): number {
    doc.fontSize(titleFontSize).font('Helvetica-Bold').text(this._t.currency, x, y);

    doc
      .fontSize(fontSize)
      .font('Helvetica')
      .text(params.currency, x, y + fontSize + 1);

    doc
      .fontSize(titleFontSize)
      .font('Helvetica-Bold')
      .text(this._t.amount, x + 40, y);

    doc
      .fontSize(fontSize)
      .font('Helvetica')
      .text(this._parseAmount(params.amount), x + 40, y + fontSize + 1);

    return y + fontSize + 1;
  }

  private _parseAmount(amount: number): string {
    return amount.toFixed(2).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, '$1 ');
  }
}
