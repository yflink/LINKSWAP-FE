export default function hexStringToNumber(hex: string, decimals: number, toFixed?: number, daily?: boolean): number {
  const returnNumber = daily ? (Number(hex) / Math.pow(10, decimals)) * 86400 : Number(hex) / Math.pow(10, decimals)
  return toFixed ? parseFloat(returnNumber.toFixed(toFixed)) : returnNumber
}
