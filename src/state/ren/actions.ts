import { createAction } from '@reduxjs/toolkit'

export const updateRenMintsBCH = createAction<{
  BCH: Record<string, unknown>
}>('ren/updateRenMintsBCH')
export const updateRenMintsBTC = createAction<{
  BTC: Record<string, unknown>
}>('ren/updateRenMintsBTC')
export const updateRenMintsDGB = createAction<{
  DGB: Record<string, unknown>
}>('ren/updateRenMintsDGB')
export const updateRenMintsLUNA = createAction<{
  LUNA: Record<string, unknown>
}>('ren/updateRenMintsLUNA')
export const updateRenMintsFIL = createAction<{
  FIL: Record<string, unknown>
}>('ren/updateRenMintsFIL')
export const updateRenMintsZEC = createAction<{
  ZEC: Record<string, unknown>
}>('ren/updateRenMintsZEC')
export const updateRenMintsDOGE = createAction<{
  DOGE: Record<string, unknown>
}>('ren/updateRenMintsDOGE')
