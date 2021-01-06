import React from 'react'
import styled from 'styled-components'
import { NavLink, Link as HistoryLink } from 'react-router-dom'

import { ArrowLeft } from 'react-feather'
import { RowBetween } from '../Row'
import QuestionHelper from '../QuestionHelper'

import swap from '../../assets/svg/swap.svg'
import pool from '../../assets/svg/pool.svg'
import create from '../../assets/svg/create.svg'
import analyze from '../../assets/svg/analyze.svg'
import { useTranslation } from 'react-i18next'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 6px;
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
  border-radius: 6px;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.navigationTabIconColor};
  background-color: ${({ theme }) => theme.navigationTabBG};
  font-size: 20px;
  padding: 30px;
  &.${activeClassName} {
    background-color: ${({ theme }) => theme.navigationTabBGActive};
    color: ${({ theme }) => theme.navigationTabIconColorActive};
    :hover,
    :focus {
      background-color: ${({ theme }) => theme.navigationTabBGActive};
      color: ${({ theme }) => theme.navigationTabIconColorActive};
    }
  }
  :hover,
  :focus {
    color: ${({ theme }) => theme.navigationTabIconColorHover};
    background-color: ${({ theme }) => theme.navigationTabBGHover};
  }
`

const Icon = styled.img`
  margin: 16px;
  height: 28px;
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.textPrimary};
`

export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' | 'create' | 'analyze' }) {
  return (
    <Tabs>
      <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'}>
        <Icon src={swap} />
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
        <Icon src={pool} />
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/create'} isActive={() => active === 'create'}>
        <Icon src={create} />
      </StyledNavLink>
      <StyledLink id={`pool-nav-link`} href={'https://info.linkswap.app/home'} target="_blank">
        <IconDisabled src={analyze} />
      </StyledLink>
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
        {/* <HistoryLink to="/create">
          <StyledArrowLeft />
        </HistoryLink> */}
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
