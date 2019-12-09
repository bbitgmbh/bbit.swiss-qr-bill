[![Actions Status](https://github.com/bbit-cloud/swiss-qr-bill/workflows/Node%20CI/badge.svg)](https://github.com//bbit-cloud/swiss-qr-bill/actions)
[![codecov](https://codecov.io/gh/bbit-cloud/swiss-qr-bill/branch/master/graph/badge.svg)](https://codecov.io/gh/bbit-cloud/swiss-qr-bill)

> WORK IN PROGRESS - NOT READY TO USE

# Swiss QR bill for Node.js and browsers

## Installation

```bash
yarn add @bbit/swiss-qr-bill
```

or

```bash
npm install @bbit/swiss-qr-bill --save
```

## Usage

```ts
import { QRBillGenerator, IQRBill, QRBillLanguage } from '@bbit/swiss-qr-bill';

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

## Informations

### Fonts

At the moment everything is generated with `Helvetica`. You don't have a lot of options because of the specification and we hate `Arial` - so...

### TODOS

- Generalize build 
  - Both should be bundled with rollup, but until now I was not able to get things working for the web build ;)
- Optimize IBAN tests
- Reference (ISO whateverItIsICanTRememberATM)
  - Implement validation
