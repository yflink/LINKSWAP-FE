import { createReducer } from '@reduxjs/toolkit'
import { updateNavigationActiveItem } from './actions'

const currentTimestamp = () => new Date().getTime()

export interface NavigationState {
  timestamp?: number
  navigationActiveItem: string
}

export const initialState: NavigationState = {
  navigationActiveItem: 'swap',
  timestamp: currentTimestamp()
}

export default createReducer(initialState, builder =>
  builder.addCase(updateNavigationActiveItem, (state, action) => {
    state.navigationActiveItem = action.payload.activeItem
    state.timestamp = currentTimestamp()
  })
)
