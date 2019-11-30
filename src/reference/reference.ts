import { Mod10 } from './mod10';
export class ReferenceValidator {
  isReferenceValid(reference: string): boolean {
    if (!reference || reference.length > 25) {
      return false;
    }

    // Implement the correct check here

    const check = reference.substr(reference.length - 1);
    const calculated = Mod10.calc(reference.substr(0, reference.length - 1));
    return check === calculated.toString();
  }

  isQRReferenceValid(reference: string): boolean {
    if (!reference || reference.length !== 27) {
      return false;
    }
    const check = reference.substr(reference.length - 1);
    const calculated = Mod10.calc(reference.substr(0, reference.length - 1));
    return check === calculated.toString();
  }

  isQRReference(reference: string): boolean {
    return reference && !reference.startsWith('RF');
  }
}
