import { useLPTokenPricesManager, useGetLPTokenPrices } from '../state/price/hooks'
import { useState } from 'react'

export function useLPTokenUsdPrices(): any {
  const currentTimestamp = () => new Date().getTime()
  const newLPTokenPrices = useLPTokenPricesManager()
  const currentLPTokenPrices = useGetLPTokenPrices()
  const timeDiff = currentTimestamp() - currentLPTokenPrices.timestamp
  const [fetching, setFetching] = useState<boolean>(false)
  const [initial, setInitial] = useState<boolean>(false)

  if ((timeDiff > 300000 && !fetching) || !initial) {
    setInitial(true)
    const getLPTokenPrices = async ({ fetching }: { fetching: boolean }) => {
      if (!fetching) {
        setFetching(true)
        try {
          const response = await fetch('https://api.thegraph.com/subgraphs/name/yflink/linkswap-v1', {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: ' {"query":"{pairs {  id  reserveUSD}}","variables":null}',
            method: 'POST'
          })

          if (response.ok) {
            const content = await response.json()
            setFetching(false)
            const tokenData = content.data.pairs
            const tokenPrices: Record<string, any> = {}

            tokenData.forEach((token: any) => {
              const tokenObject = {
                totalLiq: token.reserveUSD
              }
              tokenPrices[token.id] = tokenObject
            })
            return tokenPrices
          } else {
            return false
          }
        } catch (e) {
          setFetching(false)
          return false
        } finally {
          //console.log('fetched price')
        }
      } else {
        return false
      }
    }
    getLPTokenPrices({ fetching: fetching }).then(lpTokenPrices => {
      if (lpTokenPrices) {
        newLPTokenPrices(lpTokenPrices)
      }
    })
  } else {
    return false
  }
}
