import { JSBI, Pair, Percent } from '@uniswap/sdk'
import { darken } from 'polished'
import React, { useState } from 'react'
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
import Countdown from '../Countdown'
import { Dots } from '../swap/styleds'
import { useTranslation } from 'react-i18next'
import { ACTIVE_REWARD_POOLS } from '../../constants'
import { StakeSVG } from '../SVG'
import { calculateGasMargin, getContract } from '../../utils'
import { LINKSWAPLPToken, StakingRewards } from '../../pages/Stake/stakingAbi'
import { BigNumber } from '@ethersproject/bignumber'
import hexStringToNumber from '../../utils/hexStringToNumber'
import { useGetLPTokenPrices, useGetTokenPrices } from '../../state/price/hooks'
import { numberToUsd, numberToPercent, numberToSignificant } from '../../utils/numberUtils'
import { getNetworkLibrary } from '../../connectors'
import { useWalletModalToggle } from '../../state/application/hooks'
import moment from 'moment'
import { TransactionResponse } from '@ethersproject/providers'
import ReactGA from 'react-ga'
import { useTransactionAdder } from '../../state/transactions/hooks'

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
  height: 18px;
  display: inline-block;
  margin-inline-start: 10px;

  > svg {
    height: 18px;
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
  const { account, library } = useActiveWeb3React()
  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)
  const [totalLPSupply, setTotalLPSupply] = useState(0)
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
  const fakeAccount = '0x0000000000000000000000000000000000000000'
  const fakeLibrary = getNetworkLibrary()
  const liquidityToken = pair.liquidityToken
  const lpContract =
    !library || !account
      ? getContract(liquidityToken.address, LINKSWAPLPToken, fakeLibrary, fakeAccount)
      : getContract(liquidityToken.address, LINKSWAPLPToken, library, account)
  const { t } = useTranslation()
  const { lpTokenPrices } = useGetLPTokenPrices()
  const id: string = liquidityToken.address.toLowerCase()

  async function getTotalLPSupply() {
    const method: (...args: any) => Promise<BigNumber> = lpContract.totalSupply
    method().then(response => {
      setTotalLPSupply(hexStringToNumber(response.toHexString(), liquidityToken.decimals))
    })
  }

  if (lpContract) {
    if (totalLPSupply === 0) {
      getTotalLPSupply()
    }
  }

  const stakePoolTotalLiq = lpTokenPrices ? lpTokenPrices[id].totalLiq : 0
  const lpTokenPrice = stakePoolTotalLiq && totalLPSupply > 0 ? stakePoolTotalLiq / totalLPSupply : 0
  const userShareFactor = lpTokenPrice && poolTokenPercentage ? Number(poolTokenPercentage.toFixed(10)) / 100 : 0
  const userShareUsd = userShareFactor > 0 && stakePoolTotalLiq > 0 ? stakePoolTotalLiq * userShareFactor : 0

  let rewards = false

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
                <Text fontSize={14} fontWeight={500}>
                  {t('pooledCurrency', { currency: currency0.symbol })}
                </Text>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                  <Text fontSize={14} fontWeight={500} style={{ marginInlineStart: '6px' }}>
                    {token0Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="20px" style={{ marginInlineStart: '8px' }} currency={currency0} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <RowFixed>
                <Text fontSize={14} fontWeight={500}>
                  {t('pooledCurrency', { currency: currency1.symbol })}
                </Text>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <Text fontSize={14} fontWeight={500} style={{ marginInlineStart: '6px' }}>
                    {token1Deposited?.toSignificant(6)}
                  </Text>
                  <CurrencyLogo size="20px" style={{ marginInlineStart: '8px' }} currency={currency1} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
            <FixedHeightRow>
              <Text fontSize={14} fontWeight={500}>
                {t('yourPoolTokens')}
              </Text>
              <Text fontSize={14} fontWeight={500}>
                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
              </Text>
            </FixedHeightRow>
            <FixedHeightRow>
              <Text fontSize={14} fontWeight={500}>
                {t('stakePoolTotalLiq')}
              </Text>
              <Text fontSize={14} fontWeight={500}>
                {stakePoolTotalLiq ? numberToUsd(stakePoolTotalLiq) : '-'}
              </Text>
            </FixedHeightRow>
            <FixedHeightRow>
              <Text fontSize={14} fontWeight={500}>
                {t('yourPoolShare')}
              </Text>
              {userShareUsd > 0 ? (
                <Text fontSize={14} fontWeight={500}>
                  {poolTokenPercentage ? (
                    <span>
                      {numberToUsd(userShareUsd)} ({poolTokenPercentage.toFixed(2) + '%'})
                    </span>
                  ) : (
                    <span>{numberToUsd(userShareUsd)}</span>
                  )}
                </Text>
              ) : (
                <Text fontSize={14} fontWeight={500}>
                  {poolTokenPercentage ? poolTokenPercentage.toFixed(2) + '%' : '-'}
                </Text>
              )}
            </FixedHeightRow>

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
  const [rawUserBalance, setRawUserBalance] = useState<string>('0x00')
  const [userBalance, setUserBalance] = useState(0)
  const [userRewards, setUserRewards] = useState<string[]>(['', ''])
  const [periodFinish, setPeriodFinish] = useState(0)
  const [rewardTokens, setRewardTokens] = useState<string[]>(['', ''])
  const [rewardTokenRates, setRewardTokenRates] = useState<string[]>(['', ''])
  const [totalSupply, setTotalSupply] = useState(0)
  const [totalLPSupply, setTotalLPSupply] = useState(0)
  const isHighlighted = userBalance > 0 && !my
  const liquidityToken = unwrappedToken(values.liquidityToken)
  const rewardInfo: any[] = [
    {
      address: '',
      decimals: 18,
      symbol: '',
      rate: 0,
      price: 0,
      userReward: 0
    },
    {
      address: '',
      decimals: 18,
      symbol: '',
      rate: 0,
      price: 0,
      userReward: 0
    }
  ]
  const { tokenPrices } = useGetTokenPrices()
  const { lpTokenPrices } = useGetLPTokenPrices()
  const id = values.liquidityToken.address.toLowerCase()
  const toggleWalletModal = useWalletModalToggle()
  const fakeAccount = '0x0000000000000000000000000000000000000000'
  const fakeLibrary = getNetworkLibrary()
  const headerRowStyles = show ? 'defaut' : 'pointer'
  const addTransaction = useTransactionAdder()
  const then: any = periodFinish > 0 ? moment.unix(periodFinish) : 0
  const now: any = moment()
  const remaining = periodFinish > 0 ? moment(then - now).unix() : 1
  const isInactive = remaining < 1
  let apy = 0
  const rewardsContract =
    !chainId || !library || !account
      ? getContract(values.rewardsAddress, StakingRewards, fakeLibrary, fakeAccount)
      : getContract(values.rewardsAddress, StakingRewards, library, account)
  const lpContract =
    !chainId || !library || !account
      ? getContract(values.liquidityToken.address, LINKSWAPLPToken, fakeLibrary, fakeAccount)
      : getContract(values.liquidityToken.address, LINKSWAPLPToken, library, account)

  async function getUserBalance(account: string) {
    const method: (...args: any) => Promise<BigNumber> = rewardsContract.balanceOf
    const args: Array<string> = [account]
    method(...args).then(response => {
      if (BigNumber.isBigNumber(response)) {
        setRawUserBalance(response.toHexString())
        setUserBalance(hexStringToNumber(response.toHexString(), liquidityToken.decimals, 6))
      }
    })
  }

  async function getUserRewards(account: string, index: number, indexString: string) {
    const method: (...args: any) => Promise<any> = rewardsContract.earned
    const args: Array<string | number> = [account, indexString]
    const userRewardArray = userRewards
    method(...args).then(response => {
      userRewardArray[index] = response.toHexString()
      setUserRewards(userRewardArray)
    })
  }

  async function getPeriodFinish() {
    const method: (...args: any) => Promise<BigNumber> = rewardsContract.periodFinish
    method().then(response => {
      setPeriodFinish(hexStringToNumber(response.toHexString(), 0))
    })
  }

  async function getTotalSupply() {
    const method: (...args: any) => Promise<BigNumber> = rewardsContract.totalSupply
    method().then(response => {
      setTotalSupply(hexStringToNumber(response.toHexString(), liquidityToken.decimals))
    })
  }

  async function getTotalLPSupply() {
    const method: (...args: any) => Promise<BigNumber> = lpContract.totalSupply
    method().then(response => {
      setTotalLPSupply(hexStringToNumber(response.toHexString(), liquidityToken.decimals))
    })
  }

  async function getRewardTokens(index: number) {
    const method: (...args: any) => Promise<string> = rewardsContract.rewardTokens
    const args = index
    const rewardTokensArray = rewardTokens
    method(args).then(response => {
      rewardTokensArray[index] = response
      setRewardTokens(rewardTokensArray)
    })
  }
  async function getRewardTokenRates(index: number) {
    const method: (...args: any) => Promise<BigNumber> = rewardsContract.rewardRate
    const args = index
    const rewardTokenRatesArray = rewardTokenRates
    method(args).then(response => {
      rewardTokenRatesArray[index] = response.toHexString()
      setRewardTokenRates(rewardTokenRatesArray)
    })
  }

  if (rewardsContract) {
    if (account) {
      if (userBalance === 0) {
        getUserBalance(account)
      }

      if (rewardTokens[0] !== '') {
        getUserRewards(account, 0, '0x00')
      }

      if (rewardTokens[1] !== '') {
        getUserRewards(account, 1, '0x01')
      }
    }
    if (periodFinish === 0) {
      getPeriodFinish()
    }
    if (totalSupply === 0) {
      getTotalSupply()
    }
    if (rewardTokens[0] === '') {
      getRewardTokens(0)
    }
    if (rewardTokens[1] === '') {
      getRewardTokens(1)
    }
    if (rewardTokenRates[0] === '') {
      getRewardTokenRates(0)
    }
    if (rewardTokenRates[1] === '') {
      getRewardTokenRates(1)
    }
  }
  if (lpContract) {
    if (totalLPSupply === 0) {
      getTotalLPSupply()
    }
  }

  if (rewardTokens[0] !== '' && rewardTokens[1] !== '' && tokenPrices) {
    const token0Address = rewardTokens[0].toLowerCase()
    const token1Address = rewardTokens[1].toLowerCase()
    if (tokenPrices[token0Address]) {
      rewardInfo[0].address = token0Address
      rewardInfo[0].decimals = tokenPrices[token0Address].decimals
      rewardInfo[0].symbol = tokenPrices[token0Address].symbol
      rewardInfo[0].price = tokenPrices[token0Address].price

      if (rewardTokenRates[0]) {
        rewardInfo[0].rate = hexStringToNumber(rewardTokenRates[0], rewardInfo[0].decimals, 2, true)
      }
    }

    if (tokenPrices[token1Address]) {
      rewardInfo[1].address = token1Address
      rewardInfo[1].decimals = tokenPrices[token1Address].decimals
      rewardInfo[1].symbol = tokenPrices[token1Address].symbol
      rewardInfo[1].price = tokenPrices[token1Address].price

      if (rewardTokenRates[1]) {
        rewardInfo[1].rate = hexStringToNumber(rewardTokenRates[1], rewardInfo[1].decimals, 2, true)
      }
    }
  }

  if (userRewards[0] !== '' && userRewards[1] !== '') {
    rewardInfo[0].userReward = hexStringToNumber(userRewards[0], rewardInfo[0].decimals)
    rewardInfo[1].userReward = hexStringToNumber(userRewards[1], rewardInfo[1].decimals)
  }

  const stakePoolTotalLiq = lpTokenPrices ? lpTokenPrices[id].totalLiq : 0
  const userShare = totalSupply > 0 && userBalance > 0 ? userBalance / (totalSupply / 100) : 0
  const lpTokenPrice = stakePoolTotalLiq && totalLPSupply > 0 ? stakePoolTotalLiq / totalLPSupply : 0
  const stakePoolTotalDeposited = lpTokenPrice ? totalSupply * lpTokenPrice : 0
  const userShareUsd = lpTokenPrice && userBalance ? userBalance * lpTokenPrice : 0

  if (apy === 0 && tokenPrices && stakePoolTotalDeposited) {
    let totalDailyRewardValue = 0
    if (rewardInfo[0].rate > 0) {
      const dailyToken0Value = rewardInfo[0].rate * rewardInfo[0].price
      if (dailyToken0Value > 0) {
        totalDailyRewardValue += dailyToken0Value
      }
    }

    if (rewardInfo[1].rate > 0) {
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

  async function claimRewards(rewardsContractAddress: string) {
    if (!chainId || !library || !account) return
    const router = getContract(rewardsContractAddress, StakingRewards, library, account)
    const estimate = router.estimateGas.claimRewards
    const method: () => Promise<TransactionResponse> = router.claimRewards

    const value: BigNumber | null = null
    await estimate(value ? { value } : {})
      .then(() =>
        method().then(response => {
          addTransaction(response, {
            summary: t('claimRewardsOnPool', {
              currencyASymbol: currency0?.symbol,
              currencyBSymbol: currency1?.symbol
            })
          })

          ReactGA.event({
            category: 'Staking',
            action: 'ClaimRewards',
            label: currency0?.symbol + ' | ' + currency1?.symbol
          })
        })
      )
      .catch(error => {
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }

  async function unstakeAndClaimRewards(rewardsContractAddress: string) {
    if (!chainId || !library || !account || !rawUserBalance) return
    const router = getContract(rewardsContractAddress, StakingRewards, library, account)
    const estimate = router.estimateGas.unstakeAndClaimRewards
    const method: (...args: any) => Promise<TransactionResponse> = router.unstakeAndClaimRewards
    const args: Array<string> = [rawUserBalance]

    const value: BigNumber | null = null
    await estimate(...args, value ? { value } : {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then(response => {
          addTransaction(response, {
            summary: t('unstakeAndClaimRewardsOnPool', {
              currencyASymbol: currency0?.symbol,
              currencyBSymbol: currency1?.symbol
            })
          })

          ReactGA.event({
            category: 'Staking',
            action: 'UnstkeAndClaimRewards',
            label: currency0?.symbol + ' | ' + currency1?.symbol
          })
        })
      )
      .catch(error => {
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }

  if ((userBalance === 0 && showOwn) || (isInactive && !showExpired) || (!isInactive && showExpired)) {
    return <></>
  } else {
    return (
      <StakingCard highlight={isHighlighted} show={show}>
        <AutoColumn gap="12px">
          <FixedHeightRow
            onClick={() => {
              if (!show) {
                setShowMore(!showMore)
              }
            }}
            style={{ cursor: headerRowStyles, position: 'relative' }}
          >
            {!my && !isInactive && (
              <div style={{ position: 'absolute', right: '-13px', top: '-16px', fontSize: '12px' }}>
                {apy > 0 ? (
                  <p style={{ margin: 0 }}>{t('apy', { apy: numberToPercent(apy) })}</p>
                ) : (
                  <Dots>{t('loading')}</Dots>
                )}
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
              {rewardInfo[0].userReward > 0 || rewardInfo[1].userReward > 0 ? (
                <RowBetween style={{ alignItems: 'flex-start' }}>
                  <Text>{t('claimableRewards')}</Text>
                  <Text style={{ textAlign: 'end' }}>
                    {rewardInfo[0].userReward > 0 && (
                      <div>
                        {numberToSignificant(rewardInfo[0].userReward)} {rewardInfo[0].symbol}
                      </div>
                    )}
                    {rewardInfo[1].userReward > 0 && (
                      <div>
                        {numberToSignificant(rewardInfo[1].userReward)} {rewardInfo[1].symbol}
                      </div>
                    )}
                  </Text>
                </RowBetween>
              ) : (
                <>
                  {userBalance > 0 && (
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
                    onClick={() => {
                      claimRewards(values.rewardsAddress)
                    }}
                    width="48%"
                    style={{ marginInlineEnd: '1%' }}
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
              {userBalance > 0 && !my && !isInactive && (
                <RowBetween marginTop="10px">
                  <ButtonSecondary
                    onClick={() => {
                      unstakeAndClaimRewards(values.rewardsAddress)
                    }}
                    width="100%"
                    style={{ marginInlineEnd: '1%' }}
                  >
                    {t('unstakeAndClaim')}
                  </ButtonSecondary>
                </RowBetween>
              )}
              {!my && !isInactive && (
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
