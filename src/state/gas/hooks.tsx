import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { updateGasPrices } from './actions'

export function useGasPricesManager(): (lowGas: number, averageGas: number, highGas: number) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (lowGas: number, averageGas: number, highGas: number) => {
      dispatch(updateGasPrices({ lowGas: lowGas, averageGas: averageGas, highGas: highGas }))
    },
    [dispatch]
  )
}

export function useGetGasPrices(): any {
  return {
    lowGas: useSelector<AppState, AppState['gas']['lowGas']>(state => state.gas.lowGas),
    averageGas: useSelector<AppState, AppState['gas']['averageGas']>(state => state.gas.averageGas),
    highGas: useSelector<AppState, AppState['gas']['highGas']>(state => state.gas.highGas),
    timestamp: useSelector<AppState, AppState['gas']['timestamp']>(state => state.gas.timestamp)
  }
}
