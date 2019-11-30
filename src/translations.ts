import { QRBillLanguage } from './interfaces';
const translations: {
  [key: string]: {
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
  };
} = {};

translations[QRBillLanguage.DE] = {
  paymentPart: 'Zahlteil',
  accountPayableTo: 'Konto / Zahlbar an',
  reference: 'Referenz',
  additionalInfo: 'Zusätzliche Informationen',
  currency: 'Währung',
  amount: 'Betrag',
  receipt: 'Empfangsschein',
  acceptancePoint: 'Annahmestelle',
  payableBy: 'Zahlbar durch',
  payableByNameAddr: 'Zahlbar durch (Name/Adresse)',
};

translations[QRBillLanguage.FR] = {
  paymentPart: 'Section paiement',
  accountPayableTo: 'Compte / Payable à',
  reference: 'Référence',
  additionalInfo: 'Informations supplémentaire',
  currency: 'Monnaie',
  amount: 'Montant',
  receipt: 'Récépissé',
  acceptancePoint: 'Point de dépôt',
  payableBy: 'Payable par',
  payableByNameAddr: 'Payable par (nom/adresse)',
};

translations[QRBillLanguage.IT] = {
  paymentPart: 'Sezione pagamento',
  accountPayableTo: 'Conto / Pagabile a',
  reference: 'Riferimento',
  additionalInfo: 'Informazioni supplementari',
  currency: 'Valuta',
  amount: 'Importo',
  receipt: 'Ricevuta',
  acceptancePoint: 'Punto di accettazione',
  payableBy: 'Pagabile da',
  payableByNameAddr: 'Pagabile da (nome/indirizzo)',
};

translations[QRBillLanguage.EN] = {
  paymentPart: 'Payment part',
  accountPayableTo: 'Account / Payable to',
  reference: 'Reference',
  additionalInfo: 'Additional information',
  currency: 'Currency',
  amount: 'Amount',
  receipt: 'Receipt',
  acceptancePoint: 'Acceptance point',
  payableBy: 'Payable by',
  payableByNameAddr: 'Payable by (name/address)',
};

export { translations };
