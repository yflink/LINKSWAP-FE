import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import StakeIntoPool from './StakeIntoPool'
import Unstake from './Unstake'

export function RedirectToStake(props: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
  const {
    match: {
      params: { currencyIdA, currencyIdB }
    }
  } = props

  if (currencyIdA.toLowerCase() === currencyIdB.toLowerCase()) {
    return <Redirect to={`/add/${currencyIdA}`} />
  }
  return <StakeIntoPool {...props} />
}

export function RedirectToUnstake(props: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
  const {
    match: {
      params: { currencyIdA, currencyIdB }
    }
  } = props

  if (currencyIdA.toLowerCase() === currencyIdB.toLowerCase()) {
    return <Redirect to={`/add/${currencyIdA}`} />
  }
  return <Unstake {...props} />
}
