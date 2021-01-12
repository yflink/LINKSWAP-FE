export default function numberToPercent(value: number): string {
  return parseFloat(value.toFixed(2)) + '%'
}
