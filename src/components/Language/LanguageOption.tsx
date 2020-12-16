import React from 'react'
import styled from 'styled-components'
import i18next from 'i18next'

export const LanguageOptionBody = styled.div`
  padding: 0.5rem 1rem;
  width: 9.5rem;
  text-align: start;
  -webkit-column-break-inside: avoid;
  page-break-inside: avoid;
  break-inside: avoid-column;
  display: inline-grid;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 8.5rem;
    font-size: 14px;
  `};

  :hover,
  :focus {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg2};
  }
`

const LanguageOption = styled.div`
  flex: 0 0 100%;
  flex-wrap: wrap;
  display: flex;
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
      <LanguageOption>
        <LanguageShortCode>{props.shortCode}</LanguageShortCode>&nbsp;-&nbsp;{props.languageString}
      </LanguageOption>
    </LanguageOptionBody>
  )
}
