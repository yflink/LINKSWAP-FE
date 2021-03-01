import React from 'react'
import styled from 'styled-components'
import i18next from 'i18next'
import ReactGA from 'react-ga'

export const LanguageOptionBody = styled.div<{ active?: boolean }>`
  width: 100%;
  text-align: start;
  display: block;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};

  :hover,
  :focus {
    cursor: ${({ active }) => (active ? 'default' : 'pointer')};
    text-decoration: ${({ active }) => (active ? 'none' : 'underline')};
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

function setLang(lang?: string | 'en') {
  i18next.changeLanguage(lang!, () => {
    ReactGA.event({
      category: 'Language',
      action: 'Change language',
      label: lang
    })
  })
  document.body.dir = i18next.dir(lang!)
}

export default function LanguageOptionHelper(props: { languageString: string; shortCode: string }) {
  const currentLanguage = i18next.language || 'en'
  const lang = currentLanguage.substring(0, 2)
  const active = lang === props.shortCode

  return (
    <LanguageOptionBody active={active} onClick={() => setLang(props.shortCode)}>
      <LanguageOption>
        <LanguageShortCode>{props.shortCode}</LanguageShortCode>&nbsp;-&nbsp;{props.languageString}
      </LanguageOption>
    </LanguageOptionBody>
  )
}
