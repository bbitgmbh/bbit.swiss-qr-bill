[![Actions Status](https://github.com/bbit-cloud/swiss-qr-bill/workflows/Node%20CI/badge.svg)](https://github.com//bbit-cloud/swiss-qr-bill/actions)
[![codecov](https://codecov.io/gh/bbit-cloud/swiss-qr-bill/branch/master/graph/badge.svg)](https://codecov.io/gh/bbit-cloud/swiss-qr-bill)

# WORK IN PROGRESS - NOT READY TO USE

## Swiss QR bill for Node.js and browsers

### Installation

```bash
yarn add @bbit/swiss-qr-bill
```

or

```bash
npm install @bbit/swiss-qr-bill --save
```

### Usage

```ts
import { QRBill } from '@bbit/swiss-qr-bill';
const qr = new QRBill();

const params = {};

// create pdf
await qr.generate(params);
```

### Specification

[Swiss Payment Standards 2019](https://www.paymentstandards.ch/dam/downloads/ig-qr-bill-en.pdf)

[Validation](https://www.swiss-qr-invoice.org/validator/?lang=de)

## TODOS

- IBAN tests
- Test builded version
- QR-IBAN & QR reference
  - Implement validation
- Reference
  - Implement validation
- PDF generation of payment slip
- QR Tests
- GitHub Acion for release
