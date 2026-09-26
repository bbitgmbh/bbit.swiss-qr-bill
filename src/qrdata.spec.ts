import { describe, expect, it } from 'vitest';
import { QRData } from './utils';

function linesFor(postalCode: string): string[] {
  const data = new QRData();
  const fields = [
    'SPC',
    '0200',
    '1',
    'CH5800791123000889012',
    'S',
    'Jane',
    '',
    '',
    postalCode,
    'Lausanne',
    'CH',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '50.00',
    'CHF',
  ];
  for (const field of fields) {
    data.add(field);
  }
  return data.toString().split(/\r\n|\n|\r/);
}

describe('QR data', (): void => {
  it('does not let a carriage return move the amount', (): void => {
    const lines = linesFor('1000\r12.00');
    expect(lines[18]).toBe('50.00');
    expect(lines).not.toContain('12.00');
  });

  it('still deletes a newline inside a field', (): void => {
    const lines = linesFor('1000\n12.00');
    expect(lines[8]).toBe('100012.00');
    expect(lines[18]).toBe('50.00');
  });
});
