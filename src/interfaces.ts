export interface IQRBill {
  version?: QRBillVersion;
  amount: number;
  currency: string;
  account: string;
  creditor: IQRBillAddress;
  reference: string;
  debtor: IQRBillAddress;
  unstructeredMessage?: string;
  billInformation?: string;
  language: QRBillLanguage;
}

export interface IQRBillAddress {
  name: string;
  address: string;
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
