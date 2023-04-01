/** T = i / io */
export function calcTransmitance(io: number, i: number): number {
  return i / io;
}

/** A = -Log(io / i) */
export function calcAbsorbance(io: number, i: number): number {
  return -Math.log(io / i);
}
