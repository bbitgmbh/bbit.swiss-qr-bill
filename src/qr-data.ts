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
