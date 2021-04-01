import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import StakeIntoPool from './StakeIntoPool'
import Unstake from './Unstake'
import MphVault from './MphVault'
import MphManage from './MphManage'
import StakeOverview from './index'
import ScrtStake from './ScrtStake'
import ScrtUnstake from './ScrtUnstake'

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

export function RedirectToStakeWithParam(props: RouteComponentProps<{ param: string }>) {
  const {
    match: {
      params: { param }
    }
  } = props

  return <StakeOverview {...props} />
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

export function RedirectTo88mph(props: RouteComponentProps<{ vaultName: string }>) {
  const {
    match: {
      params: { vaultName }
    }
  } = props

  return <MphVault {...props} />
}

export function RedirectToScrtStake(props: RouteComponentProps<{ currency: string }>) {
  const {
    match: {
      params: { currency }
    }
  } = props

  return <ScrtStake {...props} />
}

export function RedirectToScrtUnstake(props: RouteComponentProps<{ currency: string }>) {
  const {
    match: {
      params: { currency }
    }
  } = props

  return <ScrtUnstake {...props} />
}

export function RedirectTo88mphWithdraw(props: RouteComponentProps<{ vaultName: string }>) {
  const {
    match: {
      params: { vaultName }
    }
  } = props

  return <MphManage {...props} />
}
