import * as stream from 'stream';
import { QRBillLanguage, ITranslations } from './interfaces';

export const isNodeJs = typeof document === 'undefined';

export const swissCorssImage =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkViZW5lXzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxOS44IDE5LjgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE5LjggMTkuODsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQoJLnN0MXtmaWxsOm5vbmU7c3Ryb2tlOiNGRkZGRkY7c3Ryb2tlLXdpZHRoOjEuNDM1NztzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cjwvc3R5bGU+Cjxwb2x5Z29uIHBvaW50cz0iMTguMywwLjcgMS42LDAuNyAwLjcsMC43IDAuNywxLjYgMC43LDE4LjMgMC43LDE5LjEgMS42LDE5LjEgMTguMywxOS4xIDE5LjEsMTkuMSAxOS4xLDE4LjMgMTkuMSwxLjYgMTkuMSwwLjcgIi8+CjxyZWN0IHg9IjguMyIgeT0iNCIgY2xhc3M9InN0MCIgd2lkdGg9IjMuMyIgaGVpZ2h0PSIxMSIvPgo8cmVjdCB4PSI0LjQiIHk9IjcuOSIgY2xhc3M9InN0MCIgd2lkdGg9IjExIiBoZWlnaHQ9IjMuMyIvPgo8cG9seWdvbiBjbGFzcz0ic3QxIiBwb2ludHM9IjAuNywxLjYgMC43LDE4LjMgMC43LDE5LjEgMS42LDE5LjEgMTguMywxOS4xIDE5LjEsMTkuMSAxOS4xLDE4LjMgMTkuMSwxLjYgMTkuMSwwLjcgMTguMywwLjcgCgkxLjYsMC43IDAuNywwLjcgIi8+Cjwvc3ZnPgo=';

export class QRData {
  private _data = '';

  public add(data?: string): void {
    if (!data) {
      this._data += '\n';
    } else {
      this._data += data.replace(/\n/gm, '') + '\n';
    }
  }

  public toString(): string {
    return this._data;
  }
}

export class CustomWritableStream extends stream.Writable {
  private _chunks = [];
  private _length = 0;
  public constructor(options?) {
    super(options);
  }

  public _write(chunk, enc, callback): void {
    if (isNodeJs) {
      if (!(chunk instanceof Uint8Array)) chunk = new Uint8Array(chunk);
    }

    this._length += chunk.length;
    this._chunks.push(chunk);
    return callback(null);
  }

  public _destroy(err, callback): void {
    this._chunks = null;
    return callback(null);
  }

  public toBuffer(): Buffer {
    return Buffer.concat(this._chunks);
  }

  public toBlob(): Blob {
    return new Blob(this._chunks, {
      type: 'application/pdf',
    });
  }
}

export const isJest = process.env.NODE_ENV === 'test';

const translations: {
  [key: string]: ITranslations;
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
