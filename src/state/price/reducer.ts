import { INITIAL_ALLOWED_SLIPPAGE, DEFAULT_DEADLINE_FROM_NOW } from '../../constants'
import { createReducer } from '@reduxjs/toolkit'
import { updateVersion } from '../global/actions'
import { updatePriceBase } from './actions'

const currentTimestamp = () => new Date().getTime()

export interface PriceState {
  lastUpdateVersionTimestamp?: number
  ethPriceBase: number | 0 // the etherum price base
  linkPriceBase: number | 0 // the chainlink price base
  timestamp: number
}

export const initialState: PriceState = {
  ethPriceBase: 0,
  linkPriceBase: 0,
  timestamp: currentTimestamp()
}

export default createReducer(initialState, builder =>
  builder.addCase(updatePriceBase, (state, action) => {
    state.ethPriceBase = action.payload.ethPriceBase
    state.linkPriceBase = action.payload.linkPriceBase
    state.timestamp = currentTimestamp()
  })
)
