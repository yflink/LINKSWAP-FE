import { ChainId } from '@uniswap/sdk'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { Text } from 'rebass'
import styled from 'styled-components'

import { useActiveWeb3React } from '../../hooks'
import { useETHBalances } from '../../state/wallet/hooks'
import logo from '../../assets/svg/logo.png'

import { YellowCard } from '../Card'
import Settings from '../Settings'
import Language from '../Language'
// import Menu from '../Menu'

import { RowBetween } from '../Row'
import Web3Status from '../Web3Status'
import { useThemeManager } from '../../state/user/hooks'

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  top: 0;
  position: absolute;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 0 0 0;
    width: calc(100%);
    position: relative;
  `};
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
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0.5rem 0;
`};
`

const Logo = styled.img`
  height: 30px;
  margin-inline-end: 8px;
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
`

const MenuText = styled.h3`
  margin: 0;
  padding: 0;
  font-family: 'Work Sans Thin', sans-serif;
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0.06em;
  padding-bottom: 8px;
  :hover {
    border-bottom: 4px solid white;
  }
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
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
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-end;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const ThemeToggles = styled.div`
  position: absolute;
  top: 60px;
  left: 1rem;
  display: flex;
  flex-wrap: nowrap;
  flex: 0 0 auto;
`

const ThemeToggle = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin: 0 1rem 0 0;
  padding: 0;
  background-color: ${({ theme }) => theme.bg3};
  padding: 0.5rem;
  border-radius: 0.5rem;

  :hover {
    cursor: pointer;
  }
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
  const newTheme = useThemeManager()

  return (
    <HeaderFrame>
      <RowBetween style={{ alignItems: 'flex-start' }} padding="1rem 1rem 0 1rem">
        <HeaderElement>
          <Title href="https://yflink.io">
            <Logo src={logo}></Logo>
            <TitleText>YFLINK</TitleText>
          </Title>{' '}
          {!isMobile && (
            <HeaderElementMobile>
              <Title
                style={{ marginTop: 4, marginInlineStart: 24 }}
                target="_blank"
                href="https://rewards.linkswap.app/"
              >
                <MenuText>LP Rewards</MenuText>
              </Title>
              <Title style={{ marginTop: 4, marginInlineStart: 36 }} target="_blank" href="https://yflink.io/#/vote">
                <MenuText>VOTE</MenuText>
              </Title>
              <Title
                style={{ marginTop: 4, marginInlineStart: 24 }}
                href="https://linkswap.app/#/swap?outputCurrency=0x28cb7e841ee97947a86b06fa4090c8451f64c0be"
              >
                <MenuText>Buy YFL</MenuText>
              </Title>
            </HeaderElementMobile>
          )}
          <ThemeToggles>
            <ThemeToggle onClick={() => newTheme('default')}>
              <img
                src="https://logos.linkswap.app/0x28cb7e841ee97947a86b06fa4090c8451f64c0be.png"
                height="20px"
                width="20px"
                alt="YFLink"
              />&nbsp;YFL
            </ThemeToggle>
            <ThemeToggle onClick={() => newTheme('cyberfi')}>
              <img
                src="https://logos.linkswap.app/0x63b4f3e3fa4e438698ce330e365e831f7ccd1ef4.png"
                height="20px"
                width="20px"
                alt="CFi"
              />&nbsp;CFi
            </ThemeToggle>
          </ThemeToggles>
        </HeaderElement>
        <HeaderControls>
          <HeaderElementWrap>
            <Language />
            <Settings />
            {/* <Menu /> */}
          </HeaderElementWrap>
          <HeaderElement>
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
          </HeaderElement>
        </HeaderControls>
      </RowBetween>
    </HeaderFrame>
  )
}
