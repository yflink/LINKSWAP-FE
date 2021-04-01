import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

import RenBridge from './renBridge'
import ScrtBridge from './scrtBridge'

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

export function RedirectToScrt() {
  return <Redirect to="/scrt/" />
}

export function RedirectToScrtBridge(props: RouteComponentProps<{ bridgeName: string }>) {
  const {
    match: {
      params: { bridgeName }
    }
  } = props

  return <ScrtBridge {...props} />
}
