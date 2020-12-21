import React from 'react'
import { Price } from '@uniswap/sdk'
import { useContext } from 'react'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { useGetPriceBase } from '../../state/price/hooks'

interface TradePriceProps {
  price?: Price
  showInverted: boolean
}

export default function TradePrice({ price, showInverted }: TradePriceProps) {
  const theme = useContext(ThemeContext)
  const priceObject = useGetPriceBase()
  const priceBase =
    price?.baseCurrency?.symbol === 'ETH' || price?.baseCurrency?.symbol === 'ETH'
      ? priceObject['ethPriceBase']
      : priceObject['linkPriceBase']
  const hasPriceBase = priceBase > 0
  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)
  const tokenPrice = Number(formattedPrice) || 1

  let usdPrice = showInverted ? priceBase : tokenPrice * priceBase
  if (price?.baseCurrency?.symbol !== 'ETH' && price?.baseCurrency?.symbol !== 'LINK') {
    usdPrice = showInverted ? tokenPrice * priceBase : priceBase
  }

  const formatedUsdPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usdPrice)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
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
      {show ? (
        <>
          {hasPriceBase ? (
            <>
              {label} ({formatedUsdPrice})
            </>
          ) : (
            <>{label}</>
          )}
        </>
      ) : (
        '-'
      )}
    </Text>
  )
}
