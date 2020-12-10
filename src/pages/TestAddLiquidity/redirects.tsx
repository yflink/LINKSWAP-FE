import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

import TestAddLiquidity from './index'

export function TestRedirectToAddLiquidity() {
  return <Redirect to="/testAdd/" />
}

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40})-(0x[a-fA-F0-9]{40})$/
export function TestRedirectOldAddLiquidityPathStructure(props: RouteComponentProps<{ currencyIdA: string }>) {
  const {
    match: {
      params: { currencyIdA }
    }
  } = props
  const match = currencyIdA.match(OLD_PATH_STRUCTURE)
  if (match?.length) {
    return <Redirect to={`/testAdd/${match[1]}/${match[2]}`} />
  }

  return <TestAddLiquidity {...props} />
}

export function TestRedirectDuplicateTokenIds(
  props: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>
) {
  const {
    match: {
      params: { currencyIdA, currencyIdB }
    }
  } = props
  if (currencyIdA.toLowerCase() === currencyIdB.toLowerCase()) {
    return <Redirect to={`/testAdd/${currencyIdA}`} />
  }
  return <TestAddLiquidity {...props} />
}
