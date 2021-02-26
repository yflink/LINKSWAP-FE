import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'

import application from './application/reducer'
import { updateVersion } from './global/actions'
import user from './user/reducer'
import transactions from './transactions/reducer'
import swap from './swap/reducer'
import mint from './mint/reducer'
import mph from './mph/reducer'
import lists from './lists/reducer'
import burn from './burn/reducer'
import multicall from './multicall/reducer'
import price from './price/reducer'
import gas from './gas/reducer'
import ren from './ren/reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists', 'ren']

const store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    swap,
    mint,
    mph,
    burn,
    multicall,
    lists,
    price,
    gas,
    ren
  },
  middleware: [...getDefaultMiddleware({ thunk: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS })
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
