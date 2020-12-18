import React from 'react'
import styled from 'styled-components'
import { CardProps, Text } from 'rebass'
import { Box } from 'rebass/styled-components'

const Card = styled(Box)<{ padding?: string; border?: string; borderRadius?: string; secondary?: boolean }>`
  width: 100%;
  border-radius: 6px;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  background-color: ${({ secondary, theme }) => (secondary ? theme.appBoxSecondaryInnerBG : 'transparent')};
`
export default Card

export const LightCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.appBoxBG};
  background-color: ${({ theme }) => theme.appBoxBG};
`

export const GreyCard = styled(Card)`
  background-color: #3f4e5c;
`

export const OutlineCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.buttonBG};
`

export const YellowCard = styled(Card)`
  background-color: rgba(243, 132, 30, 0.05);
  color: ${({ theme }) => theme.yellow2};
  font-weight: 500;
`

export const PinkCard = styled(Card)`
  background-color: rgba(255, 0, 122, 0.03);
  color: ${({ theme }) => theme.textHighlight};
  font-weight: 500;
`

const BlueCardStyled = styled(Card)`
  background-color: ${({ theme }) => theme.appInfoBoxBG};
  color: ${({ theme }) => theme.appInfoBoxTextColor};
  border-radius: 6px;
  width: 100%;
`

export const BlueCard = ({ children, ...rest }: CardProps) => {
  return (
    <BlueCardStyled {...rest}>
      <Text fontWeight={500}>
        {children}
      </Text>
    </BlueCardStyled>
  )
}
