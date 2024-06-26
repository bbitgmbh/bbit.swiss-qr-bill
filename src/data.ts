import {
  BbitQRBillAddressType,
  BbitQRBillCurrency,
  BbitQRBillLanguage,
  type IBbitQRBill,
} from '@bbitgmbh/bbit.banking-utils';

const LOREM_IPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in lorem maximus turpis dignissim cursus nec vel nisl. Morbi bibendum fusce.';

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

export const largeData: IBbitQRBill = {
  account: 'CH2830000011623852950',
  amount: 100.0,
  currency: BbitQRBillCurrency.CHF,
  creditor: {
    type: BbitQRBillAddressType.UNSTRUCTURED,
    name: `Creditor ${LOREM_IPSUM}`,
    address: `Address ${LOREM_IPSUM}`,
    postalCode: '3612',
    locality: 'Steffisburg',
    country: 'CH',
  },
  reference: '000000000000000012312312316',
  debtor: {
    type: BbitQRBillAddressType.STRUCTURED,
    name: `Debtor ${LOREM_IPSUM}`,
    street: `Street ${LOREM_IPSUM}`,
    buildingNumber: '1',
    postalCode: '3600',
    locality: 'Thun',
    country: 'CH',
  },
  unstructuredMessage: `Message ${LOREM_IPSUM}`,
  billInformation: 'Test billing information',
  language: BbitQRBillLanguage.DE,
};
