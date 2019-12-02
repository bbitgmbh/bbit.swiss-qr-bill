import { pdfBufferToImage } from './utils';
import { QRBillGenerator } from './../src/bill';
import { defaultData } from './data';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
expect.extend({ toMatchImageSnapshot });

const bill = new QRBillGenerator();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/interface-name-prefix
    interface Matchers<R, T> {
      toMatchImageSnapshot(): R;
    }
  }
}

describe('QRBill', (): void => {
  it('should create bills', async (): Promise<void> => {
    const data = await bill.generate(defaultData);
    expect(data).toBeDefined();
    const image = await pdfBufferToImage(data);
    // TODO test output with https://www.npmjs.com/package/jest-image-snapshot
    expect(image).toMatchImageSnapshot();
  });
});
