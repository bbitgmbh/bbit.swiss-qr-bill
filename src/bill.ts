/* eslint-disable @typescript-eslint/no-explicit-any */
import { BbitQRCodeGenerator } from './qr';
import { isNodeJs, CustomWritableStream, translations, scissorsHImageBuffer, scissorsVImageBuffer } from './utils';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import Helvetica from 'pdfkit/js/data/Helvetica.afm';
import HelveticaBold from 'pdfkit/js/data/Helvetica-Bold.afm';
import {
  BbitBankingReference,
  BbitIBAN,
  IBbitQRBillTranslations,
  IBbitQRBill,
  BbitQRBillAddressType,
  BbitQRBillFormat,
} from '@bbitgmbh/bbit.banking-utils';

interface IPDFOptions {
  titleFontSize: number;
  receiptTitleFontSize: number;
  receiptFontSize: number;
  paymentTitleFontSize: number;
  paymentFontSize: number;
  topY: number;
  receiptX: number;
  paymentPartLeftX: number;
  paymentPartRightX: number;
  amountY: number;
}

export class BbitQRBillGenerator {
  private _qr = new BbitQRCodeGenerator();
  private _iban = new BbitIBAN();
  private _reference = new BbitBankingReference();
  private _t: IBbitQRBillTranslations;
  public constructor() {
    if (!isNodeJs) {
      fs.writeFileSync('data/Helvetica.afm', Helvetica);
      fs.writeFileSync('data/Helvetica-Bold.afm', HelveticaBold);
    }
  }

  public async generate(params: IBbitQRBill): Promise<Buffer | Blob> {
    // prepare format
    let topY: number;
    let size: [number, number];
    let generateAsA4: boolean;
    let preventLines: boolean;
    switch (params.format) {
      case BbitQRBillFormat.DEFAULT_WITHOUT_LINES:
        preventLines = true;
      case BbitQRBillFormat.DEFAULT:
        generateAsA4 = false;
        topY = 15;
        size = [297.64, 595.28];
        break;
      case BbitQRBillFormat.A4_WITHOUT_LINES:
        preventLines = true;
      case BbitQRBillFormat.A4:
      default:
        generateAsA4 = true;
        topY = 559.23;
        size = [841.89, 595.28];
        break;
    }

    // create document and pipe stream
    const doc = new PDFDocument({
      layout: 'landscape',
      size,
      margin: 0,
    });
    const stream = new CustomWritableStream();
    doc.pipe(stream as any);

    // create qr code
    const code = await this._qr.generate(params);

    // set translations
    this._t = translations[params.language];

    // prepare rendering options
    const options: IPDFOptions = {
      titleFontSize: 11,
      receiptTitleFontSize: 6,
      receiptFontSize: 8,
      paymentTitleFontSize: 8,
      paymentFontSize: 10,

      // define default positions
      topY,
      receiptX: 15,
      paymentPartLeftX: 200,
      paymentPartRightX: 360,
      amountY: topY + 190,
    };

    this._renderReceipt(doc, params, options);
    this._renderPayment(doc, params, code, options);

    if (!preventLines) {
      this._renderLines(doc, generateAsA4, options);
    }

    doc.end();

    return new Promise((resolve): void => {
      stream.on('finish', async (): Promise<void> => {
        if (isNodeJs) {
          resolve(stream.toBuffer());
        } else {
          resolve(stream.toBlob());
        }
      });
    });
  }

