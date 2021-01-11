import React, { useContext } from 'react'
import { ThemeContext } from 'styled-components'
import { Text } from 'rebass'

import { Currency, Percent, Price } from '@uniswap/sdk'

import { ONE_BIPS } from '../../constants'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../theme'

import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import { useTranslation } from 'react-i18next'

export function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
}) {
  const theme = useContext(ThemeContext)

  const { t } = useTranslation()

  return (
    <AutoColumn gap="md">
      <AutoRow justify="space-around" gap="4px">
        <AutoColumn justify="center">
          <Text fontWeight={500} fontSize={14} color={theme.textSecondary} pt={1} style={{ marginBottom: '6px' }}>
            {t('currencyPerCurrency', {
              currencyA: currencies[Field.CURRENCY_B]?.symbol,
              currencyB: currencies[Field.CURRENCY_A]?.symbol
            })}
          </Text>
          <TYPE.black>{price?.toSignificant(6) ?? '-'}</TYPE.black>
        </AutoColumn>
        <AutoColumn justify="center">
          <Text fontWeight={500} fontSize={14} color={theme.textSecondary} pt={1} style={{ marginBottom: '6px' }}>
            {t('currencyPerCurrency', {
              currencyA: currencies[Field.CURRENCY_A]?.symbol,
              currencyB: currencies[Field.CURRENCY_B]?.symbol
            })}
          </Text>
          <TYPE.black>{price?.invert()?.toSignificant(6) ?? '-'}</TYPE.black>
        </AutoColumn>
        <AutoColumn justify="center">
          <Text fontWeight={500} fontSize={14} color={theme.textSecondary} pt={1} style={{ marginBottom: '6px' }}>
            {t('shareOfPool')}
          </Text>
          <TYPE.black>
            {noLiquidity && price
              ? '100'
              : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
            %
          </TYPE.black>
        </AutoColumn>
      </AutoRow>
    </AutoColumn>
  )
}
