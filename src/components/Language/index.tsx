import React, { useRef, useState } from 'react'
import { Globe } from 'react-feather'
import styled from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { AutoColumn } from '../Column'
import { useLanguageMenuOpen, useToggleLanguageMenu } from '../../state/application/hooks'
import { Text } from 'rebass'
import { Separator } from '../SearchModal/styleds'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'

const StyledMenuIcon = styled(Globe)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
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

const LanguageOption = styled.div`
  padding: 0.5rem 1rem;
  width: 100%;
  text-align: start;
  display: flex;

  :hover,
  :focus {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg2};
  }
`

const MenuFlyout = styled.span`
  min-width: 12rem;
  background-color: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);

  border: 1px solid ${({ theme }) => theme.bg3};

  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  right: 0rem;
  z-index: 100;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-width: 10rem;
  `};
`

function setLang(lang?: string) {
  i18next.changeLanguage(lang!, () => {
    console.log('changed language to', lang)
  })
  document.body.dir = i18next.dir(lang!)
}

export default function LanguageTab() {
  const node = useRef<HTMLDivElement>()
  const toggle = useToggleLanguageMenu()
  const open = useLanguageMenuOpen()
  const currentLanguage = i18next.language || 'en'
  const lang = currentLanguage.substring(0, 2)
  const { t } = useTranslation()

  document.body.dir = i18next.dir(lang!)
  useOnClickOutside(node, open ? toggle : undefined)

  return (
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle} id="open-language-dialog-button">
        <StyledMenuIcon />
      </StyledMenuButton>
      {open && (
        <MenuFlyout>
          <AutoColumn style={{ padding: '1rem 0 0.5rem' }}>
            <Text fontWeight={600} fontSize={14} style={{ padding: '0 1rem 0.5rem' }}>
              {t('interfaceLanguage')}
            </Text>
            <LanguageOption style={lang === 'en' ? { fontWeight: 'bold' } : {}} onClick={() => setLang('en')}>
              EN - English
            </LanguageOption>
          </AutoColumn>
          <Separator />
          <AutoColumn style={{ padding: '0.5rem 0' }}>
            <LanguageOption style={lang === 'ar' ? { fontWeight: 'bold' } : {}} onClick={() => setLang('ar')}>
              AR - عربى
            </LanguageOption>
            <LanguageOption style={lang === 'cn' ? { fontWeight: 'bold' } : {}} onClick={() => setLang('cn')}>
              CN - 中文
            </LanguageOption>
            <LanguageOption style={lang === 'de' ? { fontWeight: 'bold' } : {}} onClick={() => setLang('de')}>
              DE - Deutsch
            </LanguageOption>
            <LanguageOption style={lang === 'es' ? { fontWeight: 'bold' } : {}} onClick={() => setLang('es')}>
              ES - Español
            </LanguageOption>
            <LanguageOption style={lang === 'kor' ? { fontWeight: 'bold' } : {}} onClick={() => setLang('kor')}>
              KOR - 한국어
            </LanguageOption>
            <LanguageOption style={lang === 'ro' ? { fontWeight: 'bold' } : {}} onClick={() => setLang('ro')}>
              RO - Română
            </LanguageOption>
            <LanguageOption style={lang === 'ru' ? { fontWeight: 'bold' } : {}} onClick={() => setLang('ru')}>
              RU - русский
            </LanguageOption>
          </AutoColumn>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
