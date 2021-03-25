export function shortenScrtAddress(address: string, chars = 8): string {
  const length = address.length
  return `${address.substring(0, chars)}...${address.substring(length - chars, length)}`
}
