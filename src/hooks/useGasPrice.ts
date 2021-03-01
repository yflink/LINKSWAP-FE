import { useGasPricesManager, useGetGasPrices } from '../state/gas/hooks'
import { ETH_API_KEYS } from '../connectors'
import { useState } from 'react'

export function useGasPrices(): any {
  const currentTimestamp = () => new Date().getTime()
  const newGasPrices = useGasPricesManager()
  const gasObject = useGetGasPrices()
  const timeDiff = currentTimestamp() - gasObject.timestamp
  const [fetching, setFetching] = useState<boolean>(false)
  const [initial, setInitial] = useState<boolean>(false)
  const ethAPIKey = ETH_API_KEYS[Math.floor(Math.random() * ETH_API_KEYS.length)]

  if ((timeDiff > 30000 && !fetching) || (gasObject.lowGas === 0 && !initial)) {
    setInitial(true)
    const getGasPrices = async ({ fetching }: { fetching: boolean }) => {
      if (!fetching) {
        setFetching(true)
        try {
          const url = 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=' + ethAPIKey
          const response = await fetch(url, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'POST'
          })

          if (response.ok) {
            const content = await response.json()
            setFetching(false)
            if (content.status === '0') {
              return false
            } else {
              return {
                gasLow: content.result.SafeGasPrice,
                gasAverage: content.result.ProposeGasPrice,
                gasHigh: content.result.FastGasPrice
              }
            }
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
    getGasPrices({ fetching: fetching }).then(result => {
      if (result) {
        newGasPrices(result.gasLow, result.gasAverage, result.gasHigh)
      }
    })
  } else {
    return false
  }
}
