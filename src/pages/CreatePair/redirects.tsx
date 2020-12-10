import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

import CreatePair from './index'

export function RedirectToCreatePair() {
  return <Redirect to="/add/" />
}

const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40})-(0x[a-fA-F0-9]{40})$/
export function CreatePairRedirectOldPathStructure(props: RouteComponentProps<{ currencyIdA: string }>) {
  const {
    match: {
      params: { currencyIdA }
    }
  } = props
  const match = currencyIdA.match(OLD_PATH_STRUCTURE)
  if (match?.length) {
    return <Redirect to={`/create/${match[1]}/${match[2]}`} />
  }

  return <CreatePair {...props} />
}

export function CreatePairRedirectDuplicateTokenIds(
  props: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>
) {
  const {
    match: {
      params: { currencyIdA, currencyIdB }
    }
  } = props
  if (currencyIdA.toLowerCase() === currencyIdB.toLowerCase()) {
    return <Redirect to={`/create/${currencyIdA}`} />
  }
  return <CreatePair {...props} />
}
