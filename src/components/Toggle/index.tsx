import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const ToggleElement = styled.span<{ isActive?: boolean; isOnSwitch?: boolean }>`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme, isActive, isOnSwitch }) =>
    isActive ? (isOnSwitch ? theme.modalInputBorder : theme.textDisabled) : 'none'};
  color: ${({ theme, isActive, isOnSwitch }) =>
    isActive ? (isOnSwitch ? theme.textPrimary : theme.textSecondary) : theme.textTertiary};
  font-size: 0.825rem;
  font-weight: 400;
`

const StyledToggle = styled.button<{ isActive?: boolean; activeElement?: boolean }>`
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme, isActive }) => (isActive ? theme.modalInputBorder : theme.textDisabled)};
  display: flex;
  width: fit-content;
  cursor: pointer;
  outline: none;
  padding: 0;
  background: transparent;
`

export interface ToggleProps {
  id?: string
  isActive: boolean
  toggle: () => void
}

export default function Toggle({ id, isActive, toggle }: ToggleProps) {
  const { t } = useTranslation()

  return (
    <StyledToggle id={id} isActive={isActive} onClick={toggle}>
      <ToggleElement isActive={isActive} isOnSwitch={true}>
        {t('on')}
      </ToggleElement>
      <ToggleElement isActive={!isActive} isOnSwitch={false}>
        {t('off')}
      </ToggleElement>
    </StyledToggle>
  )
}
