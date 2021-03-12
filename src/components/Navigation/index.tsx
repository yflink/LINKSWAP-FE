import React, { useState } from 'react'
import styled from 'styled-components'
import { ExternalLink, Globe, PlusSquare, MinusSquare, Menu, X } from 'react-feather'
import { Settings } from 'react-feather'
import { SwapSVG, PoolSVG, StakeSVG, BuySVG, YFLSVG, WalletSVG, ThemeSVG, BridgeSVG } from '../SVG'
import { NavLink } from 'react-router-dom'
import { useNavigationActiveItem } from '../../state/navigation/hooks'
import { RowBetween } from '../Row'
import Theme from '../Theme'
import Language from '../Language'
import SettingsTab from '../Settings'
import Web3Status from '../Web3Status'
import Gas from '../Gas'
import { useActiveWeb3React } from '../../hooks'
import { useETHBalances, useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { Text } from 'rebass'
import { ChainId } from '@uniswap/sdk'
import { useExpertModeManager, useGetTheme } from '../../state/user/hooks'
import { AutoColumn } from '../Column'
import { LINK, sYFL, YFL, YFLUSD, yYFL } from '../../constants'
import Loader from '../Loader'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

const NavigationWrapper = styled.nav<{ active?: boolean }>`
  height: 100vh;
  position: fixed;
  top: 0;
  right: -20px;
  width: 320px;
  display: flex;
  flex: 0 0 320px;
  flex-direction: column;
  flex-wrap: wrap;
  background: ${({ theme }) => theme.appBGColor};
  border-left: 1px solid ${({ theme }) => theme.modalBorder};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  overflow-x: hidden;
  overflow-y: scroll;
  box-sizing: content-box;
  z-index: 4;

  [dir='rtl'] & {
    right: unset;
    left: -20px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    right: 0;
    [dir='rtl'] & {
      right: unset;
      left: 0;
    }
    width: 100%;
    height: 100%;
    flex: 0 0 100%;
  `};

  @media (max-width: 960px) {
    display: ${({ active }) => (active ? 'block' : 'none')};
  }
`

const NavigationIconWrapper = styled.div`
  width: 26px;
  height: 26px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-inline-end: 10px;

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
  padding-inline-end: 2rem;
  list-style: none;
  display: block;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100vw;
    padding: 1rem;
  `};
`

const SubNavigationBody = styled.div<{ show?: boolean }>`
  width: 100%;
  margin: 0.5rem 0 1rem;
  padding: 0;
  display: ${({ show }) => (show ? 'block' : 'none')};
  font-size: 14px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 16px;
  `};

  * {
    ::selection {
      background: transparent;
    }
  }
`

const SubNavigationBodyList = styled.ul<{ show?: boolean }>`
  width: 100%;
  margin: 0.5rem 0 0;
  padding: 0 0 0 36px;
  list-style: none;
  display: ${({ show }) => (show ? 'block' : 'none')};
  font-size: 14px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 16px;
  `};

  * {
    ::selection {
      background: transparent;
    }
  }
`

const NavigationElement = styled.li`
  width: 100%;
  display: flex;
  flex: 0 0 100%;
  padding: 0;
  margin: 0 0 0.5rem;
  flex-wrap: wrap;
  font-size: 16px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 0 0 1rem;
  `};
`

const SubNavigationElement = styled.li`
  width: 100%;
  display: flex;
  flex: 0 0 100%;
  padding: 0;
  margin: 0 0 0.5rem;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 0 0 1rem;
  `};
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
const NavTitle = styled.div<{ active?: boolean }>`
  width: 100%;
  display: flex;
  flex: 0 0 100%;
  flex-wrap: nowrap;
  align-items: center;
  font-weight: ${({ active }) => (active ? '700' : 'normal')};
  text-transform: uppercase;
  position: relative;
  z-index: 1;
