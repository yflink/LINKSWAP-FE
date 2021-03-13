import React from 'react'
import styled from 'styled-components'
import { NavLink, Link as HistoryLink } from 'react-router-dom'

import { ArrowLeft } from 'react-feather'
import { RowBetween } from '../Row'
import QuestionHelper from '../QuestionHelper'

import { SwapSVG, PoolSVG, StakeSVG, BuySVG } from '../SVG'
import { useTranslation } from 'react-i18next'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius};
  justify-content: space-evenly;
  margin-inline-start: 16px;
  margin-inline-end: 16px;
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 25%;
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  outline: none;
  cursor: pointer;
  text-decoration: none;
  * {
    fill: ${({ theme }) => theme.navigationTabIconColor};
  }
  background: ${({ theme }) => theme.navigationTabBG};
  font-size: 20px;
  padding: 30px;
  &.${activeClassName} {
    background: ${({ theme }) => theme.navigationTabBGActive};
    * {
      fill: ${({ theme }) => theme.navigationTabIconColorActive};
    }
    :hover,
    :focus {
      background: ${({ theme }) => theme.navigationTabBGActive};
      * {
        fill: ${({ theme }) => theme.navigationTabIconColorActive};
      }
    }
  }
  :hover,
  :focus {
    background: ${({ theme }) => theme.navigationTabBGHover};
    * {
      fill: ${({ theme }) => theme.navigationTabIconColorHover};
    }
  }
`

const Icon = styled.span`
  margin: 16px;
  > svg {
    height: 28px;
    width: auto;
  }
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.textPrimary};
`

export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' | 'stake' | 'create' | 'buy' | 'none' }) {
  return (
    <Tabs>
      <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'}>
        <Icon>
          <SwapSVG />
        </Icon>
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
        <Icon>
          <PoolSVG />
        </Icon>
      </StyledNavLink>
      <StyledNavLink id={`stake-nav-link`} to={'/stake'} isActive={() => active === 'stake'}>
        <Icon>
          <StakeSVG />
        </Icon>
      </StyledNavLink>
      <StyledNavLink id={`buy-nav-link`} to={'/buy'} isActive={() => active === 'buy'}>
        <Icon>
          <BuySVG />
        </Icon>
      </StyledNavLink>
    </Tabs>
  )
}

export function FindPoolTabs() {
  const { t } = useTranslation()

  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem 0' }}>
        <HistoryLink to="/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>{t('importPool')}</ActiveText>
        <QuestionHelper text={t('importingAPool')} />
      </RowBetween>
    </Tabs>
  )
}

export function AddRemoveTabs({ adding }: { adding: boolean }) {
  const { t } = useTranslation()

  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem 0' }}>
        <HistoryLink to="/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>{adding ? t('addLiquidity') : t('removeLiquidity')}</ActiveText>
        <QuestionHelper text={adding ? t('addingLiquidity') : t('removingLiquidity')} />
      </RowBetween>
    </Tabs>
  )
}

export function CreateTabs() {
  const { t } = useTranslation()

  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem 0' }}>
        <div style={{ width: 32 }}></div>
        <ActiveText>{t('createPair')}</ActiveText>
        <QuestionHelper text={t('creatingAPair')} />
      </RowBetween>
    </Tabs>
  )
}

export function PreviewListingTabs() {
  const { t } = useTranslation()

  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem 0' }}>
        <HistoryLink to="/newpool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>{t('previewListing')}</ActiveText>
        <div />
      </RowBetween>
    </Tabs>
  )
}
