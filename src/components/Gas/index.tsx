import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { AutoColumn } from '../Column'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'
import GasIcon from './GasIcon'
import { useGetGasPrices } from '../../state/gas/hooks'

const StyledMenuIcon = styled.div`
  height: 22px;
  width: 22px;
  > * {
    fill: ${({ theme }) => theme.headerButtonIconColor};
  }
`

const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.headerButtonBG};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.headerButtonBGHover};
  }
`

const StyledMenu = styled.div`
  margin-inline-start: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: start;
`

const MenuFlyout = styled.span`
  max-width: 100vw;
  width: 12rem;
  background-color: ${({ theme }) => theme.modalBG};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border: 1px solid ${({ theme }) => theme.modalBorder};
  color: ${({ theme }) => theme.headerModalTextColor};
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 3rem;
  right: 0;
  z-index: 100;

  [dir='rtl'] & {
    right: unset;
    left: 0;
  }
`

export default function GasTab() {
  const node = useRef<HTMLDivElement>()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<any | null>(false)
  useOnClickOutside(node, isOpen ? () => setIsOpen(!isOpen) : undefined)
  const gasObject = useGetGasPrices()
  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={() => setIsOpen(!isOpen)} id="open-gas-dialog-button">
        <StyledMenuIcon>
          <GasIcon />
        </StyledMenuIcon>
      </StyledMenuButton>
      {isOpen && (
        <MenuFlyout>
          <AutoColumn style={{ padding: '1rem 0 0.5rem' }}>
            <Text fontWeight={600} fontSize={14} style={{ padding: '0 1rem 0.5rem' }}>
              {t('gasPrices')}
            </Text>
            <Text fontSize={14} style={{ padding: '0.5rem 1rem' }}>
              {t('low', { price: gasObject.lowGas })}
            </Text>
            <Text fontSize={14} style={{ padding: '0.5rem 1rem' }}>
              {t('average', { price: gasObject.averageGas })}
            </Text>
            <Text fontSize={14} style={{ padding: '0.5rem 1rem' }}>
              {t('high', { price: gasObject.highGas })}
            </Text>
          </AutoColumn>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
