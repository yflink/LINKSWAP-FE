import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { useCallback } from 'react'
import { updateNavigationActiveItem } from './actions'

export function useNavigationActiveItemManager(): (activeItem: string) => void {
  const dispatch = useDispatch<AppDispatch>()

  return useCallback(
    (activeItem: string) => {
      dispatch(updateNavigationActiveItem({ activeItem: activeItem }))
    },
    [dispatch]
  )
}

export function useNavigationActiveItem(): string {
  return useSelector<AppState, AppState['navigation']['navigationActiveItem']>(
    state => state.navigation.navigationActiveItem
  )
}
