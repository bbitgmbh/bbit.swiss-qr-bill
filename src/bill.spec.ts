import { BbitQRBillFormat } from '@bbitgmbh/bbit.banking-utils/dist';
import { describe, expect, it } from 'vitest';
import { BbitQRBillGenerator } from './bill';
import { defaultData, largeData } from './data';
import { pdfBufferToImage } from './test-utils';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
expect.extend({ toMatchImageSnapshot });

const bill = new BbitQRBillGenerator();

describe('QRBill', (): void => {
  it('should create bills in A6', async (): Promise<void> => {
    defaultData.format = BbitQRBillFormat.DEFAULT;
    const data = await bill.generate(defaultData);
    expect(data).toBeDefined();
    const image = await pdfBufferToImage(data);
    // set higher threshold because inline fonts are not loaded and might be slightly different
    expect(image).toMatchImageSnapshot({
      failureThreshold: 0.05,
      failureThresholdType: 'percent',
    });
  });

  it('should create bills in A6 without lines', async (): Promise<void> => {
    defaultData.format = BbitQRBillFormat.DEFAULT_WITHOUT_LINES;
    const data = await bill.generate(defaultData);
    expect(data).toBeDefined();
    const image = await pdfBufferToImage(data);
    // set higher threshold because inline fonts are not loaded and might be slightly different
    expect(image).toMatchImageSnapshot({
      failureThreshold: 0.05,
      failureThresholdType: 'percent',
    });
  });

  it('should create bills with wraped lines', async (): Promise<void> => {
    largeData.format = BbitQRBillFormat.DEFAULT;
    const data = await bill.generate(largeData);
    expect(data).toBeDefined();
    const image = await pdfBufferToImage(data);
    // set even higher threshold because inline fonts are not loaded and might be slightly different on different os
    expect(image).toMatchImageSnapshot({
      failureThreshold: 0.1,
      failureThresholdType: 'percent',
    });
  });

  it('should create bills in A4', async (): Promise<void> => {
    defaultData.format = BbitQRBillFormat.A4;
    const data = await bill.generate(defaultData);
    expect(data).toBeDefined();
    const image = await pdfBufferToImage(data);
    // set higher threshold because inline fonts are not loaded and might be slightly different
    expect(image).toMatchImageSnapshot({
      failureThreshold: 0.05,
      failureThresholdType: 'percent',
    });
  });

  it('should create bills in A4 without lines', async (): Promise<void> => {
    defaultData.format = BbitQRBillFormat.A4_WITHOUT_LINES;
    const data = await bill.generate(defaultData);
    expect(data).toBeDefined();
    const image = await pdfBufferToImage(data);
    // set higher threshold because inline fonts are not loaded and might be slightly different
    expect(image).toMatchImageSnapshot({
      failureThreshold: 0.05,
      failureThresholdType: 'percent',
    });
  });

  it('should create bills in A4 with separation hint', async (): Promise<void> => {
    defaultData.format = BbitQRBillFormat.A4_WITH_SEPARATION_HINT;
    const data = await bill.generate(defaultData);
    expect(data).toBeDefined();
    const image = await pdfBufferToImage(data);
    // set higher threshold because inline fonts are not loaded and might be slightly different
    expect(image).toMatchImageSnapshot({
      failureThreshold: 0.05,
      failureThresholdType: 'percent',
    });
  });

  it('should create bills in A4 with billInformation object', async (): Promise<void> => {
    const data = await bill.generate({
      format: '#a4',
      version: '0200',
      amount: 50,
      currency: 'CHF',
      account: 'CH2330790042925150552',
      creditor: {
        name: 'demo gmbh',
        locality: 'Steffisburg',
        country: 'CH',
        address: 'Rainweg 10',
        type: 'K',
        postalCode: '3612',
      },
      reference: '000000000000000000231010023',
      debtor: {
        name: 'Lindenhof Kevin',
        locality: 'Steffisburg',
        country: 'CH',
        address: 'Musterweg 2',
        type: 'K',
        postalCode: '3612',
      },
      billInformation: {
        documentNumber: 'RG-23-10100-2',
        documentDate: '230303',
        vatDate: '230303',
        vat: [
          {
            rate: 7.7,
            _id: '#7GhQygVU2dPEMAR5tArwP',
          },
        ],
        vatImportTax: [],
        paymentTerms: [
          {
            days: 30,
            _id: '#JiLGf6hPABDkzAdhtEbdt',
          },
        ],
      },
      language: 'de-CH',
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } as any);
    expect(data).toBeDefined();
    const image = await pdfBufferToImage(data);
    // set higher threshold because inline fonts are not loaded and might be slightly different
    expect(image).toMatchImageSnapshot({
      failureThreshold: 0.05,
      failureThresholdType: 'percent',
    });
  });
});
