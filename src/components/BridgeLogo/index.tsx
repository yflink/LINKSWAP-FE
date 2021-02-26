import { Currency } from '@uniswap/sdk'
import React from 'react'
import styled from 'styled-components'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { MPHSVG, RENSVG } from '../SVG'
import CurrencyLogo from '../CurrencyLogo'
import { NavLink } from 'react-router-dom'

const Wrapper = styled(NavLink)`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 20px;
  border-radius: 6px;
  floex: 0 0 100%;
  width: 100%;
  justify-content: space-between;
  background: ${({ theme }) => theme.appBoxBG};
  border: 1px solid ${({ theme }) => theme.appBoxBG};
  color: ${({ theme }) => theme.textPrimary};
  text-decoration: none;
  :hover {
    border: 1px solid ${({ theme }) => theme.textHighlight};
  }
  position: relative;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 12px 10px;
  `};
`

const InfoWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  justify-content: center;
  align-items: center;
`

const StyledLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

const PlatformIcon = styled.div`
  opacity: 0.3;
  height: 40px;
  width: 40px;
  & svg {
    height: 40px;
    width: 40px;
    fill: ${({ theme }) => theme.textPrimary};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const ArrowLeftIcon = styled(ArrowLeft)`
  display: inline-block;
  margin-inline-end: 3px;
  width: 18px;
  height: 18px;
  margin-bottom: -2px;
  > * {
    stroke: ${({ theme }) => theme.textPrimary};
  }
`
const ArrowRightIcon = styled(ArrowRight)`
  display: inline-block;
  margin-inline-start: 3px;
  width: 18px;
  height: 18px;
  margin-bottom: -2px;
  > * {
    stroke: ${({ theme }) => theme.textPrimary};
  }
`

const CurrencySymbol = styled.div`
  margin: 0 10px;
  font-size: 16px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 13px;
  `};
`

interface BridgeCurrencyLogoProps {
  size?: number
  currency0?: any
  currency1?: Currency | any
  url: string
}

export default function BridgeCurrencyLogo({ currency0, currency1, size = 40, url }: BridgeCurrencyLogoProps) {
  return (
    <Wrapper to={url}>
      <StyledLogo
        src={`https://logos.linkswap.app/${currency0.symbol.toLowerCase()}.png`}
        alt={currency0.symbol}
        size={size.toString() + 'px'}
      />
      <InfoWrapper>
        <CurrencySymbol>{currency0.symbol}</CurrencySymbol>
        <ArrowLeftIcon />
        <PlatformIcon>
          <RENSVG />
        </PlatformIcon>
        <ArrowRightIcon />
        <CurrencySymbol>{currency1.symbol}</CurrencySymbol>
      </InfoWrapper>
      {currency1 && <CurrencyLogo currency={currency1} size={size.toString() + 'px'} />}
    </Wrapper>
  )
}
