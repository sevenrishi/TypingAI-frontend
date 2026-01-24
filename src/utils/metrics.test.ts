import { calcWPM, calcCPM, calcAccuracy } from './metrics';

describe('metrics', () => {
  it('calcWPM returns 0 for zero elapsed', () => {
    expect(calcWPM(100, 0)).toBe(0);
  });

  it('calcWPM basic', () => {
    // 250 chars => 50 words, elapsed 60s -> 50 wpm
    const wpm = calcWPM(250, 60000);
    expect(Math.round(wpm)).toBe(50);
  });

  it('calcCPM basic', () => {
    const cpm = calcCPM(120, 60000);
    expect(Math.round(cpm)).toBe(120);
  });

  it('calcAccuracy edge', () => {
    expect(calcAccuracy(0, 0)).toBe(100);
    expect(calcAccuracy(100, 5)).toBeCloseTo(95);
  });
});
