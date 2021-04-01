import { useCallback } from 'react'
import { connectKeplr, updateSecretPools } from './actions'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'

export function useKeplrConnect(): (keplrConnected: boolean, keplrAccount: string) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (keplrConnected: boolean, keplrAccount: string) => {
      dispatch(connectKeplr({ keplrConnected: keplrConnected, keplrAccount: keplrAccount }))
    },
    [dispatch]
  )
}

export function useGetKplrConnect(): any {
  return useSelector<AppState, AppState['keplr']>(state => state.keplr)
}

export function useSecretPoolsManager(): (secretPools: any) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (secretPools: any) => {
      dispatch(updateSecretPools({ secretPools: secretPools }))
    },
    [dispatch]
  )
}

export function useGetSecretPools(): any {
  return {
    secretPools: useSelector<AppState, AppState['keplr']['secretPools']>(state => state.keplr.secretPools),
    timestamp: useSelector<AppState, AppState['keplr']['timestamp']>(state => state.keplr.timestamp)
  }
}
