import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import StakeIntoPool from './StakeIntoPool'

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
