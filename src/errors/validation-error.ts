export class QRBillValidationError extends Error {
  private _errors: string[];

  constructor(errors: string[]) {
    super('Error while validating parameters');
    this._errors = errors;
  }

  getValidationErrors(): string[] {
    return this._errors;
  }
}
