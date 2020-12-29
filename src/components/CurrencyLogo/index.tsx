import { Currency, ETHER, Token } from '@uniswap/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import Logo from '../Logo'

import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'

import eth from '../../assets/svg/eth.svg'
import link from '../../assets/svg/link.svg'
import yfl from '../../assets/svg/yfl.svg'

const getTokenLogoURL = (address: string) => `https://logos.linkswap.app/${address.toLowerCase()}.png`

const ethLogoURL = 'https://logos.linkswap.app/eth.png'

const StyledEthereumLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
  position
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties,
  position?: string
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)]
      }

      return [getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === ETHER && position === 'button') {
    return <StyledEthereumLogo src={eth} size={size} style={style} />
  }

  if (currency?.symbol === 'LINK' && position === 'button') {
    return <StyledEthereumLogo src={link} size={size} style={style} />
  }

  if (currency?.symbol === 'YFL' && position === 'button') {
    return <StyledEthereumLogo src={yfl} size={size} style={style} />
  }

  if (currency === ETHER) {
    return <StyledEthereumLogo src={ethLogoURL} size={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}

export function EthLogo({ size = '24px', style }: { size?: string; style?: React.CSSProperties }) {
  return <StyledEthereumLogo src={eth} size={size} style={style} />
}

export function LinkLogo({ size = '24px', style }: { size?: string; style?: React.CSSProperties }) {
  return <StyledEthereumLogo src={link} size={size} style={style} />
}
