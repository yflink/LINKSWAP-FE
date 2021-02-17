import { useMphPoolsManager, useGetMphPools } from '../state/mph/hooks'
import { useState } from 'react'

export function useMphPools(): any {
  const currentTimestamp = () => new Date().getTime()
  const newMphPools = useMphPoolsManager()
  const mphPools = useGetMphPools()
  const timeDiff = currentTimestamp() - mphPools.timestamp
  const [fetching, setFetching] = useState<boolean>(false)
  const [initial, setInitial] = useState<boolean>(false)

  if ((timeDiff > 30000 && !fetching) || (mphPools.mphPools === false && !initial)) {
    setInitial(true)
    const getMphPools = async ({ fetching }: { fetching: boolean }) => {
      if (!fetching) {
        setFetching(true)
        try {
          const url = 'https://api.88mph.app/pools'
          const response = await fetch(url, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'GET'
          })

          if (response.ok) {
            const content = await response.json()
            setFetching(false)
            return content
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
    getMphPools({ fetching: fetching }).then(result => {
      if (result) {
        newMphPools(result)
      }
    })
  } else {
    return false
  }
}
