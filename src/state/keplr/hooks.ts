import { useCallback } from 'react'
import { connectKeplr } from './actions'
import { useDispatch, useSelector } from 'react-redux'
import { AppState } from '../index'

export function useKeplrConnect(): () => void {
  const dispatch = useDispatch()
  return useCallback(() => dispatch(connectKeplr()), [dispatch])
}

export function useGetKplrConnect(): any {
  return useSelector<AppState, AppState['keplr']['keplrConnected']>(state => state.keplr.keplrConnected)
}
