import React from 'react'
import { Price } from '@uniswap/sdk'
import { useContext } from 'react'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { useGetPriceBase } from '../../state/price/hooks'

interface TradePriceProps {
  price?: Price
  showInverted: boolean
  priceImpactSeverity: number
}

export default function TradePrice({ price, showInverted, priceImpactSeverity }: TradePriceProps) {
  const theme = useContext(ThemeContext)
  const priceObject = useGetPriceBase()
  let baseCurrency = 'ETH'
  if (
    (price?.baseCurrency?.symbol === 'LINK' && price?.quoteCurrency?.symbol !== 'ETH') ||
    (price?.baseCurrency?.symbol !== 'ETH' && price?.quoteCurrency?.symbol === 'LINK') ||
    (price?.baseCurrency?.symbol === 'LINK' && price?.quoteCurrency?.symbol === 'ETH')
  ) {
    baseCurrency = 'LINK'
  }
  if (price?.baseCurrency?.symbol !== 'LINK' && price?.baseCurrency?.symbol !== 'ETH') {
    baseCurrency = 'YFLUSD'
  }
  const priceBase =
    baseCurrency === 'ETH'
      ? priceObject['ethPriceBase']
      : baseCurrency === 'LINK'
      ? priceObject['linkPriceBase']
      : priceObject['yflusdPriceBase']
  const hasPriceBase = priceBase > 0 && priceImpactSeverity < 2
  const formattedPrice = showInverted ? price?.toSignificant(4) : price?.invert()?.toSignificant(4)
  const tokenPrice = Number(formattedPrice) || 1

  let usdPrice = showInverted ? priceBase : tokenPrice * priceBase
  if (price?.baseCurrency?.symbol !== 'ETH' && price?.baseCurrency?.symbol !== 'LINK') {
    usdPrice = showInverted ? tokenPrice * priceBase : priceBase
  }

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
