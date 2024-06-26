import { BbitQRBillAddressType, type BbitQRBillVersion } from '@bbitgmbh/bbit.banking-utils';
import _ from 'lodash';
import { defaultData } from './data';
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { QRBillValidationError } from './errors/validation-error';
import { BbitQRCodeGenerator } from './qr';
import { describe, expect, it } from 'vitest';

const qr = new BbitQRCodeGenerator();

describe('QR test', (): void => {
  it('Unsupported version should fail', (): void => {
    let error!: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.version = 'unsupported' as BbitQRBillVersion;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toEqual(new Error(`QR bill version ${cloned.version} is not supported`));
  });

  it('Missing account (IBAN) should fail', (): void => {
    let error!: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    // biome-ignore lint/performance/noDelete: <explanation>
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    delete (cloned as any).account;
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
    let error!: QRBillValidationError;
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
    let error!: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    // biome-ignore lint/performance/noDelete: <explanation>
    delete (cloned as any).creditor;
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
    let error!: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    cloned.creditor = {} as any;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(5);
    expect(error.getValidationErrors()[0]).toBe("Property 'type' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[1]).toBe("Property 'name' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[2]).toBe("Property 'postalCode' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[3]).toBe("Property 'locality' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[4]).toBe("Property 'country' on 'creditor' has to be defined");
  });

  it('Missing structured creditor properties should fail', (): void => {
    let error!: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.creditor = {
      type: BbitQRBillAddressType.STRUCTURED,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } as any;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(4);
    expect(error.getValidationErrors()[0]).toBe("Property 'name' on 'creditor' has to be defined");
    // expect(error.getValidationErrors()[1]).toBe("Property 'street' on 'creditor' has to be defined");
    // expect(error.getValidationErrors()[2]).toBe("Property 'buildingNumber' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[1]).toBe("Property 'postalCode' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[2]).toBe("Property 'locality' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[3]).toBe("Property 'country' on 'creditor' has to be defined");
  });

  it('Missing unstructured creditor properties should fail', (): void => {
    let error!: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.creditor = {
      type: BbitQRBillAddressType.UNSTRUCTURED,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } as any;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(4);
    expect(error.getValidationErrors()[0]).toBe("Property 'name' on 'creditor' has to be defined");
    // expect(error.getValidationErrors()[1]).toBe("Property 'address' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[1]).toBe("Property 'postalCode' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[2]).toBe("Property 'locality' on 'creditor' has to be defined");
    expect(error.getValidationErrors()[3]).toBe("Property 'country' on 'creditor' has to be defined");
  });

  it('Missing debtor should fail', (): void => {
    let error!: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    // biome-ignore lint/performance/noDelete: <explanation>
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    delete (cloned as any).debtor;
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
    let error!: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    cloned.debtor = {} as any;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(5);
    expect(error.getValidationErrors()[0]).toBe("Property 'type' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[1]).toBe("Property 'name' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[2]).toBe("Property 'postalCode' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[3]).toBe("Property 'locality' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[4]).toBe("Property 'country' on 'debtor' has to be defined");
  });

  it('Missing structured debtor properties should fail', (): void => {
    let error!: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.debtor = {
      type: BbitQRBillAddressType.STRUCTURED,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } as any;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(4);
    expect(error.getValidationErrors()[0]).toBe("Property 'name' on 'debtor' has to be defined");
    // expect(error.getValidationErrors()[1]).toBe("Property 'street' on 'debtor' has to be defined");
    // expect(error.getValidationErrors()[2]).toBe("Property 'buildingNumber' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[1]).toBe("Property 'postalCode' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[2]).toBe("Property 'locality' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[3]).toBe("Property 'country' on 'debtor' has to be defined");
  });

  it('Missing unstructured debtor properties should fail', (): void => {
    let error!: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.debtor = {
      type: BbitQRBillAddressType.UNSTRUCTURED,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } as any;
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(4);
    expect(error.getValidationErrors()[0]).toBe("Property 'name' on 'debtor' has to be defined");
    // expect(error.getValidationErrors()[1]).toBe("Property 'address' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[1]).toBe("Property 'postalCode' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[2]).toBe("Property 'locality' on 'debtor' has to be defined");
    expect(error.getValidationErrors()[3]).toBe("Property 'country' on 'debtor' has to be defined");
  });

  it('Missing reference should fail', (): void => {
    let error!: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    // biome-ignore lint/performance/noDelete: <explanation>
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    delete (cloned as any).reference;
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
    let error!: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    cloned.reference = '1234';
    try {
      qr.generateQRCodeContent(cloned);
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.getValidationErrors()).toHaveLength(1);
    expect(error.getValidationErrors()[0]).toBe("Property 'reference' is not valid (QR-IBAN)");
  });

  it('Missing currency should fail', (): void => {
    let error!: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    // biome-ignore lint/performance/noDelete: <explanation>
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    delete (cloned as any).currency;
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
    let error!: QRBillValidationError;
    const cloned = _.cloneDeep(defaultData);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    // biome-ignore lint/performance/noDelete: <explanation>
    delete (cloned as any).amount;
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

    const switchedAddresses = _.cloneDeep(defaultData);
    const save = switchedAddresses.debtor;
    switchedAddresses.debtor = defaultData.creditor;
    switchedAddresses.creditor = save;
    const data2 = qr.generateQRCodeContent(switchedAddresses);
    expect(data2).toBeDefined();
    expect(data2).toMatchSnapshot();

    const withoutMessage = _.cloneDeep(defaultData);
    // biome-ignore lint/performance/noDelete: <explanation>
    delete withoutMessage.unstructuredMessage;
    // biome-ignore lint/performance/noDelete: <explanation>
    delete withoutMessage.billInformation;
    const data3 = qr.generateQRCodeContent(withoutMessage);
    expect(data3).toBeDefined();
    expect(data3).toMatchSnapshot();
  });

  it('generate should work', async (): Promise<void> => {
    const data = await qr.generate(defaultData);
    expect(data).toBeDefined();
    expect(data).toMatchSnapshot();
  });
  it('generate billInformation should work', async (): Promise<void> => {
    expect(qr.generateQRBillInformation('test')).toBe('test');
    expect(qr.generateQRBillInformation({ documentNumber: '1234' })).toBe('//S1/10/1234');
    expect(
      qr.generateQRBillInformation({
        documentNumber: '1234',
        documentDate: '230301',
      }),
    ).toBe('//S1/10/1234/11/230301');
    expect(
      qr.generateQRBillInformation({
        documentNumber: '1234',
        documentDate: '230301',
        customerReference: 'test',
      }),
    ).toBe('//S1/10/1234/11/230301/20/test');
    expect(
      qr.generateQRBillInformation({
        documentNumber: '1234',
        documentDate: '230301',
        customerReference: 'test',
        vatNumber: 'CHE-000.000.000 MWST',
      }),
    ).toBe('//S1/10/1234/11/230301/20/test/30/000000000');
    expect(
      qr.generateQRBillInformation({
        documentNumber: '1234',
        documentDate: '230301',
        customerReference: 'test',
        vatNumber: 'CHE-000.000.000 MWST',
        vatDate: '230301',
      }),
    ).toBe('//S1/10/1234/11/230301/20/test/30/000000000/31/230301');
    expect(
      qr.generateQRBillInformation({
        documentNumber: '1234',
        documentDate: '230301',
        customerReference: 'test',
        vatNumber: 'CHE-000.000.000 MWST',
        vatDate: { start: '230301', end: '230302' },
      }),
    ).toBe('//S1/10/1234/11/230301/20/test/30/000000000/31/230301230302');
    expect(
      qr.generateQRBillInformation({
        documentNumber: '1234',
        documentDate: '230301',
        customerReference: 'test',
        vatNumber: 'CHE-000.000.000 MWST',
        vatDate: '230301',
        vat: [{ rate: 7.7 }],
      }),
    ).toBe('//S1/10/1234/11/230301/20/test/30/000000000/31/230301/32/7.7');
    expect(
      qr.generateQRBillInformation({
        documentNumber: '1234',
        documentDate: '230301',
        customerReference: 'test',
        vatNumber: 'CHE-000.000.000 MWST',
        vatDate: '230301',
        vat: [{ rate: 7.7, netAmount: 100 }],
      }),
    ).toBe('//S1/10/1234/11/230301/20/test/30/000000000/31/230301/32/7.7:100');
    expect(
      qr.generateQRBillInformation({
        documentNumber: '1234',
        documentDate: '230301',
        customerReference: 'test',
        vatNumber: 'CHE-000.000.000 MWST',
        vatDate: '230301',
        vat: [
          { rate: 7.7, netAmount: 100 },
          { rate: 2.5, netAmount: 100 },
        ],
      }),
    ).toBe('//S1/10/1234/11/230301/20/test/30/000000000/31/230301/32/7.7:100;2.5:100');
    expect(
      qr.generateQRBillInformation({
        documentNumber: '1234',
        documentDate: '230301',
        customerReference: 'test',
        vatNumber: 'CHE-000.000.000 MWST',
        vatDate: '230301',
        vat: [
          { rate: 7.7, netAmount: 100 },
          { rate: 2.5, netAmount: 100 },
        ],
        vatImportTax: [
          { rate: 7.7, vatAmount: 10 },
          { rate: 2.5, vatAmount: 10 },
        ],
      }),
    ).toBe('//S1/10/1234/11/230301/20/test/30/000000000/31/230301/32/7.7:100;2.5:100/33/7.7:10;2.5:10');
    expect(
      qr.generateQRBillInformation({
        documentNumber: '1234',
        documentDate: '230301',
        customerReference: 'test',
        vatNumber: 'CHE-000.000.000 MWST',
        vatDate: '230301',
        vat: [
          { rate: 7.7, netAmount: 100 },
          { rate: 2.5, netAmount: 100 },
        ],
        vatImportTax: [
          { rate: 7.7, vatAmount: 10 },
          { rate: 2.5, vatAmount: 10 },
        ],
        paymentTerms: [{ days: 30 }],
      }),
    ).toBe('//S1/10/1234/11/230301/20/test/30/000000000/31/230301/32/7.7:100;2.5:100/33/7.7:10;2.5:10/40/0:30');
    expect(
      qr.generateQRBillInformation({
        documentNumber: '1234',
        documentDate: '230301',
        customerReference: 'test',
        vatNumber: 'CHE-000.000.000 MWST',
        vatDate: '230301',
        vat: [
          { rate: 7.7, netAmount: 100 },
          { rate: 2.5, netAmount: 100 },
        ],
        vatImportTax: [
          { rate: 7.7, vatAmount: 10 },
          { rate: 2.5, vatAmount: 10 },
        ],
        paymentTerms: [{ days: 30 }, { days: 14, cashDiscountPercent: 2 }],
      }),
    ).toBe('//S1/10/1234/11/230301/20/test/30/000000000/31/230301/32/7.7:100;2.5:100/33/7.7:10;2.5:10/40/0:30;2:14');

    expect(
      qr.generateQRBillInformation({
        documentNumber: '1234/\\',
      }),
    ).toBe('//S1/10/1234\\/\\\\');
  });
});
