import { Mod10 } from './mod10';
export class Reference {
  public isReferenceValid(reference: string): boolean {
    if (!reference || reference.length > 25) {
      return false;
    }

    // Implement the correct check here

    const check = reference.substr(reference.length - 1);
    const calculated = Mod10.calc(reference.substr(0, reference.length - 1));
    return check === calculated.toString();
  }

  public isQRReferenceValid(reference: string): boolean {
    if (!reference || reference.length !== 27) {
      return false;
    }
    const check = reference.substr(reference.length - 1);
    const calculated = Mod10.calc(reference.substr(0, reference.length - 1));
    return check === calculated.toString();
  }

  public isQRReference(reference: string): boolean {
    return reference && !reference.startsWith('RF');
  }

  public format(reference: string): string {
    if (this.isQRReference(reference)) {
      reference = reference.replace(/ /g, '');
      return [
        reference.substr(0, 2),
        reference.substr(2, 5),
        reference.substr(7, 5),
        reference.substr(12, 5),
        reference.substr(17, 5),
        reference.substr(22, 5),
      ].join(' ');
    } else {
      // implement this
      return 'TODO';
    }
  }
}
