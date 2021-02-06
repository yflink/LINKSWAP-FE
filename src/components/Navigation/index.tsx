import React from 'react'
import styled from 'styled-components'
import { Link2, ExternalLink } from 'react-feather'
import { RowBetween } from '../Row'
import QuestionHelper from '../QuestionHelper'

import { SwapSVG, PoolSVG, StakeSVG, BuySVG, YFLSVG } from '../SVG'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { useNavigationActiveItem, useNavigationActiveItemManager } from '../../state/navigation/hooks'

const ExternalLinkIcon = styled(ExternalLink)`
  margin-inline-end: 10px;
  color: ${({ theme }) => theme.textPrimary};
  height: 16px;
  width: auto;
  fill: transparent !important;
`
const BridgeIcon = styled(Link2)`
  margin-inline-end: 10px;
  color: ${({ theme }) => theme.textPrimary};
  height: 16px;
  width: auto;
  fill: transparent !important;
`

const NavigationBody = styled.ul`
  width: 100%;
  margin: 0 0 1.5rem;
  padding: 3rem 1rem;
  list-style: none;
  display: block;
`

const SubNavigationBody = styled.ul`
  width: 100%;
  margin: 0.5rem 0 1.5rem;
  padding: 0 0 0 26px;
  list-style: none;
  display: block;
`

const NavigationElement = styled.li`
  width: 100%;
  display: flex;
  flex: 0 0 100%;
  padding: 0;
  margin: 0 0 0.5rem;
  flex-wrap: wrap;
  font-size: 16px;

  & svg {
    margin-inline-end: 10px;
    height: 16px;
    width: auto;
    fill: ${({ theme }) => theme.textPrimary};
  }

  & * {
    color: ${({ theme }) => theme.textPrimary};
  }
`

const SubNavigationElement = styled.li`
  width: 100%;
  display: flex;
  flex: 0 0 100%;
  padding: 0;
  margin: 0 0 0.5rem;
  font-size: 14px;

  & * {
    color: ${({ theme }) => theme.textSecondary};
  }
`
const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  width: 100%;
  display: block;
  text-decoration: none;

  &.${activeClassName} {
    font-weight: bold;
    pointer-events: none;
  }

  &:hover {
    text-decoration: underline;
  }
`
const ExternalNavLink = styled.a`
  width: 100%;
  display: block;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`
const NavTitle = styled.span`
  width: 100%;
  display: flex;
  flex: 0 0 100%;
  flex-wrap: nowrap;
  align-items: center;
  text-transform: uppercase;
`

const NavLabel = styled.span`
  width: 100%;
  display: flex;
  flex: 0 0 100%;
  flex-wrap: nowrap;
  align-items: center;
`

export default function Navigation() {
  const active = useNavigationActiveItem()
  return (
    <nav>
      <NavigationBody>
        <NavigationElement>
          <NavTitle>
            <SwapSVG />
            Swap
          </NavTitle>
          <SubNavigationBody>
            <SubNavigationElement>
              <StyledNavLink id={'swap'} to={'/swap'} isActive={() => active === 'swap'}>
                <NavLabel>Ethereum</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <StyledNavLink
                id={'swap-link'}
                to={'/swap/0x514910771af9ca656af840dff83e8264ecf986ca'}
                isActive={() => active === 'swap-link'}
              >
                <NavLabel>Chainlink</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <StyledNavLink
                id={'swap-yflusd'}
                to={'/swap/0x7b760d06e401f85545f3b50c44bf5b05308b7b62'}
                isActive={() => active === 'swap-yflusd'}
              >
                <NavLabel>YFLink USD</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
          </SubNavigationBody>
        </NavigationElement>
        <NavigationElement>
          <NavTitle>
            <PoolSVG />
            Liquidity
          </NavTitle>
          <SubNavigationBody>
            <SubNavigationElement>
              <StyledNavLink id={'pool'} to={'/pool'} isActive={() => active === 'pool'}>
                <NavLabel>Your Positions</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <StyledNavLink id={'add'} to={'/add/ETH'} isActive={() => active === 'add-liquidity'}>
                <NavLabel>Add Liquidity</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <StyledNavLink id={'import-pool'} to={'/find'} isActive={() => active === 'import-pool'}>
                <NavLabel>Import Pool</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
          </SubNavigationBody>
        </NavigationElement>
        <NavigationElement>
          <NavTitle>
            <StakeSVG />
            LP Rewards
          </NavTitle>
          <SubNavigationBody>
            <SubNavigationElement>
              <StyledNavLink id={'stake'} to={'/stake'} isActive={() => active === 'stake'}>
                <NavLabel>All Pools</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <StyledNavLink id={'stake-yours'} to={'/stake/yours'} isActive={() => active === 'stake-yours'}>
                <NavLabel>Your Positions</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <StyledNavLink id={'stake-inactive'} to={'/stake/inactive'} isActive={() => active === 'stake-inactive'}>
                <NavLabel>Inactive Pools</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
          </SubNavigationBody>
        </NavigationElement>
        <NavigationElement>
          <NavTitle>
            <BuySVG />
            Wyre
          </NavTitle>
          <SubNavigationBody>
            <SubNavigationElement>
              <StyledNavLink id={'buy'} to={'/buy'} isActive={() => active === 'buy'}>
                <NavLabel>Buy Ethereum</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <StyledNavLink id={'buy-link'} to={'/buy/LINK'} isActive={() => active === 'buy-link'}>
                <NavLabel>Buy Chainlink</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
          </SubNavigationBody>
        </NavigationElement>
        <NavigationElement>
          <NavTitle>
            <BridgeIcon />
            Bridges
          </NavTitle>
          <SubNavigationBody>
            <SubNavigationElement>
              <StyledNavLink id={'bridge-ren'} to={'/ren'} isActive={() => active === 'bridge-ren'}>
                <NavLabel>renBridge</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
          </SubNavigationBody>
        </NavigationElement>
        <NavigationElement>
          <NavTitle>
            <YFLSVG />
            YFLUSD
          </NavTitle>
          <SubNavigationBody>
            <SubNavigationElement>
              <ExternalNavLink target="_blank" href="https://yflusd.linkswap.app">
                <NavLabel>Info</NavLabel>
              </ExternalNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <ExternalNavLink target="_blank" href="https://yflusd.linkswap.app/bank">
                <NavLabel>Pools</NavLabel>
              </ExternalNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <ExternalNavLink target="_blank" href="https://yflusd.linkswap.app/bonds">
                <NavLabel>Bonds</NavLabel>
              </ExternalNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <ExternalNavLink target="_blank" href="https://yflusd.linkswap.app/boardroom">
                <NavLabel>Boardroom</NavLabel>
              </ExternalNavLink>
            </SubNavigationElement>
          </SubNavigationBody>
        </NavigationElement>
        <NavigationElement>
          <NavTitle>
            <ExternalLinkIcon />
            External
          </NavTitle>
          <SubNavigationBody>
            <SubNavigationElement>
              <ExternalNavLink target="_blank" href="https://yflink.io/#/stake">
                <NavLabel>Stake & Vote</NavLabel>
              </ExternalNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <ExternalNavLink target="_blank" href="https://info.linkswap.app">
                <NavLabel>Charts</NavLabel>
              </ExternalNavLink>
            </SubNavigationElement>
          </SubNavigationBody>
        </NavigationElement>
      </NavigationBody>
    </nav>
  )
}
