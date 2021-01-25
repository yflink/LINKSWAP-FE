import { Currency, ETHER, Token } from '@uniswap/sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import Logo from '../Logo'

import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'

import { ETHSVG, LINKSVG, YFLSVG } from '../SVG'

const getTokenLogoURL = (address: string) => `https://logos.linkswap.app/${address.toLowerCase()}.png`

const ethLogoURL = 'https://logos.linkswap.app/eth.png'

const StyledSVGLogo = styled.div<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};

  > * {
    width: auto;
    height: ${({ size }) => size};
    fill: ${({ theme }) => theme.textPrimary};
  }
`

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
  style?: React.CSSProperties
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
    return (
      <StyledSVGLogo size={size} style={style}>
        <ETHSVG />
      </StyledSVGLogo>
    )
  }

  if (currency?.symbol === 'LINK' && position === 'button') {
    return (
      <StyledSVGLogo size={size} style={style}>
        <LINKSVG />
      </StyledSVGLogo>
    )
  }

  if (currency?.symbol === 'YFL' && position === 'button') {
    return (
      <StyledSVGLogo size={size} style={style}>
        <YFLSVG />
      </StyledSVGLogo>
    )
  }

  if (currency === ETHER) {
    return <StyledEthereumLogo src={ethLogoURL} size={size} style={style} />
  }

  return <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
}

export function EthLogo({ size = '24px', style }: { size?: string; style?: React.CSSProperties }) {
  return (
    <StyledSVGLogo size={size} style={style}>
      <ETHSVG />
    </StyledSVGLogo>
  )
}

export function LinkLogo({ size = '24px', style }: { size?: string; style?: React.CSSProperties }) {
  return (
    <StyledSVGLogo size={size} style={style}>
      <LINKSVG />
    </StyledSVGLogo>
  )
}
