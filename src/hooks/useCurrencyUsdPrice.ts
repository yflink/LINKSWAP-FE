import { usePriceBaseManager, useGetPriceBase } from '../state/price/hooks'
import { useState } from 'react'

export function useCurrencyUsdPrice(): any {
  const currentTimestamp = () => new Date().getTime()
  const newPriceBase = usePriceBaseManager()
  const currentPriceBase = useGetPriceBase()
  const timeDiff = currentTimestamp() - currentPriceBase.timestamp
  const [fetching, setFetching] = useState<boolean>(false)
  const [initial, setInitial] = useState<boolean>(false)

  if ((timeDiff > 10000 && !fetching) || (currentPriceBase.ethPriceBase === 0 && !initial)) {
    setInitial(true)
    const getPrice = async ({ fetching }: { fetching: boolean }) => {
      if (!fetching) {
        setFetching(true)
        try {
          const response = await fetch('https://api.thegraph.com/subgraphs/name/yflink/linkswap-v1', {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: '{"query":"{ bundles { ethPrice linkPrice yflPrice }}"}',
            method: 'POST'
          })

          if (response.ok) {
            const content = await response.json()
            setFetching(false)
            return content['data']['bundles'][0]
          } else {
            setFetching(false)
            return false
          }
        } catch (e) {
          return false
        } finally {
          //console.log('fetched price')
        }
      } else {
        return false
      }
    }
    getPrice({ fetching: fetching }).then(priceBase => {
      if (priceBase) {
        newPriceBase(priceBase['ethPrice'], priceBase['linkPrice'], priceBase['yflPrice'])
      }
    })
  } else {
    return false
  }
}
