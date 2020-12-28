import { Trade, TradeType } from '@uniswap/sdk'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE } from '../../theme'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { SectionBreak } from './styleds'
import SwapRoute from './SwapRoute'
import { useTranslation } from 'react-i18next'
import { ExternalLink } from 'react-feather'

const ExternalLinkIcon = styled(ExternalLink)`
  display: inline-block;
  margin-inline-start: 3px;
  width: 14px;
  height: 14px;
  margin-bottom: -2px;

  > * {
    stroke: ${({ theme }) => theme.textPrimary};
  }
`

const AnalyticsWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 1rem 0 0;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 14px;
  line-height: 14px;
  border: 1px solid ${({ theme }) => theme.textSecondary};

  a {
    color: ${({ theme }) => theme.textPrimary};
    text-decoration: none;
    font-weight: 600;
    :hover,
    :focus {
      text-decoration: underline;
    }
  }
`

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
  const theme = useContext(ThemeContext)
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)
  const { t } = useTranslation()
  const tokenPairAddress =
    typeof trade.route.pairs[0].liquidityToken.address !== 'undefined'
      ? 'https://info.linkswap.app/pair/' + trade.route.pairs[0].liquidityToken.address
      : false

  return (
    <>
      <AutoColumn style={{ padding: '0 20px' }}>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.textSecondary}>
              {isExactIn ? t('minimumReceived') : t('maximumSold')}
            </TYPE.black>
            <QuestionHelper text={t('transactionWillRevertDescription')} />
          </RowFixed>
          <RowFixed>
            <TYPE.black color={theme.textPrimary} fontSize={14}>
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                  '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ??
                  '-'}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.textSecondary}>
              {t('priceImpact')}
            </TYPE.black>
            <QuestionHelper text={t('priceImpactDescription')} />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme.textSecondary}>
              {t('liquidityProviderFee')}
            </TYPE.black>
            <QuestionHelper text={t('liquidityProviderFeeDiscription')} />
          </RowFixed>
          <TYPE.black fontSize={14} color={theme.textPrimary}>
            {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
          </TYPE.black>
        </RowBetween>
        {tokenPairAddress && (
          <RowBetween>
            <AnalyticsWrapper>
              <a target="_blank" rel="noopener noreferrer" href={tokenPairAddress}>
                {t('viewPairAnalytics')} <ExternalLinkIcon />
              </a>
            </AnalyticsWrapper>
          </RowBetween>
        )}
      </AutoColumn>
    </>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext)
  const [allowedSlippage] = useUserSlippageTolerance()
  const showRoute = Boolean(trade && trade.route.path.length > 2)
  const { t } = useTranslation()

  return (
    <AutoColumn gap="md">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <SectionBreak />
              <AutoColumn style={{ padding: '0 24px' }}>
                <RowFixed>
                  <TYPE.black fontSize={14} fontWeight={400} color={theme.textSecondary}>
                    {t('route')}
                  </TYPE.black>
                  <QuestionHelper text={t('routeDescription')} />
                </RowFixed>
                <SwapRoute trade={trade} />
              </AutoColumn>
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
}
