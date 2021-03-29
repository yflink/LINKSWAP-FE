import { useTokenPricesManager, useGetTokenPrices } from '../state/price/hooks'
import { useState } from 'react'

export function useTokenUsdPrices(): any {
  const currentTimestamp = () => new Date().getTime()
  const newTokenPrices = useTokenPricesManager()
  const currentTokenPrices = useGetTokenPrices()
  const timeDiff = currentTimestamp() - currentTokenPrices.timestamp
  const [fetching, setFetching] = useState<boolean>(false)
  const [initial, setInitial] = useState<boolean>(false)

  if ((timeDiff > 300000 && !fetching) || !initial) {
    setInitial(true)
    const getTokenPrices = async ({ fetching }: { fetching: boolean }) => {
      if (!fetching) {
        setFetching(true)
        try {
          const response = await fetch('https://api.thegraph.com/subgraphs/name/yflink/linkswap-v1', {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body:
              '{"query":"{ tokenDayDatas(orderBy: date, orderDirection: desc) { token { id symbol decimals } priceUSD  }}","variables":null}',
            method: 'POST'
          })

          if (response.ok) {
            const content = await response.json()
            setFetching(false)
            const tokenData = content.data.tokenDayDatas
            const tokenPrices: Record<string, any> = {}
            tokenData.forEach((token: any) => {
              const tokenObject = {
                symbol: token.token.symbol,
                decimals: token.token.decimals,
                price: token.priceUSD
              }

              if (tokenObject.price !== '0') {
                tokenPrices[token.token.id] = tokenObject
              }
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
    getTokenPrices({ fetching: fetching }).then(tokenPrices => {
      if (tokenPrices) {
        newTokenPrices(tokenPrices)
      }
    })
  } else {
    return false
  }
}
