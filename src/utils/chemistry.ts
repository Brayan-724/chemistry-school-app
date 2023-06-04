import {
  linearRegression,
  linearRegressionLine,
  rSquared,
} from "simple-statistics";

/** T = i / io */
export function calcTransmitance(io: number, i: number): number {
  return i / io * 100;
}

/** 
* A = Log10( io / i )
* A = -Log10( T )
* T = i / io
*/
export function calcAbsorbance(io: number, i: number): number {
  return -Math.log10(i / io);
}

export function calcEpsilon(
  data: number[][],
): [epsilon: number, rSquared: number, bias: number] {
  const linear = linearRegression(data);
  const r2 = rSquared(data, linearRegressionLine(linear));
  console.log(data, linear);
  return [linear.m, r2, linear.b];
}
