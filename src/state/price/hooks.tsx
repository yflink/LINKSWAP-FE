import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { updatePriceBase } from './actions'

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
    linkPriceBase: useSelector<AppState, AppState['price']['linkPriceBase']>(state => state.price.linkPriceBase)
  }
}
