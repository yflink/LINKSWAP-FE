import { createAction } from '@reduxjs/toolkit'

export const updatePriceBase = createAction<{ ethPriceBase: number; linkPriceBase: number }>('price/updatePriceBase')
