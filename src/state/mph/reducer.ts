import { createReducer } from '@reduxjs/toolkit'
import { updateMphPools } from './actions'

const currentTimestamp = () => new Date().getTime()

export interface MphState {
  mphPools: any | []
  timestamp: number
}

export const initialState: MphState = {
  mphPools: false,
  timestamp: currentTimestamp()
}

export default createReducer(initialState, builder =>
  builder.addCase(updateMphPools, (state, action) => {
    state.mphPools = action.payload.mphPools
    state.timestamp = currentTimestamp()
  })
)
