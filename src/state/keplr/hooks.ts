import { useCallback } from 'react'
import { connectKeplr } from './actions'
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
