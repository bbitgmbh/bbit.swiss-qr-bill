export class Mod10 {
  private static _MODULO10 = [0, 9, 4, 6, 8, 2, 7, 1, 3, 5];

  static calc(str: string): number {
    let sum = 0;
    const l = str.length;
    for (let i = 0; i < l; i++) {
      sum = Mod10._MODULO10[(sum + parseInt(str.substr(i, 1), 10)) % 10];
    }
    return (10 - sum) % 10;
  }
}
