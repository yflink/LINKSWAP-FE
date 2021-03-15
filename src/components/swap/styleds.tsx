import { transparentize } from 'polished'
import React from 'react'
import { AlertTriangle, Check, Copy } from 'react-feather'
import styled, { css } from 'styled-components'
import { Text } from 'rebass'
import { AutoColumn } from '../Column'

export const Wrapper = styled.div`
  position: relative;
`

export const ArrowWrapper = styled.div<{ clickable: boolean }>`
  padding: 2px;

  ${({ clickable }) =>
    clickable
      ? css`
          :hover {
            cursor: pointer;
            opacity: 0.8;
          }
        `
      : null}
`

export const SectionBreak = styled.div`
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.textSecondary};
`

export const BottomGrouping = styled.div`
  margin-top: 1rem;
`

export const ErrorText = styled(Text)<{ severity?: 0 | 1 | 2 | 3 | 4 }>`
  color: ${({ theme, severity }) =>
    severity === 3 || severity === 4
      ? theme.red1
      : severity === 2
      ? theme.yellow2
      : severity === 1
      ? theme.textPrimary
      : theme.green1};
`

export const StyledBalanceMaxMini = styled.button`
  height: 22px;
  width: 22px;
  background: ${({ theme }) => theme.modalSecondaryBG};
  border: none;
  border-radius: 50%;
  padding: 0.2rem;
  font-size: 0.875rem;
  font-weight: 400;
  margin-inline-start: 0.4rem;
  cursor: pointer;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  justify-content: center;
  align-items: center;
  float: right;

  :hover {
    background: ${({ theme }) => theme.buttonBG};
  }
  :focus {
    background: ${({ theme }) => theme.buttonBG};
    outline: none;
  }
`

export const TruncatedText = styled(Text)`
  text-overflow: ellipsis;
  width: 220px;
  overflow: hidden;
`

// styles
export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: start;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`

const SwapCallbackErrorInner = styled.div`
  background: ${({ theme }) => transparentize(0.9, theme.red1)};
  border-radius: 1rem;
  display: flex;
  align-items: center;
  font-size: 0.825rem;
  width: 100%;
  padding: 3rem 1.25rem 1rem 1rem;
  margin-top: -2rem;
  color: ${({ theme }) => theme.red1};
  z-index: -1;
  p {
    padding: 0;
    margin: 0;
    font-weight: 500;
  }
`

const SwapCallbackErrorInnerAlertTriangle = styled.div`
  background: ${({ theme }) => transparentize(0.9, theme.red1)};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-inline-end: 12px;
  border-radius: ${({ theme }) => theme.borderRadius};
  min-width: 48px;
  height: 48px;
`

export function SwapCallbackError({ error }: { error: string }) {
  return (
    <SwapCallbackErrorInner>
      <SwapCallbackErrorInnerAlertTriangle>
        <AlertTriangle size={24} />
      </SwapCallbackErrorInnerAlertTriangle>
      <p>{error}</p>
    </SwapCallbackErrorInner>
  )
}

export const SwapShowAcceptChanges = styled(AutoColumn)`
  background: ${({ theme }) => transparentize(0.9, theme.textHighlight)};
  color: ${({ theme }) => theme.textHighlight};
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-top: 8px;
`

export const CopyToClipboard = styled.div`
  color: ${({ theme }) => theme.textHighlight};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

export const CopiedToClipboard = styled.div`
  color: ${({ theme }) => theme.textPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
`
export const CheckIcon = styled(Check)`
  height: 1rem;
  margin-inline-end: 0.25rem;
  display: inline-block;

  > * {
    stroke: ${({ theme }) => theme.textPrimary};
  }
`

export const CopyIcon = styled(Copy)`
  height: 1rem;
  margin-inline-end: 0.25rem;
  display: inline-block;
  > * {
    stroke: ${({ theme }) => theme.textHighlight};
  }
`
