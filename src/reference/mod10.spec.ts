import { Mod10 } from './mod10';

describe('mod10', () => {
  it('should return 0', () => {
    expect(Mod10.calc('14000466')).toBe(0);
  });

  it('should return 8', () => {
    expect(Mod10.calc('010000012345')).toBe(8);
  });

  it('should return NaN', () => {
    expect(Mod10.calc('123.45')).toBe(NaN);
  });
});
