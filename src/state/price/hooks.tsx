import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { updatePriceBase, updateTokenPrices, updateLPTokenPrices, updateWyreObject } from './actions'

export function usePriceBaseManager(): (
  ethPriceBase: number,
  linkPriceBase: number,
  yflPriceBase: number,
  yflusdPriceBase: number
) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (ethPriceBase: number, linkPriceBase: number, yflPriceBase: number, yflusdPriceBase: number) => {
      dispatch(
        updatePriceBase({
          ethPriceBase: ethPriceBase,
          linkPriceBase: linkPriceBase,
          yflPriceBase: yflPriceBase,
          yflusdPriceBase: yflusdPriceBase
        })
      )
    },
    [dispatch]
  )
}

export function useGetPriceBase(): any {
  return {
    ethPriceBase: useSelector<AppState, AppState['price']['ethPriceBase']>(state => state.price.ethPriceBase),
    linkPriceBase: useSelector<AppState, AppState['price']['linkPriceBase']>(state => state.price.linkPriceBase),
    yflPriceBase: useSelector<AppState, AppState['price']['yflPriceBase']>(state => state.price.yflPriceBase),
    yflusdPriceBase: useSelector<AppState, AppState['price']['yflusdPriceBase']>(state => state.price.yflusdPriceBase),
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
