import { ReferenceValidator } from './reference';

const validator = new ReferenceValidator();

describe('ReferenceValidator', (): void => {
  it('isQRRerence should work', (): void => {
    expect(validator.isQRReference('RF000000000000012312312316')).toBeFalsy();
    expect(validator.isQRReference('000000000000000012312312315')).toBeTruthy();
  });

  it('validateQRReference should work', (): void => {
    expect(validator.isQRReferenceValid('000000000000000012312312316')).toBeTruthy();
    expect(validator.isQRReferenceValid('000000000000000012312312315')).toBeFalsy();
  });

  it('validateQRReference should fail without referece', (): void => {
    expect(validator.isQRReferenceValid(null)).toBeFalsy();
  });

  it('validateQRReference should fail without to long input', (): void => {
    expect(validator.isQRReferenceValid('000000000000012312312316')).toBeFalsy();
  });

  it('validateReference should work', (): void => {
    expect(validator.isReferenceValid('0000000000000012312312316')).toBeTruthy();
    expect(validator.isReferenceValid('0000000000000012312312315')).toBeFalsy();
  });

  it('validateReference should fail without referece', (): void => {
    expect(validator.isReferenceValid(null)).toBeFalsy();
  });

  it('validateReference should fail without to long input', (): void => {
    expect(validator.isReferenceValid('0000000000000000000012312312316')).toBeFalsy();
  });
});
