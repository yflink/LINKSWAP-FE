import React from 'react'
import styled from 'styled-components'
import { useGetTheme, useThemeManager } from '../../state/user/hooks'
import ReactGA from 'react-ga'

export const ThemeOptionBody = styled.div<{ active?: boolean }>`
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

const ThemeOption = styled.div`
  flex: 0 0 100%;
  flex-wrap: wrap;
  display: flex;
  align-items: center;
`

export default function ThemeOptionHelper(props: { themeString: string; themeName: string; fullWidth?: boolean }) {
  const newTheme = useThemeManager()
  const logoUrl = './images/themes/' + props.themeString + '/logo.png'
  const currentTheme = useGetTheme()
  const isActive = props.themeString === currentTheme

  return (
    <ThemeOptionBody active={isActive}>
      <ThemeOption
        onClick={() => {
          ReactGA.event({
            category: 'Theme',
            action: 'Change Theme',
            label: props.themeString
          })
          newTheme(props.themeString)
        }}
      >
        <img src={logoUrl} alt={props.themeName} width="22px" height="22px" style={{ margin: '0 0.5rem 0 0' }} />
        &nbsp;{props.themeName}
      </ThemeOption>
    </ThemeOptionBody>
  )
}
