import { usePriceBaseManager } from '../state/price/hooks'

export function useCurrencyUsdPrice(): void {
  const newPriceBase = usePriceBaseManager()

  const getPrice = async () => {
    try {
      const response = await fetch('https://api.thegraph.com/subgraphs/name/yflink/linkswap-v1', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: '{"query":"{ bundles { ethPrice linkPrice }}"}',
        method: 'POST'
      })

      if (response.ok) {
        const content = await response.json()
        return content['data']['bundles'][0]
      } else {
        return { ethPrice: 0, linkPrice: 0 }
      }
    } catch (e) {
      return { ethPrice: 0, linkPrice: 0 }
    } finally {
      //console.log('fetched price')
    }
  }

  getPrice().then(priceBase => {
    newPriceBase(priceBase['ethPrice'], priceBase['linkPrice'])
  })
}
