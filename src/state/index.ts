import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'

import application from './application/reducer'
import burn from './burn/reducer'
import gas from './gas/reducer'
import keplr from './keplr/reducer'
import lists from './lists/reducer'
import mint from './mint/reducer'
import mph from './mph/reducer'
import multicall from './multicall/reducer'
import navigation from './navigation/reducer'
import price from './price/reducer'
import ren from './ren/reducer'
import swap from './swap/reducer'
import transactions from './transactions/reducer'
import user from './user/reducer'
import { updateVersion } from './global/actions'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists', 'ren', 'keplr']

const store = configureStore({
  reducer: {
    application,
    burn,
    gas,
    keplr,
    lists,
    mint,
    mph,
    multicall,
    navigation,
    price,
    ren,
    swap,
    transactions,
    user
  },
  middleware: [...getDefaultMiddleware({ thunk: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS })
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
