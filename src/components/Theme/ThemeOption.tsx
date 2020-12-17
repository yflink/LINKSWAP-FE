import React from 'react'
import styled from 'styled-components'
import { useThemeManager } from '../../state/user/hooks'

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

export default function ThemeOptionHelper(props: { themeString: string; themeName: string; fullWidth?: boolean }) {
  const newTheme = useThemeManager()
  const width = props.fullWidth ? '100%' : '10rem'
  const logoUrl = './images/themes/' + props.themeString + '/logo.png'

  return (
    <ThemeOptionBody style={{ width: width }}>
      <ThemeOption onClick={() => newTheme(props.themeString)}>
        <img src={logoUrl} alt={props.themeName} width="20px" height="20px" style={{ margin: '0 0.5rem 0 0' }} />
        &nbsp;{props.themeName}
      </ThemeOption>
    </ThemeOptionBody>
  )
}
