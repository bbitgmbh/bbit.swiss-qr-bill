import { isNodeJs, swissCrossImage, QRData } from './utils';
import { QRBillValidationError } from './errors/validation-error';
import * as qrcode from 'qrcode';
import { Image, createCanvas, Canvas } from 'canvas';
import {
  BbitIBAN,
  BbitBankingReference,
  IBbitQRBill,
  BbitQRBillVersion,
  BbitQRBillAddressType,
  IBbitQRBillAddress,
  IBbitQRBillBillInformation,
} from '@bbitgmbh/bbit.banking-utils';

export class BbitQRCodeGenerator {
  private _iban = new BbitIBAN();
  private _reference = new BbitBankingReference();

  public generateQrBillInformation(data: string | IBbitQRBillBillInformation): string {
    if (typeof data === 'string') {
      return data || '';
    }
    if (!data) {
      return '';
    }
    const values = [];
    if (data.documentNumber) {
      values.push(`/10/${data.documentNumber.replace(/\//g, '_')}`);
    }
    if (data.documentDate) {
      values.push(`/11/${data.documentDate}`);
    }
    if (data.customerReference) {
      values.push(`/20/${data.customerReference.replace(/\//g, '_')}`);
    }
    if (data.vatNumber) {
      values.push(`/30/${data.vatNumber.replace(/\D/g, '')}`);
    }
    if (data.vatDate) {
      if (typeof data.vatDate === 'string') {
        values.push(`/31/${data.vatDate}`);
      } else {
        values.push(`/31/${data.vatDate.start}${data.vatDate.end}`);
      }
    }
    if (data.vat?.length > 0) {
      const arr = [];
      for (const o of data.vat) {
        if (!o.netAmount) {
          arr.push(o.rate);
          continue;
        }
        arr.push(`${o.rate}:${o.netAmount}`);
      }
      values.push(`/32/${arr.join(';')}`);
    }
    if (data.vatImportTax?.length > 0) {
      const arr = [];
      for (const o of data.vatImportTax) {
        arr.push(`${o.rate}:${o.vatAmount}`);
      }
      values.push(`/33/${arr.join(';')}`);
    }
    if (data.paymentTerms?.length > 0) {
      const arr = [];
      for (const o of data.paymentTerms) {
        arr.push(`${o.cashDiscountPercent || 0}:${o.days}`);
      }
      values.push(`/40/${arr.join(';')}`);
    }

    if (values.length > 0) {
      return '//S1' + values.join('');
    }
    return '';
  }

  public async generate(params: IBbitQRBill): Promise<ArrayBuffer | Buffer> {
    const data = this.generateQRCodeContent(params);

    const canvas = this._createCanvas();
    await qrcode.toCanvas(canvas, data, { margin: 0 });

    // adding swiss cross at center
    const imgDim = { width: 40, height: 40 };
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    const imageObj = this._createImage();
    imageObj.src = swissCrossImage;
    imageObj.width = imgDim.width;
    imageObj.height = imgDim.height;

    const drawSwissCross = (): void => {
      context?.drawImage(
        imageObj as HTMLImageElement,
        canvas.width / 2 - imgDim.width / 2,
        canvas.height / 2 - imgDim.height / 2,
        imgDim.width,
        imgDim.height,
      );
    };

    if (isNodeJs) {
      drawSwissCross();
    } else {
      await new Promise<void>(async (resolve): Promise<void> => {
        (imageObj as HTMLImageElement).addEventListener('load', async (): Promise<void> => {
          drawSwissCross();
          resolve();
        });
      });
    }

    if (isNodeJs) {
      return (canvas as Canvas).toBuffer();
    } else {
      /* istanbul ignore next: not tested with jest */
      return new Promise((resolve): void => {
        (canvas as unknown as HTMLCanvasElement).toBlob(async (blob: Blob): Promise<void> => {
          const buffer = await blob.arrayBuffer();
          resolve(buffer);
        });
      });
    }
  }

