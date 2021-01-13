import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { updatePriceBase, updateTokenPrices, updateLPTokenPrices, updateWyreObject } from './actions'

export function usePriceBaseManager(): (ethPriceBase: number, linkPriceBase: number) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (ethPriceBase: number, linkPriceBase: number) => {
      dispatch(updatePriceBase({ ethPriceBase: ethPriceBase, linkPriceBase: linkPriceBase }))
    },
    [dispatch]
  )
}

export function useGetPriceBase(): any {
  return {
    ethPriceBase: useSelector<AppState, AppState['price']['ethPriceBase']>(state => state.price.ethPriceBase),
    linkPriceBase: useSelector<AppState, AppState['price']['linkPriceBase']>(state => state.price.linkPriceBase),
    timestamp: useSelector<AppState, AppState['price']['timestamp']>(state => state.price.timestamp)
  }
}

export function useTokenPricesManager(): (tokenPrices: any) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (tokenPrices: any) => {
      dispatch(updateTokenPrices({ tokenPrices: tokenPrices }))
    },
    [dispatch]
  )
}

export function useGetTokenPrices(): any {
  return {
    tokenPrices: useSelector<AppState, AppState['price']['tokenPrices']>(state => state.price.tokenPrices),
    timestamp: useSelector<AppState, AppState['price']['timestamp']>(state => state.price.timestamp)
  }
}

export function useLPTokenPricesManager(): (tokenPrices: any) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (lpTokenPrices: any) => {
      dispatch(updateLPTokenPrices({ lpTokenPrices: lpTokenPrices }))
    },
    [dispatch]
  )
}

export function useGetLPTokenPrices(): any {
  return {
    lpTokenPrices: useSelector<AppState, AppState['price']['lpTokenPrices']>(state => state.price.lpTokenPrices),
    timestamp: useSelector<AppState, AppState['price']['timestamp']>(state => state.price.timestamp)
  }
}

export function useWyreObjectManager(): (priceResponse: any) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (priceResponse: any) => {
      dispatch(updateWyreObject({ priceResponse: priceResponse }))
    },
    [dispatch]
  )
}

export function useGetWyreObject(): any {
  return {
    priceResponse: useSelector<AppState, AppState['price']['priceResponse']>(state => state.price.priceResponse)
  }
}
