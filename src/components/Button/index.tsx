import React from 'react'
import styled from 'styled-components'
import { darken, lighten } from 'polished'

import { RowBetween } from '../Row'
import { ChevronDown } from 'react-feather'
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'

const Base = styled(RebassButton)<{
  padding?: string
  width?: string
  borderRadius?: string
  altDisabledStyle?: boolean
}>`
  padding: ${({ padding }) => (padding ? padding : '18px')};
  width: ${({ width }) => (width ? width : '100%')};
  font-weight: 500;
  text-align: center;
  border-radius: 6px;
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
  outline: none;
  border: 1px solid transparent;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  &:disabled {
    cursor: auto;
  }

  > * {
    user-select: none;
  }
`

export const ButtonPrimary = styled(Base)`
  background-color: ${({ theme }) => theme.buttonBG};
  color: white;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.buttonBGHover};
    background-color: ${({ theme }) => theme.buttonBGHover};
  }
  &:hover {
    background-color: ${({ theme }) => theme.buttonBGHover};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.buttonBGHover};
    background-color: ${({ theme }) => theme.buttonBGHover};
  }
  &:disabled {
    background-color: ${({ theme, altDisabledStyle }) => (altDisabledStyle ? theme.buttonBG : theme.buttonBGDisabled)};
    color: ${({ theme, altDisabledStyle }) =>
      altDisabledStyle ? theme.buttonTextColor : theme.buttonTextColorDisabled};
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.7' : '1')};
  }
`

export const ButtonLight = styled(Base)`
  background-color: ${({ theme }) => theme.buttonSecondaryBG};
  color: ${({ theme }) => theme.buttonSecondaryTextColor};
  font-size: 16px;
  font-weight: 500;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.03, theme.buttonSecondaryBG)};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.03, theme.buttonSecondaryBG)};
  }
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.03, theme.buttonSecondaryBG)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.05, theme.buttonSecondaryBG)};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.buttonSecondaryBG)};
  }
  :disabled {
    opacity: 0.4;
    :hover {
      cursor: auto;
      background-color: ${({ theme }) => theme.buttonSecondaryBG};
      box-shadow: none;
      border: 1px solid transparent;
      outline: none;
    }
  }
`

export const ButtonGray = styled(Base)`
  background-color: ${({ theme }) => theme.buttonNavigationBG};
  color: ${({ theme }) => theme.buttonNavigationTextColor};
  font-size: 16px;
  font-weight: 500;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.05, theme.buttonNavigationBGHover)};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.buttonNavigationBGHover)};
  }
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.buttonNavigationBGHover)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.1, theme.buttonNavigationBG)};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.1, theme.buttonNavigationBG)};
  }
`

export const ButtonSecondary = styled(Base)`
  background-color: ${({ theme }) => theme.buttonSecondaryBG};
  color: ${({ theme }) => theme.buttonSecondaryTextColor};
  font-size: 16px;
  border-radius: 6px;
  padding: ${({ padding }) => (padding ? padding : '10px')};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.buttonSecondaryBorderHover};
    background-color: ${({ theme }) => theme.buttonSecondaryBGHover};
    color: ${({ theme }) => theme.buttonSecondaryTextColorHover};
  }
  &:hover {
    background-color: ${({ theme }) => theme.buttonSecondaryBGHover};
    color: ${({ theme }) => theme.buttonSecondaryTextColorHover};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.buttonSecondaryBorderActive};
    background-color: ${({ theme }) => theme.buttonSecondaryBGActive};
    color: ${({ theme }) => theme.buttonSecondaryTextColorActive};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.buttonBGDisabled};
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonPink = styled(Base)`
  background-color: ${({ theme }) => theme.buttonBG};
  color: white;

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.buttonBGHover};
    background-color: ${({ theme }) => theme.buttonBGHover};
  }
  &:hover {
    background-color: ${({ theme }) => theme.buttonBGHover};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.buttonBGActive};
    background-color: ${({ theme }) => theme.buttonBGActive};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.buttonBG};
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonOutlined = styled(Base)`
  border: 1px solid ${({ theme }) => theme.buttonOutlinedBorder};
  background-color: transparent;
  color: ${({ theme }) => theme.buttonOutlinedTextColor};

  &:focus,
  &:hover,
  &:active {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.buttonOutlinedBorderHover};
    color: ${({ theme }) => theme.buttonOutlinedTextColorHover};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonEmpty = styled(Base)`
  background-color: transparent;
  color: ${({ theme }) => theme.buttonBG};
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus,
  &:hover,
  &:active {
    background-color: ${({ theme }) => theme.modalFooterBG};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonWhite = styled(Base)`
  border: 1px solid #edeef2;
  background-color: ${({ theme }) => theme.modalBG};
  color: black;

  &:focus {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    box-shadow: 0 0 0 1pt ${darken(0.05, '#edeef2')};
  }
  &:hover {
    box-shadow: 0 0 0 1pt ${darken(0.1, '#edeef2')};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${darken(0.1, '#edeef2')};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

const ButtonConfirmedStyle = styled(Base)`
  background-color: ${({ theme }) => lighten(0.5, theme.green1)};
  color: ${({ theme }) => theme.green1};
  border: 1px solid ${({ theme }) => theme.green1};

  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

const ButtonErrorStyle = styled(Base)`
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.red1)};
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.red1)};
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    box-shadow: none;
    background-color: ${({ theme }) => theme.red1};
    border: 1px solid ${({ theme }) => theme.red1};
  }
`

export function ButtonConfirmed({
  confirmed,
  altDisabledStyle,
  ...rest
}: { confirmed?: boolean; altDisabledStyle?: boolean } & ButtonProps) {
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle} />
  }
}

export function ButtonError({ error, ...rest }: { error?: boolean } & ButtonProps) {
  if (error) {
    return <ButtonErrorStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}

export function ButtonDropdown({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonPrimary {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonPrimary>
  )
}

export function ButtonDropdownLight({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonOutlined {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonOutlined>
  )
}

export function ButtonRadio({ active, ...rest }: { active?: boolean } & ButtonProps) {
  if (!active) {
    return <ButtonWhite {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}
