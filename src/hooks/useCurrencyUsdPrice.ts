export default function getCurrencyUsdPrice(inputToken: string): void {
  const fetchUrl =
    inputToken === 'ETH'
      ? 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      : 'https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=' +
        inputToken +
        '&vs_currencies=usd'

  const getPrice = async () => {
    const response = await fetch(fetchUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'GET'
    })
    console.log(response)

    if (response.status !== 400) {
      const content = await response.json()
      const price = content[inputToken].usd
      console.log('price of', inputToken, price)

      return {
        priceUsd: price
      }
    }
  }

  getPrice()
}
