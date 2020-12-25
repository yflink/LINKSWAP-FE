import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { AutoColumn } from '../Column'
import { Text } from 'rebass'
import { Separator } from '../SearchModal/styleds'
import { useTranslation } from 'react-i18next'
import ThemeOption from './ThemeOption'
import { useGetTheme } from '../../state/user/hooks'

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

  svg {
    margin-top: 2px;
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
const ThemeContainer = styled.div`
  padding: 0.5rem 0;
  width: 100%;
  break-inside: avoid-column;
  page-break-inside: avoid;
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

export default function ThemeTab() {
  const node = useRef<HTMLDivElement>()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<any | null>(false)
  const currentTheme = useGetTheme()
  const layoutLogo = './images/themes/' + currentTheme + '/logo.png'
  useOnClickOutside(node, isOpen ? () => setIsOpen(!isOpen) : undefined)

  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={() => setIsOpen(!isOpen)} id="open-themeStringg-button">
        <img src={layoutLogo} width="22px" height="22px" alt={t('inferfaceTheme')} />
      </StyledMenuButton>
      {isOpen && (
        <MenuFlyout>
          <AutoColumn style={{ padding: '1rem 0 0.5rem' }}>
            <Text fontWeight={600} fontSize={14} style={{ padding: '0 1rem 0.5rem' }}>
              {t('interfaceTheme')}
            </Text>
            <ThemeOption themeName="LINKSWAP" themeString="default" />
            <ThemeOption themeName="LINKSWAP light" themeString="light" />
          </AutoColumn>
          <Separator />
          <ThemeContainer>
            <ThemeOption themeName="CyberFi" themeString="cyberfi" />
            <ThemeOption themeName="DOKI DOKI" themeString="dokidoki" />
            <ThemeOption themeName="DRC" themeString="drc" />
            <ThemeOption themeName="MASQ" themeString="masq" />
          </ThemeContainer>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
