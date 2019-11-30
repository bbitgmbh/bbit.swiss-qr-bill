export class QRBillValidationError extends Error {
  private _errors: string[];

  public constructor(errors: string[]) {
    super('Error while validating parameters');
    this._errors = errors;
  }

  public getValidationErrors(): string[] {
    return this._errors;
  }
}
