/* eslint-disable @typescript-eslint/no-explicit-any */
import { IQRBillAddress } from './../dist/types/interfaces.d';
import { QRBillValidationError } from './errors/validation-error';
import { IQRBill, QRBillVersion, QRBillLanguage, QRBillCurrency, QRBillAddressType } from './interfaces';
import { QRCodeGenerator } from './qr';
import * as _ from 'lodash';

const qr = new QRCodeGenerator();

const defaultData: IQRBill = {
  account: 'CH2830000011623852950',
  amount: 100.0,
  currency: QRBillCurrency.CHF,
  creditor: {
    type: QRBillAddressType.UNSTRUCTURED,
    name: 'bbit gmbh',
    address: 'Rainweg 10',
    postalCode: '3612',
    locality: 'Steffisburg',
    country: 'CH',
  },
  reference: '000000000000000012312312316',
  debtor: {
    type: QRBillAddressType.UNSTRUCTURED,
    name: 'Test AG',
    address: 'Musterstrasse 1',
    postalCode: '3600',
    locality: 'Thun',
    country: 'CH',
  },
  unstructeredMessage: 'Test message',
  billInformation: 'Test billing information',
  language: QRBillLanguage.DE,
};

describe('QR test', (): void => {
  it('Usnupported version should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.version = 'unsupported' as QRBillVersion;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toEqual(new Error(`QR bill version ${cloned.version} is not supported`));
  });

  it('Missing account (IBAN) should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    delete cloned.account;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(2);
    expect(error.getValidationErrors()[0]).toBe("Property 'account' has to be defined");
  });

  it('Invalid account (IBAN) should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.account = 'CH2830000011623852951';
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(1);
    expect(error.getValidationErrors()[0]).toBe(`Property 'account' (IBAN) ${cloned.account} is not valid`);
  });

  it('Missing creditor should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    delete cloned.creditor;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(1);
    expect(error.getValidationErrors()[0]).toBe("Property 'creditor' has to be defined");
  });

  it('Missing creditor properties should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.creditor = {} as any;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(5);
    expect(error.getValidationErrors()[0]).toBe("Property 'name' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[1]).toBe("Property 'address' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[2]).toBe("Property 'postalCode' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[3]).toBe("Property 'locality' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[4]).toBe("Property 'country' on 'creditor' has to be defined");
  });

  it('Missing debtor should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    delete cloned.debtor;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(1);
    expect(error.getValidationErrors()[0]).toBe("Property 'debtor' has to be defined");
  });

  it('Missing debtor properties should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.debtor = {} as any;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(5);
    expect(error.getValidationErrors()[0]).toBe("Property 'name' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[1]).toBe("Property 'address' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[2]).toBe("Property 'postalCode' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[3]).toBe("Property 'locality' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[4]).toBe("Property 'country' on 'debtor' has to be defined");
  });

  it('Missing reference should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    delete cloned.reference;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(1);
    expect(error.getValidationErrors()[0]).toBe("Property 'reference' has to be defined");
  });

  it('Wrong reference should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.reference = '1234';
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(1);
    expect(error.getValidationErrors()[0]).toBe("Property 'reference' is not valid");
  });

  it('Missing currency should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    delete cloned.currency;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(1);
    expect(error.getValidationErrors()[0]).toBe("Property 'currency' has to be defined");
  });

  it('Missing amount should fail', (): void => {
    let error: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    delete cloned.amount;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(1);
    expect(error.getValidationErrors()[0]).toBe("Property 'amount' has to be defined");
  });

  it('generateQRCodeContent should work', (): void => {
    const data = qr.generateQRCodeContent(defaultData);
    expect(data).toBeDefined();
    expect(data).toMatchSnapshot();
  });

  it('generate should work', async (): Promise<void> => {
    const data = await qr.generate(defaultData);
    expect(data).toBeDefined();
    expect(data).toMatchSnapshot();
  });
});
