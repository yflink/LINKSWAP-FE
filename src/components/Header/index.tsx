import { ChainId } from '@uniswap/sdk'
import React, { useContext } from 'react'
import { isMobile } from 'react-device-detect'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'

import { useActiveWeb3React } from '../../hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import logo from '../../assets/svg/logo.png'

import { YellowCard } from '../Card'
import Theme from '../Theme'
import Settings from '../Settings'
import Language from '../Language'
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
  flex-direction: column;
  width: 100%;
  top: 0;
  position: relative;
  z-index: 2;
  background: ${({ theme }) => theme.headerBG};
  color: ${({ theme }) => theme.headerTextColor};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: flex-start;
`

const HeaderElementMobile = styled.div`
  display: flex;
  align-items: flex-start;
  @media (max-width: 699px) {
    display: none;
  }
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: flex-start;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 0 0 0.5rem 0;
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

const MenuText = styled.h3`
  margin: 0;
  padding: 0;
  font-family: 'Work Sans Thin', sans-serif;
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0.06em;
  padding: 4px 0;
  border-bottom: 2px solid transparent;
  color: ${({ theme }) => theme.headerTextColor};

  :hover {
    border-bottom: 2px solid ${({ theme }) => theme.headerTextColor};
  }
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
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
    align-items: flex-end;
  `};
`

const BalanceText = styled(Text)`
  color: ${({ theme }) => theme.headerButtonIconColor}
    ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`

const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: null,
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
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
      <RowBetween style={{ alignItems: 'flex-start' }} padding="1rem">
        <HeaderElement>
          <LogoWrapper>
            <Title href="https://yflink.io">
              <Logo src={logo}></Logo>
              <TitleText>YFLINK</TitleText>
            </Title>{' '}
            {hasSublogo && <SubLogo src={theme.logo}></SubLogo>}
          </LogoWrapper>

          {!isMobile && (
            <HeaderElementMobile>
              <Title style={{ marginInlineStart: 24 }} href="https://yflink.io/#/stake">
                <MenuText>Stake & Vote</MenuText>
              </Title>
              <Title style={{ marginInlineStart: 24 }} href="https://info.linkswap.app">
                <MenuText>Charts</MenuText>
              </Title>
              <Title style={{ marginInlineStart: 24 }} href="https://yflusd.linkswap.app">
                <MenuText>YFLUSD</MenuText>
              </Title>
              <Title style={{ marginInlineStart: 24 }} href="/#/ren">
                <MenuText>Ren Bridges</MenuText>
              </Title>
            </HeaderElementMobile>
          )}
        </HeaderElement>
        <HeaderControls style={{ flex: '0' }}>
          <HeaderElementWrap>
            <Theme />
            <Language />
            <Settings />
          </HeaderElementWrap>
          <HeaderElement style={{ flexWrap: 'wrap', flexGrow: 0 }}>
            <RowBetween>
              <TestnetWrapper>
                {!isMobile && chainId && NETWORK_LABELS[chainId] && (
                  <NetworkCard>{NETWORK_LABELS[chainId]}</NetworkCard>
                )}
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
      </RowBetween>
    </HeaderFrame>
  )
}
