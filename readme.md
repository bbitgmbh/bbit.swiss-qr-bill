# Swiss QR bill for Node.js and browsers

![Main](https://github.com/bbitgmbh/bbit.swiss-qr-bill/workflows/Main/badge.svg)

## Installation

### yarn

```bash
yarn add @bbitgmbh/bbit.swiss-qr-bill
```

### npm

```bash
npm install @bbitgmbh/bbit.swiss-qr-bill --save
```

## Usage

```ts
import { BbitQRBillGenerator, IBbitQRBill, BbitQRBillLanguage, BbitQRBillAddressType } from '@bbitgmbh/bbit.swiss-qr-bill';

const defaultData: IBbitQRBill = {
  account: 'CH2830000011623852950',
  amount: 1234.55,
  currency: 'CHF',
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
    type: QRBillAddressType.UNSTRUCTURED,
    name: 'Test AG',
    address: 'Musterstrasse 1',
    postalCode: '3600',
    locality: 'Thun',
    country: 'CH',
  },
  unstructuredMessage: 'Test message',
  billInformation: 'Test billing information',
  language: QRBillLanguage.DE,
};

// create pdf
// returns a Buffer in Node.js or a Blob in browsers
const qr = new BbitQRBillGenerator();
const bufferOrBlob = await qr.generate(defaultData);
```

## Specification

[Swiss Payment Standards 2019](https://www.paymentstandards.ch/dam/downloads/ig-qr-bill-en.pdf)

[Validation](https://www.swiss-qr-invoice.org/validator/?lang=de)
