import { createReducer } from '@reduxjs/toolkit'
import { connectKeplr } from './actions'
import { SigningCosmWasmClient } from 'secretjs'

export interface KeplrState {
  keplrConnected: boolean
  keplrWallet: any
  keplrOfflineSigner: any
  secretjs?: SigningCosmWasmClient
  isKeplrWallet: boolean
}

const initialState: KeplrState = {
  keplrConnected: false,
  keplrWallet: {},
  keplrOfflineSigner: {},
  isKeplrWallet: false
}

export default createReducer(initialState, builder =>
  builder.addCase(connectKeplr, state => {
    state.keplrConnected = !state.keplrConnected
  })
)
