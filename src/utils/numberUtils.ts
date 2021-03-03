export function numberToPercent(value: number): string {
  return parseFloat(value.toFixed(2)) + '%'
}

export function numberToUsd(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export function numberToSignificant(value: any, decimals?: number): any {
  let returnValue = parseFloat(value).toPrecision(decimals ?? 6)
  returnValue = returnValue.toString()
  return parseFloat(returnValue)
}
