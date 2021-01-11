import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

import StakeOverview from './index'

export function RedirectToStake(props: RouteComponentProps<{ pool: string }>) {
  const {
    match: {
      params: { pool }
    }
  } = props

  return <Redirect to={`/add/${pool}`} />
}
