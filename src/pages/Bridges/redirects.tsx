import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

import RenBridge from './renBridge'

export function RedirectToRen() {
  return <Redirect to="/ren/" />
}

export function RedirectToRenBridge(props: RouteComponentProps<{ bridgeName: string }>) {
  const {
    match: {
      params: { bridgeName }
    }
  } = props

  return <RenBridge {...props} />
}
