import React from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../Column'
import i18next from 'i18next'
import LanguageOption from './LanguageOption'

const StyledMenu = styled.div`
  padding: 0 36px;
  display: flex;
  position: relative;
  text-align: start;

  > * {
    width: 100%;
  }
`
export default function LanguageTab() {
  const currentLanguage = i18next.language || 'en'
  const lang = currentLanguage.substring(0, 2)
  document.body.dir = i18next.dir(lang!)

  return (
    <StyledMenu>
      <AutoColumn gap="8px">
        <LanguageOption shortCode="ar" languageString="عربي" />
        <LanguageOption shortCode="cn" languageString="中文" />
        <LanguageOption shortCode="de" languageString="Deutsch" />
        <LanguageOption shortCode="en" languageString="English" />
        <LanguageOption shortCode="es" languageString="Español" />
        <LanguageOption shortCode="fa" languageString="فارسی" />
        <LanguageOption shortCode="fr" languageString="Français" />
        <LanguageOption shortCode="it" languageString="Italiano" />
        <LanguageOption shortCode="jp" languageString="日本語" />
        <LanguageOption shortCode="kr" languageString="한국어" />
        <LanguageOption shortCode="nl" languageString="Nederlands" />
        <LanguageOption shortCode="ro" languageString="Română" />
        <LanguageOption shortCode="pt" languageString="Português" />
        <LanguageOption shortCode="ru" languageString="Pусский" />
        <LanguageOption shortCode="se" languageString="Svenska" />
        <LanguageOption shortCode="tr" languageString="Türkçe" />
        <LanguageOption shortCode="vn" languageString="Tiếng Việt" />
      </AutoColumn>
    </StyledMenu>
  )
}
