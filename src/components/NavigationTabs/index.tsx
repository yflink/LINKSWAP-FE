import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { NavLink, Link as HistoryLink } from 'react-router-dom'

import { ArrowLeft, DivideCircle } from 'react-feather'
import { RowBetween } from '../Row'
import QuestionHelper from '../QuestionHelper'

import swap from '../../assets/svg/swap.png'
import pool from '../../assets/svg/pool.png'
import create from '../../assets/svg/create.png'
import analyze from '../../assets/svg/soon.png'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 6px;
  justify-content: space-evenly;
  margin-left: 16px;
  margin-right: 16px;
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
  color: ${({ theme }) => theme.text3};
  font-size: 20px;
  padding: 30px;
  &.${activeClassName} {
    background-color: #135ce3;
    color: ${({ theme }) => theme.text1};
  }
  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const StyledNavLinkDisabled = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 25%;
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 6px;
  outline: none;
  text-decoration: none;
  font-size: 20px;
  padding: 32px;
`

const Icon = styled.img`
  margin: 16px;
  height: 28px;
`

const IconDisabled = styled.img`
  margin: 16px;
  height: 28px;
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
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
      <StyledNavLinkDisabled id={`pool-nav-link`}>
        <IconDisabled src={analyze} />
      </StyledNavLinkDisabled>
    </Tabs>
  )
}

export function FindPoolTabs() {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to="/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>Import Pool</ActiveText>
        <QuestionHelper text={"Use this tool to find pairs that don't automatically appear in the interface."} />
      </RowBetween>
    </Tabs>
  )
}

export function AddRemoveTabs({ adding }: { adding: boolean }) {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to="/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>{adding ? 'Add' : 'Remove'} Liquidity</ActiveText>
        <QuestionHelper
          text={
            adding
              ? 'When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.'
              : 'Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.'
          }
        />
      </RowBetween>
    </Tabs>
  )
}

export function CreateTabs() {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <div style={{ width: 32 }}></div>
        {/* <HistoryLink to="/create">
          <StyledArrowLeft />
        </HistoryLink> */}
        <ActiveText>Create Pair</ActiveText>
        <QuestionHelper text="When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time." />
      </RowBetween>
    </Tabs>
  )
}

export function PreviewListingTabs() {
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem' }}>
        <HistoryLink to="/newpool">
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>Preview Listing</ActiveText>
        <div />
      </RowBetween>
    </Tabs>
  )
}
