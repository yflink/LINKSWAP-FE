import React, { useContext, useMemo, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import Card from '../../components/Card'
import Question from '../../components/QuestionHelper'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { TYPE } from '../../theme'
import { Text } from 'rebass'
import { LightCard } from '../../components/Card'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import AppBody, { BodyWrapper } from '../AppBody'
import { Dots } from '../../components/swap/styleds'
import { useTranslation } from 'react-i18next'
import { StakePools } from '../../components/Stake'
import { ACTIVE_REWARD_POOLS, INACTIVE_REWARD_POOLS } from '../../constants'
import { useTokenUsdPrices } from '../../hooks/useTokenUsdPrice'
import { useLPTokenUsdPrices } from '../../hooks/useLPTokenUsdPrice'
import Toggle from '../../components/Toggle'

export const MyStakePools = styled(BodyWrapper)`
  margin: 0 0 24px;
`

export default function StakeOverview() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const [myRewardPools, setMyRewardPools] = useState<any | null>([])
  const [allRewardPools, setAllRewardPools] = useState<any | null>([])
  const [showOwn, setShowOwn] = useState(false)
  const [showExpired, setShowExpired] = useState(false)
  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const inactiveTokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
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

  if (myRewardPools.length === 0) {
    const myStakePools: any[] = []
    ACTIVE_REWARD_POOLS.forEach(poolObject => {
      let returnValue: any = false
      liquidityTokensWithBalances.forEach((pool: any) => {
        if (pool.liquidityToken.address === poolObject.address) {
          pool.rewardsAddress = poolObject.rewardsAddress
          pool.balance = v2PairsBalances[pool.liquidityToken.address]?.toSignificant(6) || 0
          returnValue = pool
          return
        }
      })
      if (returnValue) {
        myStakePools.push(returnValue)
        setMyRewardPools(myStakePools)
      }
    })
  }

  if (allRewardPools.length === 0) {
    if (Boolean(allRewardPools)) {
      const allStakePools: any[] = []
      ACTIVE_REWARD_POOLS.forEach(poolObject => {
        let returnValue: any = false
        tokenPairsWithLiquidityTokens.forEach((pool: any) => {
          if (pool.liquidityToken.address === poolObject.address) {
            pool.rewardsAddress = poolObject.rewardsAddress
            returnValue = pool
            return
          }
        })
        if (returnValue) {
          allStakePools.push(returnValue)
          setAllRewardPools(allStakePools)
        }
      })
    }
  }

  if (allRewardPools.length === 0) {
    const allStakePools: any[] = []
    if (Boolean(allRewardPools)) {
      ACTIVE_REWARD_POOLS.forEach(poolObject => {
        let returnValue: any = false
        tokenPairsWithLiquidityTokens.forEach((pool: any) => {
          if (pool.liquidityToken.address === poolObject.address) {
            pool.rewardsAddress = poolObject.rewardsAddress
            returnValue = pool
            return
          }
        })
        if (returnValue) {
          allStakePools.push(returnValue)
          setAllRewardPools(allStakePools)
        }
      })
      INACTIVE_REWARD_POOLS.forEach(poolObject => {
        let returnValue: any = false
        inactiveTokenPairsWithLiquidityTokens.forEach((pool: any) => {
          if (pool.liquidityToken.address === poolObject.address) {
            pool.rewardsAddress = poolObject.rewardsAddress
            returnValue = pool
            return
          }
        })
        if (returnValue) {
          allStakePools.push(returnValue)
          setAllRewardPools(allStakePools)
        }
      })
    }
  }

  const { t } = useTranslation()
  useTokenUsdPrices()
  useLPTokenUsdPrices()
  return (
    <>
      <Card style={{ maxWidth: '420px', padding: '12px', backgroundColor: theme.appBGColor, marginBottom: '16px' }}>
        <SwapPoolTabs active={'stake'} />
      </Card>
      {myRewardPools.length > 0 && (
        <MyStakePools>
          <AutoColumn gap="lg" justify="center">
            <AutoColumn gap="12px" style={{ width: '100%' }}>
              <RowBetween>
                <Text color={theme.textPrimary} fontWeight={500}>
                  {t('myStakeablePositions')}
                </Text>
                <Question text={t('myStakeablePositionsDescription')} />
              </RowBetween>
              <StakePools poolArray={myRewardPools} my={true} />
            </AutoColumn>
          </AutoColumn>
        </MyStakePools>
      )}
      <AppBody>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="12px" style={{ width: '100%' }}>
            <RowBetween>
              <Text color={theme.textPrimary} fontWeight={500}>
                {t('stakePools')}
              </Text>
              <Question text={t('stakePoolsDescription')} />
            </RowBetween>
            {account && (
              <RowBetween>
                <TYPE.body color={theme.textSecondary}>{t('onlyShowYourStakePools')}</TYPE.body>
                <Toggle id="show-own-stakes-button" isActive={showOwn} toggle={() => setShowOwn(!showOwn)} />
              </RowBetween>
            )}
            <RowBetween>
              <TYPE.body color={theme.textSecondary}>{t('showExpiredStakePools')}</TYPE.body>
              <Toggle
                id="show-expired-stakes-button"
                isActive={showExpired}
                toggle={() => setShowExpired(!showExpired)}
              />
            </RowBetween>
            {v2IsLoading ? (
              <LightCard padding="40px">
                <TYPE.body color={theme.textPrimary} textAlign="center">
                  <Dots>{t('loading')}</Dots>
                </TYPE.body>
              </LightCard>
            ) : allRewardPools.length > 0 ? (
              <StakePools poolArray={allRewardPools} showOwn={showOwn} showExpired={showExpired} my={false} />
            ) : (
              <LightCard padding="40px">
                <TYPE.body color={theme.textPrimary} textAlign="center">
                  {t('noStakePools')}
                </TYPE.body>
              </LightCard>
            )}
          </AutoColumn>
        </AutoColumn>
      </AppBody>
    </>
  )
}
