import { QRBillGenerator } from './../src/bill';
import { defaultData } from './data';

const bill = new QRBillGenerator();

describe('QRBill', (): void => {
  it('should create bills', async (): Promise<void> => {
    const data = await bill.generate(defaultData);
    expect(data).toBeDefined();
    // expect(data).toMatchSnapshot();
  });
});
