export default function hexStringToNumber(hex: string, decimals: number, toFixed: number): number {
  const returnNumber = Number(hex) / Math.pow(10, decimals)
  return parseFloat(returnNumber.toFixed(toFixed))
}
