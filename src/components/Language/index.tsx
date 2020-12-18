import React, { useRef, useState } from 'react'
import { Globe } from 'react-feather'
import styled from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { AutoColumn } from '../Column'
import { Text } from 'rebass'
import { Separator } from '../SearchModal/styleds'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import LanguageOption from './LanguageOption'

const StyledMenuIcon = styled(Globe)`
  height: 22px;
  width: 22px;

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
  display: flex;
  align-items: center;

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

const LanguageWrapper = styled.div`
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
const LanguageContainer = styled.div`
  padding: 0.5rem 0;
  width: 100%;
  column-count: 2;
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

export default function LanguageTab() {
  const node = useRef<HTMLDivElement>()
  const currentLanguage = i18next.language || 'en'
  const lang = currentLanguage.substring(0, 2)
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<any | null>(false)

  document.body.dir = i18next.dir(lang!)
  useOnClickOutside(node, isOpen ? () => setIsOpen(!isOpen) : undefined)

  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={() => setIsOpen(!isOpen)} id="open-language-dialog-button">
        <StyledMenuIcon />
      </StyledMenuButton>
      {isOpen && (
        <MenuFlyout>
          <AutoColumn style={{ padding: '1rem 0 0.5rem' }}>
            <Text fontWeight={600} fontSize={14} style={{ padding: '0 1rem 0.5rem' }}>
              {t('interfaceLanguage')}
            </Text>
            <LanguageWrapper onClick={() => setIsOpen(!isOpen)}>
              <LanguageOption fullWidth={true} shortCode="en" languageString="English" />
            </LanguageWrapper>
          </AutoColumn>
          <Separator />
          <LanguageContainer>
            <LanguageWrapper onClick={() => setIsOpen(!isOpen)}>
              <LanguageOption shortCode="ar" languageString="عربي" />
            </LanguageWrapper>
            <LanguageWrapper onClick={() => setIsOpen(!isOpen)}>
              <LanguageOption shortCode="cn" languageString="中文" />
            </LanguageWrapper>
            <LanguageWrapper onClick={() => setIsOpen(!isOpen)}>
              <LanguageOption shortCode="de" languageString="Deutsch" />
            </LanguageWrapper>
            <LanguageWrapper onClick={() => setIsOpen(!isOpen)}>
              <LanguageOption shortCode="es" languageString="Español" />
            </LanguageWrapper>
            <LanguageWrapper onClick={() => setIsOpen(!isOpen)}>
              <LanguageOption shortCode="fa" languageString="فارسی" />
            </LanguageWrapper>
            <LanguageWrapper onClick={() => setIsOpen(!isOpen)}>
              <LanguageOption shortCode="fr" languageString="Français" />
            </LanguageWrapper>
            <LanguageWrapper onClick={() => setIsOpen(!isOpen)}>
              <LanguageOption shortCode="it" languageString="Italiano" />
            </LanguageWrapper>
            <LanguageWrapper onClick={() => setIsOpen(!isOpen)}>
              <LanguageOption shortCode="kr" languageString="한국어" />
            </LanguageWrapper>
            <LanguageWrapper onClick={() => setIsOpen(!isOpen)}>
              <LanguageOption shortCode="nl" languageString="Nederlands" />
            </LanguageWrapper>
            <LanguageWrapper onClick={() => setIsOpen(!isOpen)}>
              <LanguageOption shortCode="ro" languageString="Română" />
            </LanguageWrapper>
            <LanguageWrapper onClick={() => setIsOpen(!isOpen)}>
              <LanguageOption shortCode="pt" languageString="Português" />
            </LanguageWrapper>
            <LanguageWrapper onClick={() => setIsOpen(!isOpen)}>
              <LanguageOption shortCode="ru" languageString="Pусский" />
            </LanguageWrapper>
            <LanguageWrapper onClick={() => setIsOpen(!isOpen)}>
              <LanguageOption shortCode="tr" languageString="Türkçe" />
            </LanguageWrapper>
            <LanguageWrapper onClick={() => setIsOpen(!isOpen)}>
              <LanguageOption shortCode="vn" languageString="Tiếng Việt" />
            </LanguageWrapper>
          </LanguageContainer>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
