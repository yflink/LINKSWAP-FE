import React from 'react'
import styled from 'styled-components'

export const BodyWrapper = styled.div`
  position: relative;
  padding: 1.5rem;
  width: 100%;
  max-width: 420px;
  background: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 6px;
`

export const BodyWrapperDark = styled.div`
  margin-top: -3px;
  padding: 1.5rem;
  padding-top: calc(1.5rem + 3px);
  position: relative;
  width: 100%;
  max-width: 420px;
  background: #19222a;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius 0px 0px 6px 6px;
`

export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}

export function AppBodyDark({ children }: { children: React.ReactNode }) {
  return <BodyWrapperDark>{children}</BodyWrapperDark>
}