`
const NavTitleLink = styled.span`
  display: flex;
  flex: 0;
  flex-wrap: nowrap;
  align-items: center;

  ::selection {
    background: transparent;
  }

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
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
  [ChainId.GOERLI]: 'Görli',
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
    stroke: ${({ theme }) => theme.textPrimary};
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
    stroke: ${({ theme }) => theme.textPrimary};
  }
`

const SettingsIcon = styled(Settings)`
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

const CollapseToggle = styled.div`
  height: 26px;
  width: 23px;
  padding: 3px 0 3px 3px;
  display: block;
  position: absolute;
  right: 0;
  z-index: 2;

  &:hover {
    cursor: pointer;

    & > * {
      color: ${({ theme }) => theme.textHighlight};

      ${({ theme }) => theme.mediaWidth.upToSmall`
        color: ${({ theme }) => theme.textPrimary};
      `};
    }
  }

  [dir='rtl'] & {
    right: unset;
    left: 0;
    padding: 3px 3px 3px 0;
  }
`

const ExpandIcon = styled(PlusSquare)`
  color: ${({ theme }) => theme.textPrimary};
  height: 20px;
  width: auto;
  fill: transparent !important;
`

const CollapseIcon = styled(MinusSquare)`
  color: ${({ theme }) => theme.textPrimary};
  height: 20px;
  width: auto;
  fill: transparent !important;
`

const NavigationToggleInMenu = styled.div`
  width: 100%;
  height: 35px;
  margin: 0;
  padding: 1rem 0 2rem;
  display: none;
  align-items: center;
  justify-content: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: flex;
  `};

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }
`
const NavigationToggle = styled.div`
  width: 32px;
  height: 35px;
  border: none;
  margin: 0;
  padding: 0;
  background: ${({ theme }) => theme.headerButtonBG};
  padding: 2px 5px;
  border-radius: 0.5rem;
  display: none;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 2;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: flex;
  `};

  :hover {
    cursor: pointer;
    outline: none;
    background: ${({ theme }) => theme.headerButtonBGHover};
  }
`

const NavigationCloseIcon = styled(X)`
  height: 22px;
  width: 22px;

  > * {
    stroke: ${({ theme }) => theme.headerButtonIconColor};
  }
`

const NavigationIcon = styled(Menu)`
  height: 22px;
  width: 22px;

  > * {
    stroke: ${({ theme }) => theme.headerButtonIconColor};
  }
`

