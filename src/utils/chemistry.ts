/** T = i / io */
export function calcTransmitance(io: number, i: number): number {
  return i / io;
}

/** A = -Log(io / i) */
export function calcAbsorbance(io: number, i: number): number {
  return -Math.log(io / i);
}

export function calcEpsilon(data: number[]): number {
  if (data.length === 0) return 0;
  return (data.reduce((a, b) => a + b, 0)) / data.length;
}
