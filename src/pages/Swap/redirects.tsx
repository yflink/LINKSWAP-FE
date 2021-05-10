import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

// Redirects to swap but only replace the pathname
export function RedirectPathToSwapOnly({ location }: RouteComponentProps) {
  return <Redirect to={{ ...location, pathname: '/swap' }} />
}

// Redirects from the /swap/:outputCurrency path to the /swap?outputCurrency=:outputCurrency format
export function RedirectToSwap(props: RouteComponentProps<{ inputCurrency: string }>) {
  const {
    location: { search },
    match: {
      params: { inputCurrency }
    }
  } = props

  return (
    <Redirect
      to={{
        ...props.location,
        pathname: '/swap',
        search:
          search && search.length > 1 ? `${search}&inputCurrency=${inputCurrency}` : `?inputCurrency=${inputCurrency}`
      }}
    />
  )
}

export function RedirectThemeOutputToSwap(props: RouteComponentProps<{ outputCurrency: string; theme: string }>) {
  const {
    location: { search },
    match: {
      params: { theme, outputCurrency }
    }
  } = props

  return (
    <Redirect
      to={{
        ...props.location,
        pathname: '/swap',
        search:
          search && search.length > 1
            ? `${search}&theme=${theme}&outputCurrency=${outputCurrency}`
            : `?theme=${theme}&outputCurrency=${outputCurrency}`
      }}
    />
  )
}

export function RedirectThemeInputOutputToSwap(
  props: RouteComponentProps<{ inputCurrency: string; outputCurrency: string; theme: string }>
) {
  const {
    location: { search },
    match: {
      params: { theme, inputCurrency, outputCurrency }
    }
  } = props

  return (
    <Redirect
      to={{
        ...props.location,
        pathname: '/swap',
        search:
          search && search.length > 1
            ? `${search}&theme=${theme}&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}`
            : `?theme=${theme}&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}`
      }}
    />
  )
}

export function RedirectToMigration() {
  return (
    <Redirect
      to={{
        pathname: '/swap',
        search:
          '?inputCurrency=0x28cb7e841ee97947a86B06fA4090C8451f64c0be&outputCurrency=0x72377f31e30a405282b522d588AEbbea202b4f23'
      }}
    />
  )
}
