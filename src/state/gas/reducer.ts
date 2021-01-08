import { createReducer } from '@reduxjs/toolkit'
import { updateGasPrices } from './actions'

const currentTimestamp = () => new Date().getTime()

export interface GasState {
  lowGas: number | 0
  averageGas: number | 0
  highGas: number | 0
  timestamp: number
}

export const initialState: GasState = {
  lowGas: 0,
  averageGas: 0,
  highGas: 0,
  timestamp: currentTimestamp()
}

export default createReducer(initialState, builder =>
  builder.addCase(updateGasPrices, (state, action) => {
    state.lowGas = action.payload.lowGas
    state.averageGas = action.payload.averageGas
    state.highGas = action.payload.highGas
    state.timestamp = currentTimestamp()
  })
)
