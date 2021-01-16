import React, { useContext, useMemo } from 'react'
import { ThemeContext } from 'styled-components'
import { Pair } from '@uniswap/sdk'
import { Link } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import Card from '../../components/Card'

import Question from '../../components/QuestionHelper'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { StyledInternalLink, TYPE } from '../../theme'
import { Text } from 'rebass'
import { LightCard } from '../../components/Card'
import { RowBetween } from '../../components/Row'
import { ButtonPrimary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import AppBody from '../AppBody'
import { Dots } from '../../components/swap/styleds'
import { useTranslation } from 'react-i18next'
import { useTokenUsdPrices } from '../../hooks/useTokenUsdPrice'
import { useLPTokenUsdPrices } from '../../hooks/useLPTokenUsdPrice'
import { AnalyticsWrapper, ExternalLinkIcon } from './styleds'

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )

  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])

  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const hasV1Liquidity = false // useUserHasLiquidityInAllTokens()

  const tokenPairAddress = account ? 'https://info.linkswap.app/account/' + account : false

  const { t } = useTranslation()
  useTokenUsdPrices()
  useLPTokenUsdPrices()
  return (
    <>
      <Card style={{ maxWidth: '420px', padding: '12px', backgroundColor: theme.appBGColor, marginBottom: '16px' }}>
        <SwapPoolTabs active={'pool'} />
      </Card>
      <AppBody>
        <AutoColumn gap="lg" justify="center">
          <ButtonPrimary id="join-pool-button" as={Link} style={{ padding: 16 }} to="/add/ETH">
            <Text fontWeight={500} fontSize={20}>
              {t('addLiquidity')}
            </Text>
          </ButtonPrimary>

          <AutoColumn gap="12px" style={{ width: '100%' }}>
            <RowBetween padding={'0 8px'}>
              <Text color={theme.textPrimary} fontWeight={500}>
                {t('myPositions')}
              </Text>
              <Question text={t('addingLiquidity')} />
            </RowBetween>

            {!account ? (
              <LightCard padding="40px">
                <TYPE.body color={theme.textPrimary} textAlign="center">
                  {t('connectToSeeLiquidity')}
                </TYPE.body>
              </LightCard>
            ) : v2IsLoading ? (
              <LightCard padding="40px">
                <TYPE.body color={theme.textPrimary} textAlign="center">
                  <Dots>{t('loading')}</Dots>
                </TYPE.body>
              </LightCard>
            ) : allV2PairsWithLiquidity?.length > 0 ? (
              <>
                {allV2PairsWithLiquidity.map(v2Pair => (
                  <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                ))}
              </>
            ) : (
              <LightCard padding="40px">
                <TYPE.body color={theme.textPrimary} textAlign="center">
                  {t('noLiquidityFound')}
                </TYPE.body>
              </LightCard>
            )}
            {allV2PairsWithLiquidity?.length > 0 && tokenPairAddress && (
              <RowBetween>
                <AnalyticsWrapper>
                  <a target="_blank" rel="noopener noreferrer" href={tokenPairAddress}>
                    {t('viewYourLiquidityAnalytics')} <ExternalLinkIcon />
                  </a>
                </AnalyticsWrapper>
              </RowBetween>
            )}
            <div>
              <Text textAlign="center" fontSize={14} style={{ padding: '.5rem 0 .5rem 0' }}>
                {hasV1Liquidity ? t('uniswapV1LiquidityFound') : t('dontSeeJoinedPool')}{' '}
                <StyledInternalLink id="import-pool-link" to={hasV1Liquidity ? '/migrate/v1' : '/find'}>
                  {hasV1Liquidity ? t('migrateNow') : t('importIt')}
                </StyledInternalLink>
              </Text>
            </div>
          </AutoColumn>
        </AutoColumn>
      </AppBody>

      {/* <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem' }}>
        <ButtonSecondary as={Link} style={{ width: 'initial' }} to="/migrate/v1">
          Migrate V1 Liquidity
        </ButtonSecondary>
      </div> */}
    </>
  )
}
