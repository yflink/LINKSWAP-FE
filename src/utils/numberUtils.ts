export function numberToPercent(value: number): string {
  const convertedValue = parseFloat(value.toFixed(2))
  return new Intl.NumberFormat('en-US').format(convertedValue) + '%'
}

export function numberToUsd(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export function numberToSignificant(value: any, decimals?: number): any {
  let returnValue = parseFloat(value).toPrecision(decimals ?? 6)
  returnValue = returnValue.toString()
  return new Intl.NumberFormat('en-US').format(parseFloat(returnValue))
}

export function displayNumber(value: any): string {
  return new Intl.NumberFormat('en-US').format(parseFloat(value))
}
