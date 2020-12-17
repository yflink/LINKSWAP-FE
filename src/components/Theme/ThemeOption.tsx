import React from 'react'
import styled from 'styled-components'
import i18next from 'i18next'
import {useThemeManager} from "../../state/user/hooks";

export const ThemeOptionBody = styled.div`
  padding: 0.5rem 1rem;
  text-align: start;
  font-size: 14px;

  :hover,
  :focus {
    cursor: pointer;
    background-color: ${({ theme }) => theme.modalSecondaryBG};
  }
`

const ThemeOption = styled.div`
  flex: 0 0 100%;
  flex-wrap: wrap;
  display: flex;
`

const ThemeShortCode = styled.span`
  text-transform: uppercase;
`

export default function ThemeOptionHelper(props: {
  themeString: string
  themeName: string
  fullWidth?: boolean
}) {
  const newTheme = useThemeManager()
  const width = props.fullWidth ? '100%' : '8.5rem'

  return (
    <ThemeOptionBody style={{ width: width }}>
      <ThemeOption onClick={() => newTheme(props.themeString)}>
        {props.themeName}
      </ThemeOption>
    </ThemeOptionBody>
  )
}
