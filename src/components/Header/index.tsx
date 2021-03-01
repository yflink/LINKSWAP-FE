import { ChainId } from '@uniswap/sdk'
import React, { useContext } from 'react'
import { isMobile } from 'react-device-detect'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'

import { useActiveWeb3React } from '../../hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import logo from '../../assets/svg/logo.png'

import { YellowCard } from '../Card'
import Gas from '../Gas'

import { RowBetween } from '../Row'
import Web3Status from '../Web3Status'
import { useGasPrices } from '../../hooks/useGasPrice'
import { useCurrencyUsdPrice } from '../../hooks/useCurrencyUsdPrice'
import { useTokenUsdPrices } from '../../hooks/useTokenUsdPrice'
import { useLPTokenUsdPrices } from '../../hooks/useLPTokenUsdPrice'
import { useMphPools } from '../../hooks/useMphPools'

const HeaderFrame = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex: 0 0 100%;
  width: 100%;
  top: 0;
  position: relative;
  z-index: 2;
  background: ${({ theme }) => theme.headerBG};
  color: ${({ theme }) => theme.headerTextColor};
  padding: 1rem;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: flex-start;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex: 0 0 100%;
  `};
`

const Logo = styled.img`
  height: 30px;
  margin-inline-end: 8px;
`

const SubLogo = styled.img`
  height: 30px;
  margin-top: 10px;
`

const LogoWrapper = styled.div`
  display: inline-block;
`

const Title = styled.a`
  display: flex;
  align-items: flex-start;
  color: #ffffff;
  text-decoration: none;
  pointer-events: auto;
  :hover {
    cursor: pointer;
  }
`

const TitleText = styled.h1`
  margin: 0;
  padding: 0;
  font-family: 'Formular Thin', sans-serif;
  font-size: 24px;
  font-weight: 100;
  letter-spacing: 0.3em;
  color: ${({ theme }) => theme.headerTextColor};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: ${({ theme, active }) => (!active ? theme.modalBG : theme.headerButtonBG)};
  border-radius: 6px;
  white-space: nowrap;
  width: 100%;

  :focus {
    border: 1px solid blue;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 0 44px 0 0;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 1rem 0 0;
    flex: 0;
  `};
`

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-inline-start: 10px;
  pointer-events: auto;
`

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-inline-end: 10px;
  border-radius: 6px;
  padding: 8px 12px;
`

const HeaderControls = styled.div`
  display: none;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex: 0;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex: 0 0 100%;
  `};
`

const BalanceText = styled(Text)`
  color: ${({ theme }) => theme.headerButtonIconColor}
    ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: null,
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GOERLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan'
}

export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const theme = useContext(ThemeContext)
  const hasSublogo = theme.logo.length > 2
  useGasPrices()
  useCurrencyUsdPrice()
  useTokenUsdPrices()
  useLPTokenUsdPrices()
  useMphPools()
  return (
    <HeaderFrame>
      <HeaderElement>
        <LogoWrapper>
          <Title href="https://yflink.io">
            <Logo src={logo} />
            <TitleText>YFLINK</TitleText>
          </Title>
          {hasSublogo && <SubLogo src={theme.logo}></SubLogo>}
        </LogoWrapper>
      </HeaderElement>
      <HeaderControls>
        <HeaderElement style={{ flexWrap: 'wrap', flexGrow: 0 }}>
          <RowBetween>
            <TestnetWrapper>
              {!isMobile && chainId && NETWORK_LABELS[chainId] && <NetworkCard>{NETWORK_LABELS[chainId]}</NetworkCard>}
            </TestnetWrapper>
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} ETH
                </BalanceText>
              ) : null}
              <Web3Status />
            </AccountElement>
          </RowBetween>
          <RowBetween>
            <Gas />
          </RowBetween>
        </HeaderElement>
      </HeaderControls>
    </HeaderFrame>
  )
}
