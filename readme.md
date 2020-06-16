# Swiss QR bill for Node.js and browsers

![Main](https://github.com/bbitgmbh/bbit.swiss-qr-bill/workflows/Main/badge.svg)
[![codecov](https://codecov.io/gh/bbitgmbh/bbit.swiss-qr-bill/branch/master/graph/badge.svg)](https://codecov.io/gh/bbitgmbh/bbit.swiss-qr-bill)

## Installation

```bash
yarn add @bbitgmbh/bbit.swiss-qr-bill
```

or

```bash
npm install @bbit/swiss-qr-bill --save
```

## Usage

```ts
import { QRBillGenerator, IQRBill, QRBillLanguage } from '@bbitgmbh/bbit.swiss-qr-bill';

const defaultData: IQRBill = {
  account: 'CH2830000011623852950',
  amount: 1234.55,
  currency: 'CHF',
  creditor: {
    name: 'bbit gmbh',
    address: 'Rainweg 10',
    postalCode: '3612',
    locality: 'Steffisburg',
    country: 'CH',
  },
  reference: '000000000000000012312312316',
  debtor: {
    name: 'Test AG',
    address: 'Musterstrasse 1',
    postalCode: '3600',
    locality: 'Thun',
    country: 'CH',
  },
  unstructeredMessage: 'Test message',
  billInformation: 'Test billing information',
  language: QRBillLanguage.DE,
};

// create pdf
// returns a Buffer in Node.js or a Blob in browsers
const qr = new QRBill();
const bufferOrBlob = await qr.generate(params);
```

## Specification

[Swiss Payment Standards 2019](https://www.paymentstandards.ch/dam/downloads/ig-qr-bill-en.pdf)

[Validation](https://www.swiss-qr-invoice.org/validator/?lang=de)
