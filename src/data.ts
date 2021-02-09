import { IBbitQRBill, BbitQRBillCurrency, BbitQRBillAddressType, BbitQRBillLanguage } from '@bbitgmbh/bbit.banking-utils';

export const defaultData: IBbitQRBill = {
  account: 'CH2830000011623852950',
  amount: 100.0,
  currency: BbitQRBillCurrency.CHF,
  creditor: {
    type: BbitQRBillAddressType.UNSTRUCTURED,
    name: 'bbit gmbh',
    address: 'Rainweg 10',
    postalCode: '3612',
    locality: 'Steffisburg',
    country: 'CH',
  },
  reference: '000000000000000012312312316',
  debtor: {
    type: BbitQRBillAddressType.STRUCTURED,
    name: 'Test AG',
    street: 'Musterstrasse',
    buildingNumber: '1',
    postalCode: '3600',
    locality: 'Thun',
    country: 'CH',
  },
  unstructuredMessage: 'Test message',
  billInformation: 'Test billing information',
  language: BbitQRBillLanguage.DE,
};
