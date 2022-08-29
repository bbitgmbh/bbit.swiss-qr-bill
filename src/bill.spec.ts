import { pdfBufferToImage } from './test-utils';
import { BbitQRBillGenerator } from './bill';
import { defaultData, largeData } from './data';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { BbitQRBillFormat } from '@bbitgmbh/bbit.banking-utils/dist';
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
    // set higher threshold because inline fonts are not loaded and might be slightly different
    expect(image).toMatchImageSnapshot({
      failureThreshold: 0.05,
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
});
