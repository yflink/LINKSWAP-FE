import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { AutoColumn } from '../Column'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'
import GasIcon from './GasIcon'
import { useGetGasPrices } from '../../state/gas/hooks'
import { RowBetween } from '../Row'

const StyledMenuIcon = styled.div`
  height: 14px;
  width: 14px;
  > * {
    fill: ${({ theme }) => theme.headerButtonIconColor};
  }
`

const StyledMenuButton = styled.button`
  position: relative;
  width: auto;
  border: none;
  margin: 0.5rem 0 0 0;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.25rem 0.5rem;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.headerButtonBG};

  :hover,
  :focus {
    background-color: ${({ theme }) => theme.headerButtonBGHover};
    cursor: pointer;
    outline: none;
  }
`

const StyledMenu = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  border: none;
  text-align: start;
  flex: 0 0 100%;
  width: 100%;
`

const GasPrice = styled.div`
  margin-inline-start: 0.5rem;
  color: ${({ theme }) => theme.headerButtonIconColor};
`

const MenuFlyout = styled.span`
  max-width: 100vw;
  width: 11rem;
  background-color: ${({ theme }) => theme.modalBG};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border: 1px solid ${({ theme }) => theme.modalBorder};
  color: ${({ theme }) => theme.headerModalTextColor};
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 2.5rem;
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
        <GasPrice>{t('gasPrice', { price: gasObject.averageGas })}</GasPrice>
      </StyledMenuButton>
      {isOpen && (
        <MenuFlyout>
          <AutoColumn style={{ padding: '1rem 0 0.5rem' }}>
            <Text fontWeight={600} fontSize={14} style={{ padding: '0 1rem 0.5rem' }}>
              {t('gasPrices')}
            </Text>
            <Text fontSize={14} style={{ padding: '0.5rem 1rem' }}>
              <RowBetween>
                {t('safe')} <div>{t('gasPrice', { price: gasObject.lowGas })}</div>
              </RowBetween>
            </Text>
            <Text fontSize={14} style={{ padding: '0.5rem 1rem' }}>
              <RowBetween>
                {t('standard')} <div>{t('gasPrice', { price: gasObject.averageGas })}</div>
              </RowBetween>
            </Text>
            <Text fontSize={14} style={{ padding: '0.5rem 1rem' }}>
              <RowBetween>
                {t('fast')} <div>{t('gasPrice', { price: gasObject.highGas })}</div>
              </RowBetween>
            </Text>
          </AutoColumn>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
