import React from 'react'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import { Box } from 'rebass/styled-components'

const Card = styled(Box)<{ padding?: string; border?: string; borderRadius?: string; secondary?: boolean }>`
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  background: ${({ secondary, theme }) => (secondary ? theme.appBoxSecondaryInnerBG : 'transparent')};
`
export default Card

export const NavigationCard = styled(Card)`
  max-width: 420px;
  padding: 12px;
  background: ${({ theme }) => theme.navigationBG};
  margin-bottom: 16px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
`

export const LightCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.appBoxBG};
  background: ${({ theme }) => theme.appBoxBG};
`

export const GreyCard = styled(Card)`
  background: ${({ theme }) => theme.appBoxSecondaryBG};
`

export const OutlineCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.buttonBG};
`

export const YellowCard = styled(Card)`
  background: rgba(243, 132, 30, 0.05);
  color: ${({ theme }) => theme.yellow2};
  font-weight: 500;
`

export const PinkCard = styled(Card)`
  background: rgba(255, 0, 122, 0.03);
  color: ${({ theme }) => theme.textHighlight};
  font-weight: 500;
`

const BlueCardStyled = styled(Card)`
  background: ${({ theme }) => theme.appInfoBoxBG};
  color: ${({ theme }) => theme.appInfoBoxTextColor};
  border-radius: ${({ theme }) => theme.borderRadius};
  width: 100%;
`

export const BlueCard = ({ children, ...rest }: CardProps) => {
  return (
    <BlueCardStyled {...rest}>
      <Text fontWeight={500}>{children}</Text>
    </BlueCardStyled>
  )
}
