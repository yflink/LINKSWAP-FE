import BigNumber from 'bignumber.js'

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

export const divDecimals = (amount: string | number, decimals: string | number) => {
  if (decimals === 0) {
    return String(amount)
  }

  const decimalsMul = `10${new Array(Number(decimals)).join('0')}`
  const amountStr = new BigNumber(amount).dividedBy(decimalsMul)

  return amountStr.toFixed()
}

export const mulDecimals = (amount: string | number, decimals: string | number) => {
  const decimalsMul = `10${new Array(Number(decimals)).join('0')}`
  const amountStr = new BigNumber(amount).multipliedBy(decimalsMul)

  return new BigNumber(amountStr.toFixed())
}
