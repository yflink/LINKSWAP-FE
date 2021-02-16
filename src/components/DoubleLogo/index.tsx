import { Currency } from '@uniswap/sdk'
import React from 'react'
import styled from 'styled-components'

import CurrencyLogo from '../CurrencyLogo'

const Wrapper = styled.div<{ margin: boolean; sizeraw: number }>`
  position: relative;
  display: flex;
  flex-direction: row;
  margin-inline-end: 10px;
  height: ${({ sizeraw }) => sizeraw.toString() + 'px'};
`

const HigherLogo = styled(CurrencyLogo)`
  z-index: 2;
`
const CoveredLogo = styled(CurrencyLogo)<{ sizeraw: number }>`
  position: absolute;
  left: ${({ sizeraw }) => (sizeraw / 2).toString() + 'px'};
`

interface DoubleCurrencyLogoProps {
  margin?: boolean
  size?: number
  currency0?: Currency
  currency1?: Currency
}

interface SingleCurrencyLogoProps {
  margin?: boolean
  size?: number
  currency0?: Currency
  currency1?: Currency
}

export function SingleCurrencyLogo({ currency0, size = 18, margin = false }: SingleCurrencyLogoProps) {
  return (
    <Wrapper sizeraw={size} margin={margin}>
      <div>{currency0 && <HigherLogo currency={currency0} size={size.toString() + 'px'} />}</div>
    </Wrapper>
  )
}

export default function DoubleCurrencyLogo({
  currency0,
  currency1,
  size = 18,
  margin = false
}: DoubleCurrencyLogoProps) {
  return (
    <Wrapper sizeraw={size} margin={margin}>
      <div>{currency0 && <HigherLogo currency={currency0} size={size.toString() + 'px'} />}</div>
      <div style={{ marginInlineStart: '5px' }}>
        {currency1 && <CoveredLogo currency={currency1} size={size.toString() + 'px'} sizeraw={size} />}
      </div>
    </Wrapper>
  )
}
