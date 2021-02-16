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
import { ACTIVE_REWARD_POOLS, INACTIVE_REWARD_POOLS, SINGLE_POOLS, UNI_POOLS } from '../../constants'
import Toggle from '../../components/Toggle'
import { BigNumber } from '@ethersproject/bignumber'
import hexStringToNumber from '../../utils/hexStringToNumber'
import { getContract } from '../../utils'
import { ERC20, LINKSWAPLPToken } from '../../components/ABI'

export const MyStakePools = styled(BodyWrapper)`
  margin: 0 0 24px;
`

export default function StakeOverview() {
  const theme = useContext(ThemeContext)
  const { account, library } = useActiveWeb3React()
  const [fetchAll, setFetchAll] = useState(false)
  const [myRewardPools, setMyRewardPools] = useState<any | null>([])
  const [allRewardPools, setAllRewardPools] = useState<any | null>([])
  const [uniPoolsAdded, setUniPoolsAdded] = useState(false)
  const [singlePoolsAdded, setSinglePoolsAdded] = useState(false)
  const [myUniPoolsAdded, setMyUniPoolsAdded] = useState(false)
  const [mySinglePoolsAdded, setMySinglePoolsAdded] = useState(false)
  const [showOwn, setShowOwn] = useState(false)
  const [showExpired, setShowExpired] = useState(false)
  const [allPoolsAdded, setAllPoolsAdded] = useState(false)
  const [tokenBalances, setTokenBalances] = useState<any>({})
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map(tokens => ({
        liquidityToken: toV2LiquidityToken(tokens),
        tokens
      })),
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

  async function getUserBalance(tokenAddress: string, abi: any) {
    if (!account || !library) return
    const rewardsContract = getContract(tokenAddress, abi, library, account)
    const method: (...args: any) => Promise<BigNumber> = rewardsContract.balanceOf
    const args: Array<string> = [account]
    const balances = tokenBalances
    method(...args).then(response => {
      balances[tokenAddress] = hexStringToNumber(response.toHexString(), 18, 6)
      setTokenBalances(balances)
    })
    return true
  }

  const myStakePools: any[] = []
  if (tokenBalances.length === 0 || !mySinglePoolsAdded || !myUniPoolsAdded) {
    ACTIVE_REWARD_POOLS.forEach(poolObject => {
      let returnValue: any = false
      liquidityTokensWithBalances.forEach((pool: any) => {
        if (pool.liquidityToken.address === poolObject.address) {
          pool.balance = v2PairsBalances[pool.liquidityToken.address]?.toSignificant(6) || 0
          pool.rewardsAddress = poolObject.rewardsAddress
          pool.abi = poolObject.abi
          pool.type = poolObject.type
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
  const mfg = UNI_POOLS.MFGWETH
  if (!myUniPoolsAdded) {
    if (typeof tokenBalances[mfg.liquidityToken.address] === 'undefined') {
      getUserBalance(mfg.liquidityToken.address, LINKSWAPLPToken)
    }
    if (typeof tokenBalances[mfg.liquidityToken.address] !== 'undefined') {
      mfg.balance = tokenBalances[mfg.liquidityToken.address]
      if (Number(mfg.balance) > 0) {
        myStakePools.push(mfg)
        setMyRewardPools(myStakePools)
      }
      setMyUniPoolsAdded(true)
    }
  }

  //const alink = SINGLE_POOLS.ALINK
  if (!mySinglePoolsAdded) {
    //  if (typeof tokenBalances[alink.tokens[0].address] === 'undefined') {
    //    getUserBalance(alink.tokens[0].address, ERC20)
    //  }
    //  if (typeof tokenBalances[alink.tokens[0].address] !== 'undefined') {
    //    alink.balance = tokenBalances[alink.tokens[0].address]
    //    if (Number(alink.balance) > 0) {
    //      myStakePools.push(alink)
    //      setMyRewardPools(myStakePools)
    //    }
    setMySinglePoolsAdded(true)
    //  }
  }

  if (!fetchAll) {
    setFetchAll(true)
    const allStakePools: any[] = []
    if (Boolean(allRewardPools)) {
      if (!singlePoolsAdded) {
        allStakePools.push(SINGLE_POOLS.ALINK)
        setAllRewardPools(allStakePools)
        setSinglePoolsAdded(true)
      }
      ACTIVE_REWARD_POOLS.forEach(poolObject => {
        let returnValue: any = false
        tokenPairsWithLiquidityTokens.forEach((pool: any) => {
          if (pool.liquidityToken.address === poolObject.address) {
            pool.rewardsAddress = poolObject.rewardsAddress
            pool.abi = poolObject.abi
            pool.type = poolObject.type
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
            pool.abi = poolObject.abi
            pool.type = poolObject.type
            returnValue = pool
            return
          }
        })
        if (returnValue) {
          allStakePools.push(returnValue)
          setAllRewardPools(allStakePools)
        }
      })
      if (!uniPoolsAdded) {
        //  allStakePools.push(UNI_POOLS.MFGWETH)
        //  setAllRewardPools(allStakePools)
        setUniPoolsAdded(true)
      }
    }
  }

  if (
    (allRewardPools.length &&
      uniPoolsAdded &&
      singlePoolsAdded &&
      myUniPoolsAdded &&
      mySinglePoolsAdded &&
      fetchAll &&
      !allPoolsAdded) ||
    !account
  ) {
    setTimeout(function() {
      setAllPoolsAdded(true)
    }, 500)
  }

  const { t } = useTranslation()
  return (
    <>
      <Card style={{ maxWidth: '420px', padding: '12px', backgroundColor: theme.navigationBG, marginBottom: '16px' }}>
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
            ) : allPoolsAdded ? (
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
