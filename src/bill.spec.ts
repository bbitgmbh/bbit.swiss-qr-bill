import { pdfBufferToImage } from './test-utils';
import { BbitQRBillGenerator } from './bill';
import { defaultData } from './data';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
expect.extend({ toMatchImageSnapshot });

const bill = new BbitQRBillGenerator();

describe('QRBill', (): void => {
  it('should create bills', async (): Promise<void> => {
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
