import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { AutoColumn } from '../Column'
import ThemeOption from './ThemeOption'

const StyledMenu = styled.div`
  display: flex;
  flex: 0 0 100%;
  padding: 0 26px;
  position: relative;
  border: none;
  text-align: start;

  > * {
    width: 100%;
  }
`

export default function ThemeTab() {
  const node = useRef<HTMLDivElement>()
  const [isOpen, setIsOpen] = useState<any | null>(false)
  useOnClickOutside(node, isOpen ? () => setIsOpen(!isOpen) : undefined)

  return (
    <StyledMenu>
      <AutoColumn gap="8px">
        <ThemeOption themeName="LINKSWAP" themeString="default" />
        <ThemeOption themeName="LINKSWAP light" themeString="light" />
        <ThemeOption themeName="88mph" themeString="88mph" />
        <ThemeOption themeName="CyberFi" themeString="cyberfi" />
        <ThemeOption themeName="DOGE" themeString="doge" />
        <ThemeOption themeName="DOKI DOKI" themeString="dokidoki" />
        <ThemeOption themeName="MASQ" themeString="masq" />
        <ThemeOption themeName="ren" themeString="ren" />
      </AutoColumn>
    </StyledMenu>
  )
}
