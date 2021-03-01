import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { updateMphPools } from './actions'

export function useMphPoolsManager(): (mphPools: any) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (mphPools: any) => {
      dispatch(updateMphPools({ mphPools: mphPools }))
    },
    [dispatch]
  )
}

export function useGetMphPools(): any {
  return {
    mphPools: useSelector<AppState, AppState['mph']['mphPools']>(state => state.mph.mphPools),
    timestamp: useSelector<AppState, AppState['mph']['timestamp']>(state => state.mph.timestamp)
  }
}
