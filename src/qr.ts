import { ReferenceValidator } from './reference/reference';
import { isNodeJs } from './utils';
import { swissCorssImage } from './swiss-cross';
import { QRData } from './qr-data';
import { QRBillValidationError } from './errors/validation-error';
import { IQRBill, QRBillVersion, IQRBillAddress } from './interfaces';
import { IBAN } from './iban/iban';
import * as qrcode from 'qrcode';
import { Image, Canvas } from 'canvas';

export class QRCodeGenerator {
  private _iban = new IBAN();
  private _reference = new ReferenceValidator();

  public async generate(params: IQRBill): Promise<Blob | Buffer> {
    const data = this.generateQRCodeContent(params);

    const canvas = await qrcode.toCanvas(this._createCanvas(), data, { margin: 0 });

    // adding logo at center
    const imgDim = { width: 30, height: 30 }; //logo dimention
    const context = canvas.getContext('2d');
    const imageObj = this._createImage();
    imageObj.src = swissCorssImage;
    context.drawImage(imageObj, canvas.width / 2 - imgDim.width / 2, canvas.height / 2 - imgDim.height / 2, imgDim.width, imgDim.height);

    if (isNodeJs) {
      return canvas.toBuffer();
    } else {
      /* istanbul ignore next: not tesed with jest */
      return canvas.toBlob();
    }
  }

  public generateQRCodeContent(params: IQRBill): string {
    this._setDefaultVersionIfMissing(params);
    this._verifyParams(params);
    switch (params.version) {
      case QRBillVersion.V2_0:
        const data = new QRData();
        data.add('SPC');
        data.add('0200');
        data.add('1');
        data.add(this._iban.electronicFormat(params.account));
        data.add('K');
        data.add(params.creditor.name);
        data.add(params.creditor.address);
        data.add(params.creditor.postalCode + ' ' + params.creditor.locality);
        data.add();
        data.add();
        data.add(params.creditor.country);
        data.add();
        data.add();
        data.add();
        data.add();
        data.add();
        data.add();
        data.add();
        data.add(this._parseAmount(params.amount));
        data.add(params.currency);
        data.add('K');
        data.add(params.debtor.name);
        data.add(params.debtor.address);
        data.add(params.debtor.postalCode + ' ' + params.debtor.locality);
        data.add();
        data.add();
        data.add(params.creditor.country);
        data.add(this._iban.isQRIBAN(params.account) ? 'QRR' : 'SCOR');
        data.add(params.reference);
        data.add(params.unstructeredMessage);
        data.add('EPD');
        data.add();
        return data.toString();
      default:
        throw new Error(`QR bill version ${params.version} is not supported`);
    }
  }

  private _verifyParams(params: IQRBill): void {
    const errors: string[] = [];

    if (!params.account) {
      errors.push("Property 'account' has to be defined");
    } else {
      if (!this._iban.isValid(params.account)) {
        errors.push(`Property 'account' (IBAN) ${params.account} is not valid`);
      }
    }

    if (!params.reference) {
      errors.push("Property 'reference' has to be defined");
    } else {
      if (this._iban.isQRIBAN(params.account)) {
        if (!this._reference.isQRReference(params.reference) || !this._reference.isQRReferenceValid(params.reference)) {
          errors.push("Property 'reference' is not valid");
        }
      } else {
        if (this._reference.isQRReference(params.reference) || !this._reference.isReferenceValid(params.reference)) {
          errors.push("Property 'reference' is not valid");
        }
      }
    }

    if (!params.currency) {
      errors.push("Property 'currency' has to be defined");
    }

    if (!params.amount) {
      errors.push("Property 'amount' has to be defined");
    }

    errors.push(...this._verifyAddress(params.creditor, 'creditor'));
    errors.push(...this._verifyAddress(params.debtor, 'debtor'));

    if (errors.length > 0) {
      throw new QRBillValidationError(errors);
    }
  }

  private _verifyAddress(address: IQRBillAddress, type: 'creditor' | 'debtor'): string[] {
    const errors: string[] = [];

    if (!address) {
      errors.push(`Property '${type}' has to be defined`);
      return errors;
    }

    if (!address.name) {
      errors.push(`Property 'name' on '${type}' has to be defined`);
    }

    if (!address.address) {
      errors.push(`Property 'address' on '${type}' has to be defined`);
    }

    if (!address.postalCode) {
      errors.push(`Property 'postalCode' on '${type}' has to be defined`);
    }

    if (!address.locality) {
      errors.push(`Property 'locality' on '${type}' has to be defined`);
    }

    if (!address.country) {
      errors.push(`Property 'country' on '${type}' has to be defined`);
    }

    return errors;
  }

  private _setDefaultVersionIfMissing(params: IQRBill): void {
    if (!params.version) {
      params.version = QRBillVersion.V2_0;
    }
  }

  private _parseAmount(amount: number): string {
    return Number(amount).toFixed(2);
  }

  private _createCanvas(): Canvas | HTMLCanvasElement {
    if (isNodeJs) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Canvas = require('canvas');
      return Canvas.createCanvas(500, 500);
    } else {
      /* istanbul ignore next: not tesed with jest */
      return document.createElement('canvas');
    }
  }

  private _createImage(): Image | HTMLImageElement {
    if (isNodeJs) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Canvas = require('canvas');
      return new Canvas.Image();
    } else {
      /* istanbul ignore next: not tesed with jest */
      return document.createElement('img');
    }
  }
}
