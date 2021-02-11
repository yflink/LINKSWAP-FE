import React from 'react'
import { Price } from '@uniswap/sdk'
import { useContext } from 'react'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { useGetPriceBase, useGetTokenPrices } from '../../state/price/hooks'
import { currencyId } from '../../utils/currencyId'

interface TradePriceProps {
  price?: Price
  showInverted: boolean
  priceImpactSeverity: number
}

export default function TradePrice({ price, showInverted, priceImpactSeverity }: TradePriceProps) {
  const theme = useContext(ThemeContext)
  const priceObject = useGetPriceBase()
  const { tokenPrices } = useGetTokenPrices()
  const baseCurrencyId = price?.baseCurrency ? currencyId(price.baseCurrency).toLowerCase() : 'eth'
  const priceBase =
    typeof tokenPrices[baseCurrencyId] !== 'undefined'
      ? tokenPrices[baseCurrencyId].symbol === 'ETH'
        ? priceObject['ethPriceBase']
        : tokenPrices[baseCurrencyId].symbol === 'WETH'
        ? priceObject['ethPriceBase']
        : tokenPrices[baseCurrencyId].symbol === 'LINK'
        ? priceObject['linkPriceBase']
        : tokenPrices[baseCurrencyId].symbol === 'YFLUSD'
        ? priceObject['yflusdPriceBase']
        : tokenPrices[baseCurrencyId].price
      : 0

  const hasPriceBase = priceBase > 0 && priceImpactSeverity < 2
  const formattedPrice = showInverted ? price?.toSignificant(4) : price?.invert()?.toSignificant(4)
  const tokenPrice = Number(formattedPrice) || 1
  const usdPrice = showInverted ? priceBase : tokenPrice * priceBase

  const formatedUsdPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usdPrice)
  const show = Boolean(price?.baseCurrency && price?.quoteCurrency) && priceImpactSeverity < 3
  const label = showInverted
    ? `1 ${price?.baseCurrency?.symbol} = ${formattedPrice} ${price?.quoteCurrency?.symbol}`
    : `1 ${price?.quoteCurrency?.symbol} = ${formattedPrice} ${price?.baseCurrency?.symbol}`

  return (
    <Text
      fontWeight={500}
      fontSize={14}
      color={theme.textSecondary}
      style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
    >
      {hasPriceBase && show ? (
        <>
          {label} ({formatedUsdPrice})
        </>
      ) : (
        <>{label}</>
      )}
    </Text>
  )
}
