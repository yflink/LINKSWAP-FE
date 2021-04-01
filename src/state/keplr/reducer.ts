import { createReducer } from '@reduxjs/toolkit'
import { connectKeplr, updateSecretPools } from './actions'

const currentTimestamp = () => new Date().getTime()

export interface KeplrState {
  keplrConnected: boolean
  keplrAccount: string | undefined
  secretPools: any | false // token prices
  timestamp: number
}

export const initialState: KeplrState = {
  keplrConnected: false,
  keplrAccount: undefined,
  secretPools: false,
  timestamp: currentTimestamp()
}

export default createReducer(initialState, builder =>
  builder
    .addCase(connectKeplr, (state, action) => {
      state.keplrConnected = action.payload.keplrConnected
      state.keplrAccount = action.payload.keplrAccount
    })
    .addCase(updateSecretPools, (state, action) => {
      state.secretPools = action.payload.secretPools
      state.timestamp = currentTimestamp()
    })
)