  public generateQRCodeContent(params: IBbitQRBill): string {
    this._setDefaultVersionIfMissing(params);
    this._verifyParams(params);
    const billInformation = this.generateQrBillInformation(params.billInformation);
    switch (params.version) {
      case BbitQRBillVersion.V2_0:
        const data = new QRData();
        data.add('SPC');
        data.add('0200');
        data.add('1');
        data.add(this._iban.electronicFormat(params.account));
        data.add(params.creditor.type);
        data.add(params.creditor.name.substring(0, 70));
        data.add(
          (params.creditor.type === BbitQRBillAddressType.STRUCTURED ? params.creditor.street : params.creditor.address).substring(0, 70),
        );
        data.add(
          params.creditor.type === BbitQRBillAddressType.STRUCTURED
            ? params.creditor.buildingNumber.substring(0, 16)
            : (params.creditor.postalCode + ' ' + params.creditor.locality).substring(0, 70),
        );
        data.add(params.creditor.type === BbitQRBillAddressType.STRUCTURED ? params.creditor.postalCode.substring(0, 16) : '');
        data.add(params.creditor.type === BbitQRBillAddressType.STRUCTURED ? params.creditor.locality.substring(0, 35) : '');
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
        data.add(params.debtor.type);
        data.add(params.debtor.name.substring(0, 70));
        data.add((params.debtor.type === BbitQRBillAddressType.STRUCTURED ? params.debtor.street : params.debtor.address).substring(0, 70));
        data.add(
          params.debtor.type === BbitQRBillAddressType.STRUCTURED
            ? params.debtor.buildingNumber.substring(0, 16)
            : (params.debtor.postalCode + ' ' + params.debtor.locality).substring(0, 70),
        );
        data.add(params.debtor.type === BbitQRBillAddressType.STRUCTURED ? params.debtor.postalCode.substring(0, 16) : '');
        data.add(params.debtor.type === BbitQRBillAddressType.STRUCTURED ? params.debtor.locality.substring(0, 35) : '');
        data.add(params.debtor.country);
        data.add(this._iban.isQRIBAN(params.account) ? 'QRR' : 'SCOR');
        data.add(params.reference.substring(0, 27));
        data.add((params.unstructuredMessage || '').substring(0, 140));
        data.add('EPD');
        if (billInformation) {
          data.add(billInformation.substring(0, 140));
        }
        data.add();
        return data.toString();
      default:
        throw new Error(`QR bill version ${params.version} is not supported`);
    }
  }

  private _verifyParams(params: IBbitQRBill): void {
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
          errors.push("Property 'reference' is not valid (QR-IBAN)");
        }
      } else {
        if (this._reference.isQRReference(params.reference) || !this._reference.isReferenceValid(params.reference)) {
          errors.push("Property 'reference' is not valid (non QR-IBAN)");
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

  private _verifyAddress(address: IBbitQRBillAddress, type: 'creditor' | 'debtor'): string[] {
    const errors: string[] = [];

    if (!address) {
      errors.push(`Property '${type}' has to be defined`);
      return errors;
    }

    if (!address.type) {
      errors.push(`Property 'type' on '${type}' has to be defined`);
    }

    if (!address.name) {
      errors.push(`Property 'name' on '${type}' has to be defined`);
    }

    // Not required
    // if (address.type === BbitQRBillAddressType.UNSTRUCTURED) {
    //   if (!address.address) {
    //     errors.push(`Property 'address' on '${type}' has to be defined`);
    //   }
    // }

    // Not required
    // if (address.type === BbitQRBillAddressType.STRUCTURED) {
    //   if (!address.street) {
    //     errors.push(`Property 'street' on '${type}' has to be defined`);
    //   }
    //   if (!address.buildingNumber) {
    //     errors.push(`Property 'buildingNumber' on '${type}' has to be defined`);
    //   }
    // }

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

  private _setDefaultVersionIfMissing(params: IBbitQRBill): void {
    if (!params.version) {
      params.version = BbitQRBillVersion.V2_0;
    }
  }

  private _parseAmount(amount: number): string {
    return Number(amount).toFixed(2);
  }

  private _createCanvas(): Canvas | HTMLCanvasElement {
    if (isNodeJs) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return createCanvas(500, 500);
    } else {
      /* istanbul ignore next: not tested with jest */
      return document.createElement('canvas');
    }
  }

  private _createImage(): Image | HTMLImageElement {
    if (isNodeJs) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return new Image();
    } else {
      /* istanbul ignore next: not tested with jest */
      return document.createElement('img');
    }
  }
}
