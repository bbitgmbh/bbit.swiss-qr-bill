/* eslint-disable @typescript-eslint/camelcase */
export class IBANSpecification {
  countryCode: string;
  length: number;
  structure: string;
  example: string;
  _cachedRegex: RegExp;

  constructor(countryCode: string, length: number, structure: string, example: string) {
    this.countryCode = countryCode;
    this.length = length;
    this.structure = structure;
    this.example = example;
  }

  /**
   * Prepare an IBAN for mod 97 computation by moving the first 4 chars to the end and transforming the letters to
   * numbers (A = 10, B = 11, ..., Z = 35), as specified in ISO13616.
   *
   * @param iban the IBAN
   * @returns the prepared IBAN
   */
  static iso13616Prepare(iban: string): string {
    const A = 'A'.charCodeAt(0);
    const Z = 'Z'.charCodeAt(0);

    iban = iban.toUpperCase();
    iban = iban.substr(4) + iban.substr(0, 4);

    return iban
      .split('')
      .map((n: string) => {
        const code = n.charCodeAt(0);
        if (code >= A && code <= Z) {
          // A = 10, B = 11, ... Z = 35
          return code - A + 10;
        } else {
          return n;
        }
      })
      .join('');
  }

  /**
   * Calculates the MOD 97 10 of the passed IBAN as specified in ISO7064.
   */
  static iso7064Mod97_10(iban: string): number {
    let remainder = iban,
      block;

    while (remainder.length > 2) {
      block = remainder.slice(0, 9);
      remainder = (parseInt(block, 10) % 97) + remainder.slice(block.length);
    }

    return parseInt(remainder, 10) % 97;
  }

  /**
   * Parse the BBAN structure used to configure each IBAN Specification and returns a matching regular expression.
   * A structure is composed of blocks of 3 characters (one letter and 2 digits). Each block represents
   * a logical group in the typical representation of the BBAN. For each group, the letter indicates which characters
   * are allowed in this group and the following 2-digits number tells the length of the group.
   */
  static parseStructure(structure: string): any {
    // split in blocks of 3 chars
    const regex = structure.match(/(.{3})/g).map(function(block) {
      // parse each structure block (1-char + 2-digits)
      let format;
      const pattern = block.slice(0, 1);
      const repeats = parseInt(block.slice(1), 10);

      switch (pattern) {
        case 'A':
          format = '0-9A-Za-z';
          break;
        case 'B':
          format = '0-9A-Z';
          break;
        case 'C':
          format = 'A-Za-z';
          break;
        case 'F':
          format = '0-9';
          break;
        case 'L':
          format = 'a-z';
          break;
        case 'U':
          format = 'A-Z';
          break;
        case 'W':
          format = '0-9a-z';
          break;
      }

      return '([' + format + ']{' + repeats + '})';
    });

    return new RegExp('^' + regex.join('') + '$');
  }

  /**
   * Lazy-loaded regex (parse the structure and construct the regular expression the first time we need it for validation)
   */
  private _regex(): any {
    return this._cachedRegex || (this._cachedRegex = IBANSpecification.parseStructure(this.structure));
  }

  /**
   * Check if the passed iban is valid according to this specification.
   *
   * @param iban the iban to validate
   * @returns true if valid, false otherwise
   */
  isValid(iban: string): boolean {
    return (
      this.length === iban.length &&
      this.countryCode === iban.slice(0, 2) &&
      this._regex().test(iban.slice(4)) &&
      IBANSpecification.iso7064Mod97_10(IBANSpecification.iso13616Prepare(iban)) === 1
    );
  }

  /**
   * Convert the passed IBAN to a country-specific BBAN.
   *
   * @param iban the IBAN to convert
   * @param separator the separator to use between BBAN blocks
   * @returns the BBAN
   */
  toBBAN(iban: string, separator: string): string {
    return this._regex()
      .exec(iban.slice(4))
      .slice(1)
      .join(separator);
  }

  /**
   * Convert the passed BBAN to an IBAN for this country specification.
   * Please note that <i>"generation of the IBAN shall be the exclusive responsibility of the bank/branch servicing the account"</i>.
   * This method implements the preferred algorithm described in http://en.wikipedia.org/wiki/International_Bank_Account_Number#Generating_IBAN_check_digits
   *
   * @param bban the BBAN to convert to IBAN
   * @returns the IBAN
   */
  fromBBAN(bban: string): string {
    if (!this.isValidBBAN(bban)) {
      throw new Error('Invalid BBAN');
    }

    const remainder = IBANSpecification.iso7064Mod97_10(IBANSpecification.iso13616Prepare(this.countryCode + '00' + bban)),
      checkDigit = ('0' + (98 - remainder)).slice(-2);

    return this.countryCode + checkDigit + bban;
  }

  /**
   * Check of the passed BBAN is valid.
   * This function only checks the format of the BBAN (length and matching the letetr/number specs) but does not
   * verify the check digit.
   *
   * @param bban the BBAN to validate
   * @returns true if the passed bban is a valid BBAN according to this specification, false otherwise
   */
  isValidBBAN(bban: string): boolean {
    return this.length - 4 === bban.length && this._regex().test(bban);
  }
}