  private _renderLines(doc: any, generateAsA4: boolean, options: IPDFOptions): void {
    const top = options.topY - 15;
    const left = options.paymentPartLeftX - 20;
    doc
      .moveTo(left, top) // set the current point
      .lineTo(left, top + 300)
      .stroke();

    if (generateAsA4) {
      doc.moveTo(0, top).lineTo(600, top).stroke();
      doc.image(scissorsHImageBuffer, options.receiptX, top - 5, { height: 10 });
      doc.image(scissorsVImageBuffer, left - 5, top + 265, { width: 10 });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _renderReceipt(doc: any, params: IBbitQRBill, options: IPDFOptions): void {
    // render receipt
    let newY = options.topY;
    doc.fontSize(options.titleFontSize).font('Helvetica-Bold').text(this._t.receipt, options.receiptX, newY);

    newY = options.topY + options.titleFontSize * 2;

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
  private _renderPayment(doc: any, params: IBbitQRBill, code: Buffer | ArrayBuffer, options: IPDFOptions): void {
    // left part
    // line
    let newY = options.topY;

    // title
    doc.fontSize(options.titleFontSize).font('Helvetica-Bold').text(this._t.paymentPart, options.paymentPartLeftX, newY);

    // qr code
    newY = options.topY + 30;
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
    newY = options.topY;
    newY = this._renderPayableTo(doc, options.paymentPartRightX, newY, options.paymentTitleFontSize, options.paymentFontSize, params);
    newY = this._renderReference(doc, options.paymentPartRightX, newY, options.paymentTitleFontSize, options.paymentFontSize, params);

    if (params.unstructuredMessage || params.billInformation) {
      newY = newY + (options.paymentFontSize + 1) * 2;
      doc.fontSize(options.paymentTitleFontSize).font('Helvetica-Bold').text(this._t.additionalInfo, options.paymentPartRightX, newY);

      let message = '';

      if (params.unstructuredMessage) {
        message += params.unstructuredMessage;
      }

      // If both elements are filled in, then a line break can be introduced
      // after the information in the first element “Ustrd”(Unstructured message)
      if (message && params.billInformation) {
        message += '\n';
      }

      if (params.billInformation) {
        message += params.billInformation;
      }

      // Both fields together can only contain a maximum of 140characters.
      // If not all the details contained in the QR code can be displayed,
      // the shortened content must be marked with an ellipsis “...” at the end.
      if (message.length > 140) {
        message = `${message.slice(0, 139)}…`;
      }

      // Hack to ensure each line will be printed on one line in the PDF
      // Otherwise, we can't track correctly the newY position
      const messageLines = message.split('\n').flatMap((l): RegExpMatchArray => l.match(/.{1,40}/g));
      for (const line of messageLines) {
        newY = newY + options.paymentFontSize + 1;
        doc.fontSize(options.paymentFontSize).font('Helvetica').text(line, options.paymentPartRightX, newY);
      }
    }
    newY = this._renderPayableBy(doc, options.paymentPartRightX, newY, options.paymentTitleFontSize, options.paymentFontSize, params);
  }

  private _renderPayableTo(doc: any, x: number, y: number, titleFontSize: number, fontSize: number, params: IBbitQRBill): number {
    doc.fontSize(titleFontSize).font('Helvetica-Bold').text(this._t.accountPayableTo, x, y);

    y = y + fontSize + 1;
    doc.fontSize(fontSize).font('Helvetica').text(this._iban.printFormat(params.account), x, y);

    y = y + fontSize + 1;
    doc.fontSize(fontSize).font('Helvetica').text(params.creditor.name, x, y);

    y = y + fontSize + 1;
    doc
      .fontSize(fontSize)
      .font('Helvetica')
      .text(
        params.creditor.type === BbitQRBillAddressType.STRUCTURED
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

  private _renderReference(doc: any, x: number, y: number, titleFontSize: number, fontSize: number, params: IBbitQRBill): number {
    if (params.reference) {
      y = y + (fontSize + 1) * 2;
      doc.fontSize(titleFontSize).font('Helvetica-Bold').text(this._t.reference, x, y);

      y = y + fontSize + 1;
      doc.fontSize(fontSize).font('Helvetica').text(this._reference.format(params.reference), x, y);
    }
    return y;
  }

  private _renderPayableBy(doc: any, x: number, y: number, titleFontSize: number, fontSize: number, params: IBbitQRBill): number {
    y = y + (fontSize + 1) * 2;
    doc.fontSize(titleFontSize).font('Helvetica-Bold').text(this._t.payableBy, x, y);

    y = y + fontSize + 1;
    doc.fontSize(fontSize).font('Helvetica').text(params.debtor.name, x, y);

    y = y + fontSize + 1;
    doc
      .fontSize(fontSize)
      .font('Helvetica')
      .text(
        params.debtor.type === BbitQRBillAddressType.STRUCTURED
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

  private _renderAmount(doc: any, x: number, y: number, titleFontSize: number, fontSize: number, params: IBbitQRBill): number {
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
