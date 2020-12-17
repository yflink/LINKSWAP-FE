import React, { useRef, useState } from 'react'
import { Feather } from 'react-feather'
import styled from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { AutoColumn } from '../Column'
import { Text } from 'rebass'
import { Separator } from '../SearchModal/styleds'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import ThemeOption from './ThemeOption'

interface LayerState {
  isOpen: boolean
}

const StyledMenuIcon = styled(Feather)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.headerButtonIconColor};
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

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.lineColor};
  }

  svg {
    margin-top: 2px;
  }
`

const ThemeWrapper = styled.div`
  display: block;
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
  background-color: ${({ theme }) => theme.modalBG};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border: 1px solid ${({ theme }) => theme.headerButtonBG};
  color: ${({ theme }) => theme.headerModalTextColor};
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  right: 0;
  z-index: 100;

  [dir='rtl'] & {
    right: unset;
    left: 0;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-width: 10rem;
  `};
`

export default function ThemeTab() {
  const node = useRef<HTMLDivElement>()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<any | null>(false)
  useOnClickOutside(node, isOpen ? () => setIsOpen(!isOpen) : undefined)

  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={() => setIsOpen(!isOpen)} id="open-themeStringg-button">
        <StyledMenuIcon />
      </StyledMenuButton>
      {isOpen && (
        <MenuFlyout>
          <AutoColumn style={{ padding: '1rem 0 0.5rem' }}>
            <Text fontWeight={600} fontSize={14} style={{ padding: '0 1rem 0.5rem' }}>
              {t('interfaceTheme')}
            </Text>
              <ThemeOption fullWidth={true} themeName="LINKSWAP" themeString="default" />
          </AutoColumn>
          <Separator />
          <ThemeContainer>
              <ThemeOption themeName="Cyber Finance" themeString="cyberfi" />
          </ThemeContainer>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
