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

export enum QRBillVersion {
  V2_0 = '0200',
}
