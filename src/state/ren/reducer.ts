import { createReducer } from '@reduxjs/toolkit'
import {
  updateRenMintsBCH,
  updateRenMintsBTC,
  updateRenMintsDGB,
  updateRenMintsDOGE,
  updateRenMintsFIL,
  updateRenMintsLUNA,
  updateRenMintsZEC
} from './actions'

export interface RenState {
  BCH: Record<string, unknown>
  BTC: Record<string, unknown>
  DGB: Record<string, unknown>
  LUNA: Record<string, unknown>
  FIL: Record<string, unknown>
  ZEC: Record<string, unknown>
  DOGE: Record<string, unknown>
}

export const initialState: RenState = {
  BCH: {},
  BTC: {},
  DGB: {},
  LUNA: {},
  FIL: {},
  ZEC: {},
  DOGE: {}
}

export default createReducer(initialState, builder =>
  builder
    .addCase(updateRenMintsBCH, (state, action) => {
      state.BCH = action.payload.BCH
    })
    .addCase(updateRenMintsBTC, (state, action) => {
      state.BTC = action.payload.BTC
    })
    .addCase(updateRenMintsDGB, (state, action) => {
      state.DGB = action.payload.DGB
    })
    .addCase(updateRenMintsLUNA, (state, action) => {
      state.LUNA = action.payload.LUNA
    })
    .addCase(updateRenMintsFIL, (state, action) => {
      state.FIL = action.payload.FIL
    })
    .addCase(updateRenMintsZEC, (state, action) => {
      state.ZEC = action.payload.ZEC
    })
    .addCase(updateRenMintsDOGE, (state, action) => {
      state.DOGE = action.payload.DOGE
    })
)
