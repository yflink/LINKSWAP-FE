import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import {
  updateRenMintsBCH,
  updateRenMintsBTC,
  updateRenMintsDGB,
  updateRenMintsDOGE,
  updateRenMintsFIL,
  updateRenMintsLUNA,
  updateRenMintsZEC
} from './actions'

export function useRenMintsBTC(): (BTC: Record<any, unknown>) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (BTC: Record<any, unknown>) => {
      dispatch(
        updateRenMintsBTC({
          BTC: BTC
        })
      )
    },
    [dispatch]
  )
}

export function useGetRenMintsBTC(): any {
  return {
    BTC: useSelector<AppState, AppState['ren']['BTC']>(state => state.ren.BTC)
  }
}

export function useRenMintsBCH(): (BCH: Record<any, unknown>) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (BCH: Record<any, unknown>) => {
      dispatch(
        updateRenMintsBCH({
          BCH: BCH
        })
      )
    },
    [dispatch]
  )
}

export function useGetRenMintsBCH(): any {
  return {
    BCH: useSelector<AppState, AppState['ren']['BCH']>(state => state.ren.BCH)
  }
}

export function useRenMintsDGB(): (DGB: Record<any, unknown>) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (DGB: Record<any, unknown>) => {
      dispatch(
        updateRenMintsDGB({
          DGB: DGB
        })
      )
    },
    [dispatch]
  )
}

export function useGetRenMintsDGB(): any {
  return {
    DGB: useSelector<AppState, AppState['ren']['DGB']>(state => state.ren.DGB)
  }
}

export function useRenMintsLUNA(): (LUNA: Record<any, unknown>) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (LUNA: Record<any, unknown>) => {
      dispatch(
        updateRenMintsLUNA({
          LUNA: LUNA
        })
      )
    },
    [dispatch]
  )
}

export function useGetRenMintsLUNA(): any {
  return {
    LUNA: useSelector<AppState, AppState['ren']['LUNA']>(state => state.ren.LUNA)
  }
}

export function useRenMintsFIL(): (FIL: Record<any, unknown>) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (FIL: Record<any, unknown>) => {
      dispatch(
        updateRenMintsFIL({
          FIL: FIL
        })
      )
    },
    [dispatch]
  )
}

export function useGetRenMintsFIL(): any {
  return {
    FIL: useSelector<AppState, AppState['ren']['FIL']>(state => state.ren.FIL)
  }
}

export function useRenMintsZEC(): (ZEC: Record<any, unknown>) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (ZEC: Record<any, unknown>) => {
      dispatch(
        updateRenMintsZEC({
          ZEC: ZEC
        })
      )
    },
    [dispatch]
  )
}

export function useGetRenMintsZEC(): any {
  return {
    ZEC: useSelector<AppState, AppState['ren']['ZEC']>(state => state.ren.ZEC)
  }
}

export function useRenMintsDOGE(): (DOGE: Record<any, unknown>) => void {
  const dispatch = useDispatch<AppDispatch>()
  return useCallback(
    (DOGE: Record<any, unknown>) => {
      dispatch(
        updateRenMintsDOGE({
          DOGE: DOGE
        })
      )
    },
    [dispatch]
  )
}

export function useGetRenMintsDOGE(): any {
  return {
    DOGE: useSelector<AppState, AppState['ren']['DOGE']>(state => state.ren.DOGE)
  }
}
