import { usePriceBaseManager } from '../state/user/hooks'

export function useCurrencyUsdPrice(currencyInput?: string | undefined, currencyOutput?: string | undefined): void {
  const newPriceBase = usePriceBaseManager()
  let inputToken = 'ETH'
  let inputKey = 'ethereum'

  if (currencyInput !== 'ETH' && currencyOutput !== 'ETH') {
    if (currencyInput === 'LINK') {
      inputToken = '0x514910771af9ca656af840dff83e8264ecf986ca'
      inputKey = inputToken
    }
    if (currencyOutput === 'LINK') {
      inputToken = '0x514910771af9ca656af840dff83e8264ecf986ca'
      inputKey = inputToken
    }
  }

  const fetchUrl =
    inputToken === 'ETH'
      ? 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      : 'https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=' +
        inputToken +
        '&vs_currencies=usd'

  const getPrice = async () => {
    try {
      const response = await fetch(fetchUrl, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'GET'
      })

      if (response.ok) {
        const content = await response.json()
        return content[inputKey]['usd']
      } else {
        return 0
      }
    } catch (e) {
      return 0
    } finally {
      //console.log('fetched price')
    }
  }

  getPrice().then(priceBase => {
    newPriceBase(priceBase)
  })
}
