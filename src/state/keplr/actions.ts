import { createAction } from '@reduxjs/toolkit'

export const connectKeplr = createAction<{
  keplrConnected: boolean
  keplrAccount: string
}>('app/connectKeplr')
