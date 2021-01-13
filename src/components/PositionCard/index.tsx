import { JSBI, Pair, Percent } from '@uniswap/sdk'
import { darken } from 'polished'
import React, { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink } from 'react-feather'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useTotalSupply } from '../../data/TotalSupply'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { ButtonLight, ButtonSecondary } from '../Button'
import Card, { GreyCard } from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween, RowFixed } from '../Row'
import { Countdown } from '../Countdown'
import { Dots } from '../swap/styleds'
import { useTranslation } from 'react-i18next'
import { ACTIVE_REWARD_POOLS } from '../../constants'
import { StakeSVG } from '../SVG'
import { getContract } from '../../utils'
import { LINKSWAPLPToken, StakingRewards } from '../../pages/Stake/stakingAbi'
import { BigNumber } from '@ethersproject/bignumber'
import hexStringToNumber from '../../utils/hexStringToNumber'
import { useSelectedTokenList } from '../../state/lists/hooks'
import { useGetLPTokenPrices, useGetTokenPrices } from '../../state/price/hooks'
import { numberToUsd, numberToPercent, numberToSignificant } from '../../utils/numberUtils'
import { getNetworkLibrary } from '../../connectors'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useCountdown } from '../../hooks/useCountdown'
import moment from 'moment'

const ExternalLinkIcon = styled(ExternalLink)`
  display: inline-block;
  margin-inline-start: 3px;
  width: 14px;
  height: 14px;
  margin-bottom: -2px;
  numberToPercent > * {
    stroke: ${({ theme }) => theme.textPrimary};
  }
`
export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

const StakeIcon = styled.div`
  height: 22px;
  display: inline-block;
  margin-inline-start: 10px;

  > svg {
    height: 22px;
    width: auto;
    * {
      fill: ${({ theme }) => theme.textPrimary};
    }
  }
`
const AnalyticsWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 8px 0 0;
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

export const HoverCard = styled(Card)`
  background-color: ${({ theme }) => theme.appBoxBG};
  border: 1px solid ${({ theme }) => theme.appBoxBG};
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.textTertiary)};
  }
`

const StakingCard = styled(Card)<{ highlight?: boolean; show?: boolean }>`
  font-size: 14px;
  line-height: 18px;
  background-color: ${({ theme }) => theme.appBoxBG};
  border: 1px solid ${({ theme, highlight }) => (highlight ? theme.textHighlight : theme.appBoxBG)};
  :hover {
    border: 1px solid
      ${({ theme, highlight, show }) => (highlight ? theme.textHighlight : show ? theme.appBoxBG : theme.textTertiary)};
  }
`

interface PositionCardProps {
  pair: Pair
  token?: any
  currencys?: any
  showUnwrapped?: boolean
  border?: string
}

interface StakingPositionCardProps {
  balance: any
  currencys: any
  token: any
}

