import { IQRBill, QRBillCurrency, QRBillAddressType, QRBillLanguage } from './../src/interfaces';

export const defaultData: IQRBill = {
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
    type: QRBillAddressType.STRUCTURED,
    name: 'Test AG',
    street: 'Musterstrasse',
    buildingNumber: '1',
    postalCode: '3600',
    locality: 'Thun',
    country: 'CH',
  },
  unstructeredMessage: 'Test message',
  billInformation: 'Test billing information',
  language: QRBillLanguage.DE,
};
