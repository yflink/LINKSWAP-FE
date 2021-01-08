import { createAction } from '@reduxjs/toolkit'

export const updateGasPrices = createAction<{ lowGas: number; averageGas: number; highGas: number }>(
  'gas/updateGasPrices'
)
