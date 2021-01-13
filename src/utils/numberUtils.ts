export function numberToPercent(value: number): string {
  return parseFloat(value.toFixed(2)) + '%'
}

export function numberToUsd(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export function numberToSignificant(value: any): any {
  let returnValue = parseFloat(value).toPrecision(6)
  returnValue = returnValue.toString()
  return parseFloat(returnValue)
}