export function MinimalPositionCard({ pair, showUnwrapped = false, border }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  const { t } = useTranslation()

  return (
    <>
      {userPoolBalance && (
        <GreyCard border={border}>
          <AutoColumn gap="12px">
            <FixedHeightRow>
              <RowFixed>
                <Text fontWeight={500} fontSize={16}>
                  {t('myPositions')}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={22} />
                {!currency0 || !currency1 ? (
                  <Text fontWeight={500} fontSize={20}>
                    <Dots>{t('loading')}</Dots>
                  </Text>
                ) : (
                  <div style={{ display: 'flex' }}>
                    <p style={{ fontWeight: 500, fontSize: 18 }}>{currency0.symbol}</p>
                    <p style={{ fontWeight: 100, fontSize: 18, margin: '18px 8px 0px 8px' }}> | </p>
                    <p style={{ fontWeight: 500, fontSize: 18 }}>{currency1.symbol}</p>
                  </div>
                )}
              </RowFixed>
              <RowFixed>
                <Text fontWeight={500} fontSize={20}>
                  {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <AutoColumn gap="4px">
              <RowFixed style={{ display: 'flex', width: '100%' }}>
                <Card style={{ marginInlineEnd: 16 }} secondary={true}>
                  <Text style={{ marginBottom: 4 }}>
                    {token0Deposited ? (
                      <RowFixed>
                        <Text fontSize={20} fontWeight={500}>
                          {token0Deposited?.toSignificant(6)}
                        </Text>
                      </RowFixed>
                    ) : (
                      '-'
                    )}
                  </Text>

                  <Text fontSize={16} fontWeight={500}>
                    {currency0.symbol}
                  </Text>
                </Card>
                <Card secondary={true}>
                  <Text style={{ marginBottom: 4 }}>
                    {token1Deposited ? (
                      <RowFixed>
                        <Text fontSize={20} fontWeight={500}>
                          {token1Deposited?.toSignificant(6)}
                        </Text>
                      </RowFixed>
                    ) : (
                      '-'
                    )}
                  </Text>

                  <Text fontSize={16} fontWeight={500}>
                    {currency1.symbol}
                  </Text>
                </Card>
              </RowFixed>
            </AutoColumn>
          </AutoColumn>
        </GreyCard>
      )}
    </>
  )
}

export default function FullPositionCard({ pair, border }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]

  const { t } = useTranslation()

  let rewards = false
  const liquidityToken = pair.liquidityToken
  ACTIVE_REWARD_POOLS.forEach((pool: any) => {
    if (pool.address === liquidityToken.address) {
      rewards = true
    }
  })

  return (
    <HoverCard border={border}>
      <AutoColumn gap="12px">
        <FixedHeightRow onClick={() => setShowMore(!showMore)} style={{ cursor: 'pointer' }}>
          <RowFixed style={{ position: 'relative' }}>
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={22} />
            {!currency0 || !currency1 ? (
              <Text fontWeight={500} fontSize={20}>
                <Dots>{t('loading')}</Dots>
              </Text>
            ) : (
              <div style={{ display: 'flex' }}>
                <p style={{ fontWeight: 500, fontSize: 18 }}>{currency0.symbol}</p>
                <p style={{ fontWeight: 100, fontSize: 18, margin: '18px 8px 0px 8px' }}> | </p>
                <p style={{ fontWeight: 500, fontSize: 18 }}>{currency1.symbol}</p>
              </div>
            )}
            {rewards && (
              <StakeIcon>
                <StakeSVG />
              </StakeIcon>
            )}
          </RowFixed>
          <RowFixed>
            {showMore ? (
              <ChevronUp size="20" style={{ marginInlineStart: '10px' }} />
            ) : (
              <ChevronDown size="20" style={{ marginInlineStart: '10px' }} />
            )}
          </RowFixed>
        </FixedHeightRow>
        {showMore && (
          <AutoColumn gap="8px">
            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500}>
                  {t('pooledCurrency', { currency: currency0.symbol })}
                </Text>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} style={{ marginInlineStart: '6px' }}>
                    {token0Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="22px" style={{ marginInlineStart: '8px' }} currency={currency0} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={16} fontWeight={500}>
                  {t('pooledCurrency', { currency: currency1.symbol })}
                </Text>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <Text fontSize={16} fontWeight={500} style={{ marginInlineStart: '6px' }}>
                    {token1Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="22px" style={{ marginInlineStart: '8px' }} currency={currency1} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                {t('yourPoolTokens')}
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
              </Text>
            </FixedHeightRow>
            <FixedHeightRow>
              <Text fontSize={16} fontWeight={500}>
                {t('yourPoolShare')}
              </Text>
              <Text fontSize={16} fontWeight={500}>
                {poolTokenPercentage ? poolTokenPercentage.toFixed(2) + '%' : '-'}
              </Text>
            </FixedHeightRow>

            {/* <AutoRow justify="center" marginTop={'10px'}>
              <ExternalLink href={`https://uniswap.info/pair/${pair.liquidityToken.address}`}>
                View pool information ↗
              </ExternalLink>
            </AutoRow> */}
            <RowBetween marginTop="10px">
              <ButtonSecondary as={Link} to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`} width="48%">
                {t('add')}
              </ButtonSecondary>
              <ButtonSecondary as={Link} width="48%" to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}>
                {t('remove')}
              </ButtonSecondary>
            </RowBetween>
            {rewards && (
              <RowBetween marginTop="10px">
                <ButtonSecondary as={Link} width="100%" to={`/stake/${currencyId(currency0)}/${currencyId(currency1)}`}>
                  {t('stake')}
                </ButtonSecondary>
              </RowBetween>
            )}
          </AutoColumn>
        )}
      </AutoColumn>
    </HoverCard>
  )
}

export function StakingPositionCard({ currencys, balance, token }: StakingPositionCardProps) {
  const { t } = useTranslation()
  const tokenPairAddress = token ? 'https://info.linkswap.app/pair/' + token.address : false

  return (
    <>
      <GreyCard>
        <AutoColumn gap="12px">
          <FixedHeightRow>
            <RowFixed>
              <Text fontWeight={500} fontSize={16}>
                {t('myStakedPosition')}
              </Text>
            </RowFixed>
          </FixedHeightRow>
          <RowBetween>
            <RowFixed>
              <DoubleCurrencyLogo currency0={currencys[0]} currency1={currencys[1]} margin={true} size={22} />
              {!currencys[0] || !currencys[1] ? (
                <Text fontWeight={500} fontSize={20}>
                  <Dots>{t('loading')}</Dots>
                </Text>
              ) : (
                <div style={{ display: 'flex' }}>
                  <p style={{ fontWeight: 500, fontSize: 18, margin: '0 4px' }}>{currencys[0].symbol}</p>
                  <p style={{ fontWeight: 100, fontSize: 18, margin: '0 4px' }}> | </p>
                  <p style={{ fontWeight: 500, fontSize: 18, margin: '0 4px' }}>{currencys[1].symbol}</p>
                </div>
              )}
            </RowFixed>
            <RowFixed>
              <Text fontWeight={500} fontSize={20}>
                {balance === 0 ? 0 : balance.toFixed(6)}
              </Text>
            </RowFixed>
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
      </GreyCard>
    </>
  )
}

export function FullStakingCard({
  values,
  my,
  show,
  showOwn,
  showExpired
}: {
  values: any
  my: boolean
  show?: boolean | false
  showOwn?: boolean | false
  showExpired?: boolean | true
}) {
  const { account, chainId, library } = useActiveWeb3React()
  const [showMore, setShowMore] = useState(show)
  const { t } = useTranslation()
  const currency0 = unwrappedToken(values.tokens[0])
  const currency1 = unwrappedToken(values.tokens[1])
  const [userBalance, setUserBalance] = useState(0)
  const [userRewards, setUserRewards] = useState<any[]>([])
  const [periodFinish, setPeriodFinish] = useState(0)
  const [rewardTokens, setRewardTokens] = useState<string[]>([])
  const [rewardTokenRates, setRewardTokenRates] = useState<string[]>([])
  const [totalSupply, setTotalSupply] = useState(0)
  const [totalLPSupply, setTotalLPSupply] = useState(0)
  const isHighlighted = userBalance > 0 && !my
  const liquidityToken = unwrappedToken(values.liquidityToken)
  const rewardInfo: any[] = []
  const allTokens = useSelectedTokenList()
  const { tokenPrices } = useGetTokenPrices()
  const { lpTokenPrices } = useGetLPTokenPrices()
  const id = values.liquidityToken.address.toLowerCase()
  const toggleWalletModal = useWalletModalToggle()
  const fakeAccount = '0x0000000000000000000000000000000000000000'
  const fakeChainId = 1
  const fakeLibrary = getNetworkLibrary()
  const then: any = periodFinish > 0 ? moment.unix(periodFinish) : 0
  const now: any = moment()
  const remaining = periodFinish > 0 ? moment(then - now).unix() : 1
  const isInactive = remaining < 100000
  const rewardsContract =
    !chainId || !library || !account
      ? getContract(values.rewardsAddress, StakingRewards, fakeLibrary, fakeAccount)
      : getContract(values.rewardsAddress, StakingRewards, library, account)
  const lpContract =
    !chainId || !library || !account
      ? getContract(values.liquidityToken.address, LINKSWAPLPToken, fakeLibrary, fakeAccount)
      : getContract(values.liquidityToken.address, LINKSWAPLPToken, library, account)
  let apy = 0

  useMemo(() => {
    if (!rewardsContract || !account) return
    const method: (...args: any) => Promise<BigNumber> = rewardsContract.balanceOf
    const args: Array<string | string[] | number> = [account]
    method(...args).then(response => {
      if (BigNumber.isBigNumber(response)) {
        setUserBalance(hexStringToNumber(response.toHexString(), liquidityToken.decimals, 6))
      }
    })
  }, [account, values, rewardsContract, liquidityToken])

  useMemo(() => {
    if (!rewardsContract || periodFinish > 0) return
    const method: (...args: any) => Promise<BigNumber> = rewardsContract.periodFinish
    method().then(response => {
      setPeriodFinish(hexStringToNumber(response.toHexString(), 0))
    })
  }, [values, rewardsContract])

  useMemo(() => {
    if (!rewardsContract || totalSupply > 0) return
    const method: (...args: any) => Promise<BigNumber> = rewardsContract.totalSupply
    method().then(response => {
      setTotalSupply(hexStringToNumber(response.toHexString(), liquidityToken.decimals))
    })
  }, [values, rewardsContract, liquidityToken])

  useMemo(() => {
    if (!rewardsContract || rewardTokens.length > 0) return
    const method: (...args: any) => Promise<string> = rewardsContract.rewardTokens
    const args = 0
    const rewardTokensArray = rewardTokens
    method(args).then(response => {
      rewardTokensArray[0] = response
      setRewardTokens(rewardTokensArray)
    })
  }, [values, rewardsContract])

  useMemo(() => {
    if (!rewardsContract || rewardTokens.length > 1) return
    const method: (...args: any) => Promise<string> = rewardsContract.rewardTokens
    const args = 1
    const rewardTokensArray = rewardTokens
    method(args).then(response => {
      if (response !== fakeAccount) {
        rewardTokensArray[1] = response
        setRewardTokens(rewardTokensArray)
      }
    })
  }, [values, rewardsContract])

  useMemo(() => {
    if (!rewardsContract || rewardTokenRates.length > 0) return
    const method: (...args: any) => Promise<BigNumber> = rewardsContract.rewardRate
    const args = 0
    const rewardTokenRatesArray = rewardTokenRates
    method(args).then(response => {
      rewardTokenRatesArray[0] = response.toHexString()
      setRewardTokenRates(rewardTokenRatesArray)
    })
  }, [values, rewardsContract, rewardTokens])

  useMemo(() => {
    if (!rewardsContract || rewardTokenRates.length > 1) return
    const method: (...args: any) => Promise<BigNumber> = rewardsContract.rewardRate
    const args = 1
    const rewardTokenRatesArray = rewardTokenRates
    method(args).then(response => {
      rewardTokenRatesArray[1] = response.toHexString()
      setRewardTokenRates(rewardTokenRatesArray)
    })
  }, [values, rewardsContract, rewardTokens])

  useMemo(() => {
    if (!lpContract || totalLPSupply > 0) return
    const method: (...args: any) => Promise<BigNumber> = lpContract.totalSupply
    method().then(response => {
      setTotalLPSupply(hexStringToNumber(response.toHexString(), liquidityToken.decimals))
    })
  }, [values, lpContract, liquidityToken])

  useMemo(() => {
    const wrappedRewardToken0 = allTokens['1'][rewardTokens[0]] || false
    if (!rewardsContract || !account || !wrappedRewardToken0) return
    const method: (...args: any) => Promise<any> = rewardsContract.earned
    const args: Array<string | number> = [account, 0x00]
    const userRewardArray = userRewards
    method(...args).then(response => {
      userRewardArray[0] = hexStringToNumber(response.toHexString(), wrappedRewardToken0.decimals)
      setUserRewards(userRewardArray)
    })
  }, [values, rewardsContract, rewardTokens, allTokens])

  useMemo(() => {
    const wrappedRewardToken1 = allTokens['1'][rewardTokens[1]] || false
    if (!rewardsContract || !account || !wrappedRewardToken1) return
    const method: (...args: any) => Promise<any> = rewardsContract.earned
    const args: Array<string | number> = [account, 0x01]
    const userRewardArray = userRewards
    method(...args).then(response => {
      userRewardArray[1] = hexStringToNumber(response.toHexString(), wrappedRewardToken1.decimals)
      setUserRewards(userRewardArray)
    })
  }, [values, rewardsContract, rewardTokens, allTokens])

  if ((chainId && rewardTokens.length) || (fakeChainId && rewardTokens.length)) {
    const chainIdNumber = chainId ? chainId : fakeChainId
    rewardTokens.forEach((tokenAddress: string, index: number) => {
      if (allTokens[chainIdNumber][tokenAddress]) {
        const tokenInfo = {
          address: tokenAddress.toLowerCase(),
          decimals: allTokens[chainIdNumber][tokenAddress].decimals,
          symbol: allTokens[chainIdNumber][tokenAddress].symbol,
          rate: 0,
          price: 0
        }

        if (rewardTokenRates[index]) {
          tokenInfo.rate = hexStringToNumber(rewardTokenRates[index], tokenInfo.decimals, 2, true)
        }

        if (tokenPrices[tokenInfo.address]) {
          tokenInfo.price = tokenPrices[tokenInfo.address].price
        }
        rewardInfo.push(tokenInfo)
      }
    })
  }
  const stakePoolTotalLiq = lpTokenPrices ? lpTokenPrices[id].totalLiq : 0
  const userShare = totalSupply > 0 && userBalance > 0 ? userBalance / (totalSupply / 100) : 0
  const lpTokenPrice = stakePoolTotalLiq && totalLPSupply > 0 ? stakePoolTotalLiq / totalLPSupply : 0
  const stakePoolTotalDeposited = lpTokenPrice ? totalSupply * lpTokenPrice : 0
  const userShareUsd = lpTokenPrice && userBalance ? userBalance * lpTokenPrice : 0

  if (apy === 0 && tokenPrices && stakePoolTotalDeposited && rewardInfo.length > 0 && periodFinish > 0) {
    let totalDailyRewardValue = 0
    if (rewardInfo[0] && rewardInfo[0].rate > 0) {
      const dailyToken0Value = rewardInfo[0].rate * rewardInfo[0].price
      if (dailyToken0Value > 0) {
        totalDailyRewardValue += dailyToken0Value
      }
    }

    if (rewardInfo[1] && rewardInfo[1].rate > 0) {
      const dailyToken1Value = rewardInfo[1].rate * rewardInfo[1].price
      if (dailyToken1Value > 0) {
        totalDailyRewardValue += dailyToken1Value
      }
    }

    if (!!totalSupply) {
      const yearlyRewardsValue = totalDailyRewardValue * 365
      const perDepositedDollarYearlyReward = yearlyRewardsValue / stakePoolTotalDeposited
      apy = perDepositedDollarYearlyReward * 100
    }
  }

  const headerRowStyles = show ? 'defaut' : 'pointer'
  if ((userBalance === 0 && showOwn) || (isInactive && !showExpired) || (!isInactive && showExpired)) {
    return <></>
  } else {
    return (
      <StakingCard highlight={isHighlighted} show={show}>
        <AutoColumn gap="12px">
          {apy || show ? (
            <FixedHeightRow
              onClick={() => {
                if (!show) {
                  setShowMore(!showMore)
                }
              }}
              style={{ cursor: headerRowStyles, position: 'relative' }}
            >
              {apy > 0 && !my && !isInactive && (
                <div style={{ position: 'absolute', right: '-13px', top: '-16px', fontSize: '12px' }}>
                  {t('apy', { apy: numberToPercent(apy) })}
                </div>
              )}
              <RowFixed>
                <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin={true} size={22} />
                {!currency0 || !currency1 ? (
                  <Text fontWeight={500} fontSize={20}>
                    <Dots>{t('loading')}</Dots>
                  </Text>
                ) : (
                  <div style={{ display: 'flex', position: 'relative' }}>
                    <p style={{ fontWeight: 500, fontSize: 18, margin: '0 4px' }}>{currency0.symbol}</p>
                    <p style={{ fontWeight: 100, fontSize: 18, margin: '0 4px' }}> | </p>
                    <p style={{ fontWeight: 500, fontSize: 18, margin: '0 4px' }}>{currency1.symbol}</p>
                  </div>
                )}
              </RowFixed>
              {!show && (
                <RowFixed>
                  {showMore ? (
                    <ChevronUp size="20" style={{ marginInlineStart: '10px' }} />
                  ) : (
                    <ChevronDown size="20" style={{ marginInlineStart: '10px' }} />
                  )}
                </RowFixed>
              )}
            </FixedHeightRow>
          ) : (
            <FixedHeightRow>
              <RowFixed>
                <Text fontWeight={500} fontSize={20}>
                  <Dots>{t('loading')}</Dots>
                </Text>
              </RowFixed>
            </FixedHeightRow>
          )}
          {showMore && (
            <AutoColumn gap="8px">
              {my && (
                <RowBetween>
                  <Text>{t('stakableTokenAmount')}</Text>
                  {numberToSignificant(values['balance'])}
                </RowBetween>
              )}
              {userBalance > 0 && (
                <RowBetween>
                  <Text>{t('stakedTokenAmount')}</Text>
                  {numberToSignificant(userBalance)}
                </RowBetween>
              )}
              {userBalance > 0 && userShare > 0 && userShareUsd > 0 && (
                <RowBetween>
                  <Text>{t('yourPoolShare')}</Text>
                  {numberToUsd(userShareUsd)} ({numberToPercent(userShare)})
                </RowBetween>
              )}
              {(userRewards.length > 0 && userRewards[0] > 0) || (userRewards.length > 0 && userRewards[1] > 0) ? (
                <RowBetween style={{ alignItems: 'flex-start' }}>
                  <Text>{t('claimableRewards')}</Text>
                  <Text style={{ textAlign: 'end' }}>
                    {userRewards.length > 0 && rewardInfo.length > 0 && userRewards[0] > 0 && (
                      <div>
                        {numberToSignificant(userRewards[0])} {rewardInfo[0].symbol}
                      </div>
                    )}
                    {userRewards.length > 1 && rewardInfo.length > 1 && userRewards[1] > 0 && (
                      <div>
                        {numberToSignificant(userRewards[1])} {rewardInfo[1].symbol}
                      </div>
                    )}
                  </Text>
                </RowBetween>
              ) : (
                <>
                  {periodFinish > 0 && userBalance > 0 && (
                    <RowBetween style={{ alignItems: 'flex-start' }}>
                      <Text>{t('claimableRewards')}</Text>
                      <Dots>{t('loading')}</Dots>
                    </RowBetween>
                  )}
                </>
              )}
              {my && !show && (
                <RowBetween marginTop="10px">
                  <ButtonSecondary
                    as={Link}
                    width="100%"
                    to={`/stake/${currencyId(currency0)}/${currencyId(currency1)}`}
                  >
                    {t('stake')}
                  </ButtonSecondary>
                </RowBetween>
              )}
              <RowBetween>
                <Text style={{ margin: '12px 0 0' }} fontSize="16px" fontWeight={600}>
                  {t('stakePoolStats')}
                </Text>
              </RowBetween>
              {stakePoolTotalLiq > 0 && (
                <RowBetween style={{ alignItems: 'flex-start' }}>
                  <Text>{t('stakePoolTotalLiq')}</Text>
                  <Text>{numberToUsd(stakePoolTotalLiq)}</Text>
                </RowBetween>
              )}
              {stakePoolTotalDeposited > 0 && (
                <RowBetween style={{ alignItems: 'flex-start' }}>
                  <Text>{t('stakePoolTotalDeposited')}</Text>
                  <Text>{numberToUsd(stakePoolTotalDeposited)}</Text>
                </RowBetween>
              )}
              {rewardInfo.length > 0 && (
                <RowBetween style={{ alignItems: 'flex-start' }}>
                  <Text>{t('stakePoolRewards')}</Text>
                  <Text style={{ textAlign: 'end' }}>
                    {rewardInfo[0]['rate'] > 0 && (
                      <div>
                        {t('stakeRewardPerDay', { rate: rewardInfo[0].rate, currencySymbol: rewardInfo[0].symbol })}
                      </div>
                    )}
                    {rewardInfo.length > 1 && rewardInfo[1]['rate'] > 0 && (
                      <div style={{ textAlign: 'end' }}>
                        {t('stakeRewardPerDay', { rate: rewardInfo[1].rate, currencySymbol: rewardInfo[1].symbol })}
                      </div>
                    )}
                    {apy > 0 && !isInactive && (
                      <div style={{ textAlign: 'end', marginTop: '8px' }}>
                        {t('apy', { apy: numberToPercent(apy) })}
                      </div>
                    )}
                  </Text>
                </RowBetween>
              )}
              <RowBetween>
                <Text>{t('timeRemaining')}</Text>
                <Countdown ends={periodFinish} format="DD[d] HH[h] mm[m] ss[s]" />
              </RowBetween>
              {userBalance > 0 && !my && !isInactive && (
                <RowBetween marginTop="10px">
                  <ButtonSecondary
                    as={Link}
                    width="48%"
                    style={{ marginInlineEnd: '1%' }}
                    to={`/unstake/${currencyId(currency0)}/${currencyId(currency1)}`}
                  >
                    {t('claimRewards')}
                  </ButtonSecondary>
                  <ButtonSecondary
                    as={Link}
                    width="48%"
                    style={{ marginInlineStart: '1%' }}
                    to={`/unstake/${currencyId(currency0)}/${currencyId(currency1)}`}
                  >
                    {t('unstake')}
                  </ButtonSecondary>
                </RowBetween>
              )}
              {userBalance > 0 && userRewards.length > 0 && !my && (
                <RowBetween marginTop="10px">
                  <ButtonSecondary
                    as={Link}
                    width="100%"
                    style={{ marginInlineEnd: '1%' }}
                    to={`/unstake/${currencyId(currency0)}/${currencyId(currency1)}`}
                  >
                    {t('unstakeAndClaim')}
                  </ButtonSecondary>
                </RowBetween>
              )}
              {userBalance === 0 && !my && !isInactive && (
                <RowBetween marginTop="10px">
                  {!account ? (
                    <ButtonLight onClick={toggleWalletModal}>{t('connectWallet')}</ButtonLight>
                  ) : (
                    <ButtonSecondary
                      as={Link}
                      to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                      width="100%"
                    >
                      {t('addLiquidity')}
                    </ButtonSecondary>
                  )}
                </RowBetween>
              )}
            </AutoColumn>
          )}
        </AutoColumn>
      </StakingCard>
    )
  }
}
