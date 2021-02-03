export interface IQRBill {
  version?: QRBillVersion;
  amount: number;
  currency: QRBillCurrency;
  account: string;
  creditor: IQRBillAddress;
  reference: string;
  debtor: IQRBillAddress;
  unstructeredMessage?: string;
  billInformation?: string;
  language: QRBillLanguage;
}

export interface IQRBillAddress {
  type: QRBillAddressType;
  name: string;
  address?: string;
  street?: string;
  buildingNumber?: string;
  postalCode: string;
  locality: string;
  country: string;
}

export enum QRBillCurrency {
  CHF = 'CHF',
  EUR = 'EUR',
  USD = 'USD',
}

export enum QRBillLanguage {
  DE = 'de-CH',
  FR = 'fr-CH',
  IT = 'it-CH',
  EN = 'en-US',
}

export enum QRBillVersion {
  V2_0 = '0200',
}

export enum QRBillAddressType {
  UNSTRUCTURED = 'K',
  STRUCTURED = 'S',
}

export interface IQRBillTranslations {
  paymentPart: string;
  accountPayableTo: string;
  reference: string;
  additionalInfo: string;
  currency: string;
  amount: string;
  receipt: string;
  acceptancePoint: string;
  payableBy: string;
  payableByNameAddr: string;
}
