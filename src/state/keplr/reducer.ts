import { createReducer } from '@reduxjs/toolkit'
import { connectKeplr } from './actions'

export interface KeplrState {
  keplrConnected: boolean
  keplrAccount: string | undefined
}

export const initialState: KeplrState = {
  keplrConnected: false,
  keplrAccount: undefined
}

export default createReducer(initialState, builder =>
  builder.addCase(connectKeplr, (state, action) => {
    state.keplrConnected = action.payload.keplrConnected
    state.keplrAccount = action.payload.keplrAccount
  })
)
