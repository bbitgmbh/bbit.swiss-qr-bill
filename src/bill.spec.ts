import { pdfBufferToImage } from './test-utils';
import { QRBillGenerator } from './bill';
import { defaultData } from './data';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
expect.extend({ toMatchImageSnapshot });

const bill = new QRBillGenerator();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R, T> {
      toMatchImageSnapshot(options?: { failureThreshold?: number; failureThresholdType?: string }): R;
    }
  }
}

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
