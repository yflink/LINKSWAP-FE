import React from 'react'
import styled from 'styled-components'
import { ExternalLink, RefreshCw, Globe } from 'react-feather'
import { Settings } from 'react-feather'
import { SwapSVG, PoolSVG, StakeSVG, BuySVG, YFLSVG, WalletSVG, ThemeSVG } from '../SVG'
import { NavLink } from 'react-router-dom'
import { useNavigationActiveItem } from '../../state/navigation/hooks'
import { RowBetween } from '../Row'
import Theme from '../Theme'
import Language from '../Language'
import SettingsTab from '../Settings'
import Web3Status from '../Web3Status'
import Gas from '../Gas'
import { useActiveWeb3React } from '../../hooks'
import { useETHBalances, useTokenBalances, useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { Text } from 'rebass'
import { ChainId } from '@uniswap/sdk'
import { useExpertModeManager, useGetTheme } from '../../state/user/hooks'
import { AutoColumn } from '../Column'
import { LINK, sYFL, YFL, YFLUSD, yYFL } from '../../constants'
import Loader from '../Loader'
import { useTranslation } from 'react-i18next'

const NavigationIconWrapper = styled.div`
  width: 26px;
  height: 26px;
  position: relative;
  display: flex;
  align-items: center;

  & svg {
    height: 18px;
    width: auto;
    fill: ${({ theme }) => theme.textPrimary};
  }
`

const ExternalLinkIcon = styled(ExternalLink)`
  color: ${({ theme }) => theme.textPrimary};
  height: 16px;
  width: auto;
  fill: transparent !important;
`
const BridgeIcon = styled(RefreshCw)`
  color: ${({ theme }) => theme.textPrimary};
  height: 16px;
  width: auto;
  fill: transparent !important;
`
const LanguageIcon = styled(Globe)`
  color: ${({ theme }) => theme.textPrimary};
  height: 16px;
  width: auto;
  fill: transparent !important;
`

const NavigationBody = styled.ul`
  width: 100%;
  margin: 0;
  padding: 1rem;
  list-style: none;
  display: block;
`

const SubNavigationBody = styled.div`
  width: 100%;
  margin: 0.5rem 0 1.5rem;
  padding: 0;
  display: block;
  font-size: 14px;
`

const SubNavigationBodyList = styled.ul`
  width: 100%;
  margin: 0.5rem 0 1.5rem;
  padding: 0 0 0 26px;
  list-style: none;
  display: block;
  font-size: 14px;
`

const NavigationElement = styled.li`
  width: 100%;
  display: flex;
  flex: 0 0 100%;
  padding: 0;
  margin: 0 0 0.5rem;
  flex-wrap: wrap;
  font-size: 16px;
`

const SubNavigationElement = styled.li`
  width: 100%;
  display: flex;
  flex: 0 0 100%;
  padding: 0;
  margin: 0 0 0.5rem;
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
const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: 'Ethereum Mainnet',
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan'
}

const SettingsIconTop = styled(Settings)`
  height: 15px !important;
  width: 15px !important;
  position: absolute;
  left: 0;
  top: 3px;

  > * {
    fill: transparent !important;
    stroke: ${({ theme }) => theme.headerButtonIconColor};
  }
`
const SettingsIconBottom = styled(Settings)`
  height: 13px !important;
  width: 13px !important;
  position: absolute;
  right: 2px;
  bottom: 1px;

  > * {
    fill: transparent !important;
    stroke: ${({ theme }) => theme.headerButtonIconColor};
  }
`

const SettingsIcon = styled(Settings)`
  margin-inline-end: 10px;
  color: ${({ theme }) => theme.textPrimary};
  height: 16px;
  width: auto;
  fill: transparent !important;
`

const BalanceText = styled.p`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export default function Navigation() {
  const { account, chainId } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const active = useNavigationActiveItem()
  const [expertMode] = useExpertModeManager()
  const [userBalances, fetchingUserBalances] = useTokenBalancesWithLoadingIndicator(account ?? undefined, [
    LINK,
    YFL,
    YFLUSD,
    sYFL,
    yYFL
  ])
  const { t } = useTranslation()
  return (
    <nav>
      <NavigationBody>
        <NavigationElement>
          <NavTitle>
            <NavigationIconWrapper>
              <WalletSVG />
            </NavigationIconWrapper>
            Wallet
          </NavTitle>
          <SubNavigationBody>
            {account ? (
              <AutoColumn gap="8px">
                <Web3Status />
                {chainId && NETWORK_LABELS[chainId] && (
                  <RowBetween>
                    <Text>{t('network')}:</Text>
                    <Text>{NETWORK_LABELS[chainId]}</Text>
                  </RowBetween>
                )}
                <RowBetween>
                  <Gas />
                </RowBetween>
                <RowBetween>
                  <Text fontWeight={700}>Balances</Text>
                </RowBetween>
                {userEthBalance && (
                  <RowBetween>
                    <Text>Ethereum:</Text>
                    <Text>{userEthBalance?.toSignificant(4)} ETH</Text>
                  </RowBetween>
                )}
                {userBalances && (
                  <>
                    <RowBetween>
                      <Text>{LINK.name}:</Text>
                      {fetchingUserBalances ? (
                        <Loader />
                      ) : (
                        <BalanceText>{userBalances[LINK.address]?.toSignificant(4) + ' ' + LINK.symbol}</BalanceText>
                      )}
                    </RowBetween>
                    <RowBetween>
                      <Text>{YFL.name}:</Text>
                      {fetchingUserBalances ? (
                        <Loader />
                      ) : (
                        <BalanceText>{userBalances[YFL.address]?.toSignificant(4) + ' ' + YFL.symbol}</BalanceText>
                      )}
                    </RowBetween>

                    {userBalances[YFLUSD.address]?.toSignificant(1) !== '0' && (
                      <RowBetween>
                        <Text>{YFLUSD.name}:</Text>
                        {fetchingUserBalances ? (
                          <Loader />
                        ) : (
                          <BalanceText>
                            {userBalances[YFLUSD.address]?.toSignificant(4) + ' ' + YFLUSD.symbol}
                          </BalanceText>
                        )}
                      </RowBetween>
                    )}
                    {userBalances[sYFL.address]?.toSignificant(1) !== '0' && (
                      <RowBetween>
                        <Text>{sYFL.name}:</Text>
                        {fetchingUserBalances ? (
                          <Loader />
                        ) : (
                          <BalanceText>{userBalances[sYFL.address]?.toSignificant(4) + ' ' + sYFL.symbol}</BalanceText>
                        )}
                      </RowBetween>
                    )}
                    {userBalances[yYFL.address]?.toSignificant(1) !== '0' && (
                      <RowBetween>
                        <Text>{yYFL.name}:</Text>
                        {fetchingUserBalances ? (
                          <Loader />
                        ) : (
                          <BalanceText>{userBalances[yYFL.address]?.toSignificant(4) + ' ' + yYFL.symbol}</BalanceText>
                        )}
                      </RowBetween>
                    )}
                  </>
                )}
              </AutoColumn>
            ) : (
              <AutoColumn gap="8px">
                <Web3Status />
                <RowBetween>
                  <Gas />
                </RowBetween>
              </AutoColumn>
            )}
          </SubNavigationBody>
        </NavigationElement>
        <NavigationElement>
          <NavTitle>
            {expertMode ? (
              <NavigationIconWrapper>
                <SettingsIconTop />
                <SettingsIconBottom />
              </NavigationIconWrapper>
            ) : (
              <NavigationIconWrapper>
                <SettingsIcon />
              </NavigationIconWrapper>
            )}
            {t('settings')}
          </NavTitle>
          <SubNavigationBody>
            <SettingsTab />
          </SubNavigationBody>
        </NavigationElement>
        <NavigationElement>
          <NavTitle>
            <NavigationIconWrapper>
              <SwapSVG />
            </NavigationIconWrapper>
            {t('swap')}
          </NavTitle>
          <SubNavigationBodyList>
            <SubNavigationElement>
              <StyledNavLink
                id={'swap-link'}
                to={'/swap/0x514910771af9ca656af840dff83e8264ecf986ca/ETH'}
                isActive={() => active === 'swap-link'}
              >
                <NavLabel>{LINK.symbol}</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <StyledNavLink id={'swap'} to={'/swap/ETH'} isActive={() => active === 'swap'}>
                <NavLabel>Ethereum</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <StyledNavLink
                id={'swap-yflusd'}
                to={'/swap/0x7b760d06e401f85545f3b50c44bf5b05308b7b62'}
                isActive={() => active === 'swap-yflusd'}
              >
                <NavLabel>{YFLUSD.symbol}</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
          </SubNavigationBodyList>
        </NavigationElement>
        <NavigationElement>
          <NavTitle>
            <NavigationIconWrapper>
              <PoolSVG />
            </NavigationIconWrapper>
            {t('liquidity')}
          </NavTitle>
          <SubNavigationBodyList>
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
          </SubNavigationBodyList>
        </NavigationElement>
        <NavigationElement>
          <NavTitle>
            <NavigationIconWrapper>
              <StakeSVG />
            </NavigationIconWrapper>
            {t('staking')}
          </NavTitle>
          <SubNavigationBodyList>
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
          </SubNavigationBodyList>
        </NavigationElement>
        <NavigationElement>
          <NavTitle>
            <NavigationIconWrapper>
              <BuySVG />
            </NavigationIconWrapper>
            Wyre
          </NavTitle>
          <SubNavigationBodyList>
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
          </SubNavigationBodyList>
        </NavigationElement>
        <NavigationElement>
          <NavTitle>
            <NavigationIconWrapper>
              <BridgeIcon />
            </NavigationIconWrapper>
            Bridges
          </NavTitle>
          <SubNavigationBodyList>
            <SubNavigationElement>
              <StyledNavLink id={'bridges'} to={'/bridges'} isActive={() => active === 'bridges'}>
                <NavLabel>Overview</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <StyledNavLink id={'bridges-renbch'} to={'/bridges/ren/bch'} isActive={() => active === 'bridges-renbch'}>
                <NavLabel>RenBCH</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <StyledNavLink id={'bridges-renbtc'} to={'/bridges/ren/btc'} isActive={() => active === 'bridges-renbtc'}>
                <NavLabel>RenBTC</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <StyledNavLink id={'bridges-rendgb'} to={'/bridges/ren/dgb'} isActive={() => active === 'bridges-rendgb'}>
                <NavLabel>RenDGB</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <StyledNavLink
                id={'bridges-rendoge'}
                to={'/bridges/ren/doge'}
                isActive={() => active === 'bridges-rendoge'}
              >
                <NavLabel>RenDOGE</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <StyledNavLink id={'bridges-renfil'} to={'/bridges/ren/fil'} isActive={() => active === 'bridges-renfil'}>
                <NavLabel>RenFIL</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <StyledNavLink
                id={'bridges-renluna'}
                to={'/bridges/ren/luna'}
                isActive={() => active === 'bridges-renluna'}
              >
                <NavLabel>RenLUNA</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
            <SubNavigationElement>
              <StyledNavLink id={'bridges-renzec'} to={'/bridges/ren/zec'} isActive={() => active === 'bridges-renzec'}>
                <NavLabel>RenZEC</NavLabel>
              </StyledNavLink>
            </SubNavigationElement>
          </SubNavigationBodyList>
        </NavigationElement>
        <NavigationElement>
          <NavTitle>
            <NavigationIconWrapper>
              <YFLSVG />
            </NavigationIconWrapper>
            YFLUSD
          </NavTitle>
          <SubNavigationBodyList>
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
          </SubNavigationBodyList>
        </NavigationElement>
        <NavigationElement>
          <NavTitle>
            <NavigationIconWrapper>
              <ExternalLinkIcon />
            </NavigationIconWrapper>
            External
          </NavTitle>
          <SubNavigationBodyList>
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
          </SubNavigationBodyList>
        </NavigationElement>
        <NavigationElement>
          <NavTitle>
            <NavigationIconWrapper>
              <ThemeSVG />
            </NavigationIconWrapper>
            Themes
          </NavTitle>
          <SubNavigationBody>
            <Theme />
          </SubNavigationBody>
        </NavigationElement>
        <NavigationElement>
          <NavTitle>
            <NavigationIconWrapper>
              <LanguageIcon />
            </NavigationIconWrapper>
            Languages
          </NavTitle>
          <SubNavigationBody>
            <Language />
          </SubNavigationBody>
        </NavigationElement>
      </NavigationBody>
    </nav>
  )
}
