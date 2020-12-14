import React from 'react'
import styled from 'styled-components'
import i18next from 'i18next'

export const LanguageOptionBody = styled.div`
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

const LanguageShortCode = styled.span`
  text-transform: uppercase;
`

function setLang(lang?: string) {
  i18next.changeLanguage(lang!, () => {
    console.log('changed language to', lang)
  })
  document.body.dir = i18next.dir(lang!)
}

export default function LanguageOptionHelper(props: { languageString: string; shortCode: string }) {
  const currentLanguage = i18next.language || 'en'
  const lang = currentLanguage.substring(0, 2)

  return (
    <LanguageOptionBody
      style={lang === props.shortCode ? { fontWeight: 'bold' } : {}}
      onClick={() => setLang(props.shortCode)}
    >
      <LanguageShortCode>{props.shortCode}</LanguageShortCode> - {props.languageString}
    </LanguageOptionBody>
  )
}
