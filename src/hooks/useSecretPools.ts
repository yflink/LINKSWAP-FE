import { useSecretPoolsManager, useGetSecretPools } from '../state/keplr/hooks'
import { useState } from 'react'

export function useSecretPools(): any {
  const currentTimestamp = () => new Date().getTime()
  const newSecretPools = useSecretPoolsManager()
  const currentSecretPools = useGetSecretPools()
  const timeDiff = currentTimestamp() - currentSecretPools.timestamp
  const [fetching, setFetching] = useState<boolean>(false)
  const [initial, setInitial] = useState<boolean>(false)

  if ((timeDiff > 300000 && !fetching) || !initial) {
    setInitial(true)
    if (!fetching) {
      setFetching(true)
      const getSecretPools = async ({ fetching }: { fetching: boolean }) => {
        try {
          const response = await fetch('https://api-bridge-mainnet.azurewebsites.net/rewards/?page=0&size=1000', {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'GET'
          })

          if (response.ok) {
            const content = await response.json()
            setFetching(false)
            const poolData = content.pools
            const secretPools: Record<string, any> = {}

            poolData.forEach((pool: any) => {
              const poolObject = {
                rewardsPrice: pool.rewards_token.price,
                totalSupply: pool.total_locked,
                rewardsLeft: pool.pending_rewards,
                deadline: pool.deadline
              }
              secretPools[pool.pool_address.toLowerCase()] = poolObject
            })
            return secretPools
          } else {
            return false
          }
        } catch (e) {
          setFetching(false)
          return false
        } finally {
          //console.log('fetched secretPools')
        }
      }
      getSecretPools({ fetching: fetching }).then(secretPools => {
        if (secretPools) {
          newSecretPools(secretPools)
        }
      })
    } else {
      return false
    }
  } else {
    return false
  }
}
