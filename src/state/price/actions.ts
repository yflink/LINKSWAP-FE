import { createAction } from '@reduxjs/toolkit'

export const updatePriceBase = createAction<{
  ethPriceBase: number
  linkPriceBase: number
  yflPriceBase: number
  yflusdPriceBase: number
}>('price/updatePriceBase')
export const updateWyreObject = createAction<{ priceResponse: any }>('price/updateWyreObject')
export const updateTokenPrices = createAction<{ tokenPrices: any }>('price/updateTokenPrices')
export const updateLPTokenPrices = createAction<{ lpTokenPrices: any }>('price/updateLPTokenPrices')
