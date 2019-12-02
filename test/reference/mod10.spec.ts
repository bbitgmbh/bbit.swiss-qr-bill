import { Mod10 } from '../../src/reference/mod10';

describe('mod10', (): void => {
  it('should return 0', (): void => {
    expect(Mod10.calc('14000466')).toBe(0);
  });

  it('should return 8', (): void => {
    expect(Mod10.calc('010000012345')).toBe(8);
  });

  it('should return NaN', (): void => {
    expect(Mod10.calc('123.45')).toBe(NaN);
  });
});