export default function Navigation() {
  const { account, chainId } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const active = useNavigationActiveItem()
  const currentActive = active.split('-')[0]
  const [oldPage, setOldPage] = useState('swap')
  const [showMenu, setShowMenu] = useState(false)
  const [showWallet, setShowWallet] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showSwap, setShowSwap] = useState(false)
  const [showLiquidity, setShowLiquidity] = useState(false)
  const [showStaking, setShowStaking] = useState(false)
  const [showWyre, setShowWyre] = useState(false)
  const [showBridges, setShowBridges] = useState(false)
  const [showYflusd, setShowYflusd] = useState(false)
  const [showExternal, setShowExternal] = useState(false)
  const [showThemes, setShowThemes] = useState(false)
  const [showLanguages, setShowLanguages] = useState(false)
  const [expertMode] = useExpertModeManager()
  const currentTheme = useGetTheme()
  const [userBalances, fetchingUserBalances] = useTokenBalancesWithLoadingIndicator(account ?? undefined, [
    LINK,
    YFL,
    YFLUSD,
    sYFL,
    yYFL
  ])
  const { t } = useTranslation()
  const history = useHistory()
  const goTo = (path: string) => {
    history.push(path)
  }

  if (oldPage !== active) {
    setOldPage(active)
    setShowMenu(false)
  }

  switch (currentActive) {
    case 'liquidity':
      if (!showLiquidity) {
        setShowSwap(false)
        setShowLiquidity(true)
        setShowStaking(false)
        setShowWyre(false)
        setShowBridges(false)
      }
      break
    case 'stake':
      if (!showStaking) {
        setShowSwap(false)
        setShowLiquidity(false)
        setShowStaking(true)
        setShowWyre(false)
        setShowBridges(false)
      }
      break
    case 'buy':
      if (!showWyre) {
        setShowSwap(false)
        setShowLiquidity(false)
        setShowStaking(false)
        setShowWyre(true)
        setShowBridges(false)
      }
      break
    case 'bridges':
      if (!showBridges) {
        setShowSwap(false)
        setShowLiquidity(false)
        setShowStaking(false)
        setShowWyre(false)
        setShowBridges(true)
      }
      break
    default:
      if (!showSwap) {
        setShowSwap(true)
        setShowLiquidity(false)
        setShowStaking(false)
        setShowWyre(false)
        setShowBridges(false)
      }
  }

  return (
    <>
      <NavigationToggle
        onClick={() => {
          setShowMenu(!showMenu)
        }}
      >
        {showMenu ? <NavigationCloseIcon /> : <NavigationIcon />}
      </NavigationToggle>
      <NavigationWrapper active={showMenu}>
        <NavigationBody>
          <NavigationToggleInMenu
            onClick={() => {
              setShowMenu(!showMenu)
            }}
          >
            {showMenu ? <NavigationCloseIcon /> : <NavigationIcon />}
          </NavigationToggleInMenu>
          <NavigationElement>
            <NavTitle>
              <NavTitleLink
                onClick={() => {
                  setShowWallet(!showWallet)
                }}
              >
                <NavigationIconWrapper>
                  <WalletSVG />
                </NavigationIconWrapper>
                {t('wallet')}
              </NavTitleLink>
              <CollapseToggle
                onClick={() => {
                  setShowWallet(!showWallet)
                }}
              >
                {showWallet ? <CollapseIcon /> : <ExpandIcon />}
              </CollapseToggle>
            </NavTitle>
            <SubNavigationBody show={showWallet}>
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
                            <BalanceText>
                              {userBalances[sYFL.address]?.toSignificant(4) + ' ' + sYFL.symbol}
                            </BalanceText>
                          )}
                        </RowBetween>
                      )}
                      {userBalances[yYFL.address]?.toSignificant(1) !== '0' && (
                        <RowBetween>
                          <Text>{yYFL.name}:</Text>
                          {fetchingUserBalances ? (
                            <Loader />
                          ) : (
                            <BalanceText>
                              {userBalances[yYFL.address]?.toSignificant(4) + ' ' + yYFL.symbol}
                            </BalanceText>
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
              <NavTitleLink
                onClick={() => {
                  setShowSettings(!showSettings)
                }}
              >
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
              </NavTitleLink>
              <CollapseToggle
                onClick={() => {
                  setShowSettings(!showSettings)
                }}
              >
                {showSettings ? <CollapseIcon /> : <ExpandIcon />}
              </CollapseToggle>
            </NavTitle>
            <SubNavigationBody show={showSettings}>
              <SettingsTab />
            </SubNavigationBody>
          </NavigationElement>
          <NavigationElement>
            <NavTitle active={currentActive === 'swap'}>
              <NavTitleLink
                onClick={() => {
                  goTo('/swap')
                  if (!showSwap) {
                    setShowSwap(true)
                    setShowLiquidity(false)
                    setShowStaking(false)
                    setShowWyre(false)
                    setShowBridges(false)
                  }
                }}
              >
                <NavigationIconWrapper>
                  <SwapSVG />
                </NavigationIconWrapper>
                {t('swap')}
              </NavTitleLink>
              {currentActive !== 'swap' && (
                <CollapseToggle
                  onClick={() => {
                    setShowSwap(!showSwap)
                  }}
                >
                  {showSwap ? <CollapseIcon /> : <ExpandIcon />}
                </CollapseToggle>
              )}
            </NavTitle>
            <SubNavigationBodyList show={showSwap}>
              <SubNavigationElement>
                <StyledNavLink
                  id={'swap-link'}
                  to={`/swap/${currentTheme}/0x514910771af9ca656af840dff83e8264ecf986ca/ETH`}
                  isActive={() => active === 'swap-link'}
                >
                  <NavLabel>{LINK.symbol}</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink id={'swap'} to={'/swap/ETH'} isActive={() => active === 'swap'}>
                  <NavLabel>ETH</NavLabel>
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
            <NavTitle active={currentActive === 'liquidity'}>
              <NavTitleLink
                onClick={() => {
                  goTo('/pool')
                  if (!showLiquidity) {
                    setShowSwap(false)
                    setShowLiquidity(true)
                    setShowStaking(false)
                    setShowWyre(false)
                    setShowBridges(false)
                  }
                }}
              >
                <NavigationIconWrapper>
                  <PoolSVG />
                </NavigationIconWrapper>
                {t('liquidity')}
              </NavTitleLink>
              {currentActive !== 'liquidity' && (
                <CollapseToggle
                  onClick={() => {
                    setShowLiquidity(!showLiquidity)
                  }}
                >
                  {showLiquidity ? <CollapseIcon /> : <ExpandIcon />}
                </CollapseToggle>
              )}
            </NavTitle>
            <SubNavigationBodyList show={showLiquidity}>
              <SubNavigationElement>
                <StyledNavLink id={'pool'} to={'/pool'} isActive={() => active === 'liquidity-pool'}>
                  <NavLabel>{t('myPositions')}</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink id={'add'} to={'/add/ETH'} isActive={() => active === 'liquidity-add'}>
                  <NavLabel>{t('addLiquidity')}</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink id={'import-pool'} to={'/find'} isActive={() => active === 'liquidity-import'}>
                  <NavLabel>{t('importPool')}</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
            </SubNavigationBodyList>
          </NavigationElement>
          <NavigationElement>
            <NavTitle active={currentActive === 'stake'}>
              <NavTitleLink
                onClick={() => {
                  goTo('/stake')
                  if (!showStaking) {
                    setShowSwap(false)
                    setShowLiquidity(false)
                    setShowStaking(true)
                    setShowWyre(false)
                    setShowBridges(false)
                  }
                }}
              >
                <NavigationIconWrapper>
                  <StakeSVG />
                </NavigationIconWrapper>
                {t('staking')}
              </NavTitleLink>
              {currentActive !== 'stake' && (
                <CollapseToggle
                  onClick={() => {
                    setShowStaking(!showStaking)
                  }}
                >
                  {showStaking ? <CollapseIcon /> : <ExpandIcon />}
                </CollapseToggle>
              )}
            </NavTitle>
            <SubNavigationBodyList show={showStaking}>
              <SubNavigationElement>
                <StyledNavLink id={'stake'} to={'/stake'} isActive={() => active === 'stake'}>
                  <NavLabel>{t('allPools')}</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink id={'stake'} to={'/stake/gov'} isActive={() => active === 'stake-governance'}>
                  <NavLabel>{t('stakeGovernance')}</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink id={'stake-yours'} to={'/stake/yours'} isActive={() => active === 'stake-yours'}>
                  <NavLabel>{t('myPositions')}</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink
                  id={'stake-inactive'}
                  to={'/stake/inactive'}
                  isActive={() => active === 'stake-inactive'}
                >
                  <NavLabel>{t('inactivePools')}</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
            </SubNavigationBodyList>
          </NavigationElement>
          <NavigationElement>
            <NavTitle active={currentActive === 'bridges'}>
              <NavTitleLink
                onClick={() => {
                  goTo('/bridges')
                  if (!showBridges) {
                    setShowSwap(false)
                    setShowLiquidity(false)
                    setShowStaking(false)
                    setShowWyre(false)
                    setShowBridges(true)
                  }
                }}
              >
                <NavigationIconWrapper>
                  <BridgeSVG />
                </NavigationIconWrapper>
                {t('bridges')}
              </NavTitleLink>
              {currentActive !== 'bridges' && (
                <CollapseToggle
                  onClick={() => {
                    setShowBridges(!showBridges)
                  }}
                >
                  {showBridges ? <CollapseIcon /> : <ExpandIcon />}
                </CollapseToggle>
              )}
            </NavTitle>
            <SubNavigationBodyList show={showBridges}>
              <SubNavigationElement>
                <StyledNavLink id={'bridges'} to={'/bridges'} isActive={() => active === 'bridges'}>
                  <NavLabel>{t('overview')}</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink id={'bridges-ren'} to={'/ren'} isActive={() => active === 'bridges-ren'}>
                  <NavLabel>{t('bridgesRen')}</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink id={'bridges-scrt'} to={'/scrt'} isActive={() => active === 'bridges-scrt'}>
                  <NavLabel>{t('bridgesScrt')}</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink
                  id={'bridges-renbch'}
                  to={'/bridges/ren/bch'}
                  isActive={() => active === 'bridges-renbch'}
                >
                  <NavLabel>renBCH</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink
                  id={'bridges-renbtc'}
                  to={'/bridges/ren/btc'}
                  isActive={() => active === 'bridges-renbtc'}
                >
                  <NavLabel>renBTC</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink
                  id={'bridges-rendoge'}
                  to={'/bridges/ren/doge'}
                  isActive={() => active === 'bridges-rendoge'}
                >
                  <NavLabel>renDOGE</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink
                  id={'bridges-renfil'}
                  to={'/bridges/ren/fil'}
                  isActive={() => active === 'bridges-renfil'}
                >
                  <NavLabel>renFIL</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink
                  id={'bridges-renzec'}
                  to={'/bridges/ren/zec'}
                  isActive={() => active === 'bridges-renzec'}
                >
                  <NavLabel>renZEC</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink
                  id={'bridges-scrteth'}
                  to={'/bridges/scrt/eth'}
                  isActive={() => active === 'bridges-scrteth'}
                >
                  <NavLabel>secretETH</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink
                  id={'bridges-scrtlink'}
                  to={'/bridges/scrt/link'}
                  isActive={() => active === 'bridges-scrtlink'}
                >
                  <NavLabel>secretLINK</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink
                  id={'bridges-scrtyfl'}
                  to={'/bridges/scrt/yfl'}
                  isActive={() => active === 'bridges-scrtyfl'}
                >
                  <NavLabel>secretYFL</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
            </SubNavigationBodyList>
          </NavigationElement>
          <NavigationElement>
            <NavTitle active={currentActive === 'buy'}>
              <NavTitleLink
                onClick={() => {
                  goTo('/buy')
                  if (!showWyre) {
                    setShowSwap(false)
                    setShowLiquidity(false)
                    setShowStaking(false)
                    setShowWyre(true)
                    setShowBridges(false)
                  }
                }}
              >
                <NavigationIconWrapper>
                  <BuySVG />
                </NavigationIconWrapper>
                Wyre
              </NavTitleLink>
              {currentActive !== 'buy' && (
                <CollapseToggle
                  onClick={() => {
                    setShowWyre(!showWyre)
                  }}
                >
                  {showWyre ? <CollapseIcon /> : <ExpandIcon />}
                </CollapseToggle>
              )}
            </NavTitle>
            <SubNavigationBodyList show={showWyre}>
              <SubNavigationElement>
                <StyledNavLink id={'buy'} to={'/buy'} isActive={() => active === 'buy'}>
                  <NavLabel>{t('buyCurrency', { currency: 'Ethereum' })}</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink id={'buy-link'} to={'/buy?currency=LINK'} isActive={() => active === 'buy-link'}>
                  <NavLabel>{t('buyCurrency', { currency: LINK.name })}</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
            </SubNavigationBodyList>
          </NavigationElement>
          <NavigationElement>
            <NavTitle>
              <NavTitleLink
                onClick={() => {
                  setShowYflusd(!showYflusd)
                }}
              >
                <NavigationIconWrapper>
                  <YFLSVG />
                </NavigationIconWrapper>
                YFLUSD
              </NavTitleLink>
              <CollapseToggle
                onClick={() => {
                  setShowYflusd(!showYflusd)
                }}
              >
                {showYflusd ? <CollapseIcon /> : <ExpandIcon />}
              </CollapseToggle>
            </NavTitle>
            <SubNavigationBodyList show={showYflusd}>
              <SubNavigationElement>
                <ExternalNavLink href="https://yflusd.linkswap.app">
                  <NavLabel>Info</NavLabel>
                </ExternalNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <ExternalNavLink href="https://yflusd.linkswap.app/bonds">
                  <NavLabel>{t('bonds')}</NavLabel>
                </ExternalNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <ExternalNavLink href="https://yflusd.linkswap.app/boardroom">
                  <NavLabel>{t('boardroom')}</NavLabel>
                </ExternalNavLink>
              </SubNavigationElement>
            </SubNavigationBodyList>
          </NavigationElement>
          <NavigationElement>
            <NavTitle>
              <NavTitleLink
                onClick={() => {
                  setShowExternal(!showExternal)
                }}
              >
                <NavigationIconWrapper>
                  <ExternalLinkIcon />
                </NavigationIconWrapper>
                {t('external')}
              </NavTitleLink>
              <CollapseToggle
                onClick={() => {
                  setShowExternal(!showExternal)
                }}
              >
                {showExternal ? <CollapseIcon /> : <ExpandIcon />}
              </CollapseToggle>
            </NavTitle>
            <SubNavigationBodyList show={showExternal}>
              <SubNavigationElement>
                <ExternalNavLink href="https://app.gitbook.com/@yflink/s/yflink/">
                  <NavLabel>{t('projectDocumentation')}</NavLabel>
                </ExternalNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <ExternalNavLink href="https://yflink.io/#/vote">
                  <NavLabel>{t('stakeGovernanceVoting')}</NavLabel>
                </ExternalNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <ExternalNavLink href="https://info.linkswap.app">
                  <NavLabel>{t('charts')}</NavLabel>
                </ExternalNavLink>
              </SubNavigationElement>
            </SubNavigationBodyList>
          </NavigationElement>
          <NavigationElement>
            <NavTitle>
              <NavTitleLink
                onClick={() => {
                  setShowThemes(!showThemes)
                }}
              >
                <NavigationIconWrapper>
                  <ThemeSVG />
                </NavigationIconWrapper>
                {t('themes')}
              </NavTitleLink>
              <CollapseToggle
                onClick={() => {
                  setShowThemes(!showThemes)
                }}
              >
                {showThemes ? <CollapseIcon /> : <ExpandIcon />}
              </CollapseToggle>
            </NavTitle>
            <SubNavigationBody show={showThemes}>
              <Theme />
            </SubNavigationBody>
          </NavigationElement>
          <NavigationElement>
            <NavTitle>
              <NavTitleLink
                onClick={() => {
                  setShowLanguages(!showLanguages)
                }}
              >
                <NavigationIconWrapper>
                  <LanguageIcon />
                </NavigationIconWrapper>
                {t('languages')}
              </NavTitleLink>
              <CollapseToggle
                onClick={() => {
                  setShowLanguages(!showLanguages)
                }}
              >
                {showLanguages ? <CollapseIcon /> : <ExpandIcon />}
              </CollapseToggle>
            </NavTitle>
            <SubNavigationBody show={showLanguages}>
              <Language />
            </SubNavigationBody>
          </NavigationElement>
        </NavigationBody>
      </NavigationWrapper>
    </>
  )
}
