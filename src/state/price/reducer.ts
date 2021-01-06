import { createReducer } from '@reduxjs/toolkit'
import { updatePriceBase, updateWyreObject } from './actions'

const currentTimestamp = () => new Date().getTime()

export interface PriceState {
  lastUpdateVersionTimestamp?: number
  ethPriceBase: number | 0 // the ethereum price base
  linkPriceBase: number | 0 // the chainlink price base
  priceResponse: any | false // wyre response
  timestamp: number
}

export const initialState: PriceState = {
  ethPriceBase: 0,
  linkPriceBase: 0,
  priceResponse: false,
  timestamp: currentTimestamp()
}

export default createReducer(initialState, builder =>
  builder
    .addCase(updatePriceBase, (state, action) => {
      state.ethPriceBase = action.payload.ethPriceBase
      state.linkPriceBase = action.payload.linkPriceBase
      state.timestamp = currentTimestamp()
    })
    .addCase(updateWyreObject, (state, action) => {
      state.priceResponse = action.payload.priceResponse
      state.timestamp = currentTimestamp()
    })
)
