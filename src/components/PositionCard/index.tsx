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
import { ACTIVE_REWARD_POOLS, sYFL } from '../../constants'
import { StakeSVG } from '../SVG'
import { calculateGasMargin, getContract } from '../../utils'
import { LINKSWAPLPToken, StakingRewards, syflPool } from '../../pages/Stake/stakingAbi'
import { BigNumber } from '@ethersproject/bignumber'
import hexStringToNumber from '../../utils/hexStringToNumber'
import { useGetLPTokenPrices, useGetTokenPrices } from '../../state/price/hooks'
import { numberToUsd, numberToPercent, numberToSignificant } from '../../utils/numberUtils'
import { getNetworkLibrary } from '../../connectors'
import { useWalletModalToggle } from '../../state/application/hooks'
import { TransactionResponse } from '@ethersproject/providers'
import ReactGA from 'react-ga'
import { useTransactionAdder } from '../../state/transactions/hooks'
import positionInformation from './positionInformation'

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
  background: ${({ theme }) => theme.appBoxBG};
  border: 1px solid ${({ theme }) => theme.appBoxBG};
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.textTertiary)};
  }
`

const StakingCard = styled(Card)<{ highlight?: boolean; show?: boolean; uniswap?: boolean }>`
  font-size: 14px;
  line-height: 18px;
  background: ${({ theme }) => theme.appBoxBG};
  border: 1px solid
    ${({ theme, highlight, uniswap }) => (uniswap ? '#ff007b' : highlight ? theme.textHighlight : theme.appBoxBG)};
  :hover {
    border: 1px solid
      ${({ theme, highlight, show }) => (highlight ? theme.textHighlight : show ? theme.appBoxBG : theme.textTertiary)};
  }
`

export const ExternalButton = styled.a`
  background: ${({ theme }) => theme.buttonSecondaryBG};
  color: ${({ theme }) => theme.buttonSecondaryTextColor};
  font-size: 16px;
  border-radius: 6px;
  padding: 10px;
  width: 100%;
  text-decoration: none;
  text-align: center;

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.buttonSecondaryBorderHover};
    background: ${({ theme }) => theme.buttonSecondaryBGHover};
    color: ${({ theme }) => theme.buttonSecondaryTextColorHover};
  }
  &:hover {
    background: ${({ theme }) => theme.buttonSecondaryBGHover};
    color: ${({ theme }) => theme.buttonSecondaryTextColorHover};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.buttonSecondaryBorderActive};
    background: ${({ theme }) => theme.buttonSecondaryBGActive};
    color: ${({ theme }) => theme.buttonSecondaryTextColorActive};
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
  let currencyA = currency0
  let currencyB = currency1
  switch (currency1?.symbol) {
    case 'LINK':
      currencyA = currency1
      currencyB = currency0
      break

    case 'ETH':
      if (currencyA?.symbol !== 'LINK') {
        currencyA = currency1
        currencyB = currency0
      }
      break

    case 'YFLUSD':
      if (currencyA?.symbol !== 'LINK' && currencyA?.symbol !== 'ETH') {
        currencyA = currency1
        currencyB = currency0
      }
      break
  }

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
                <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin={true} size={22} />
                {!currency0 || !currency1 ? (
                  <Text fontWeight={500} fontSize={20}>
                    <Dots>{t('loading')}</Dots>
                  </Text>
                ) : (
                  <div style={{ display: 'flex' }}>
                    <p style={{ fontWeight: 500, fontSize: 18 }}>{currencyA.symbol}</p>
                    <p style={{ fontWeight: 100, fontSize: 18, margin: '18px 8px 0px 8px' }}> | </p>
                    <p style={{ fontWeight: 500, fontSize: 18 }}>{currencyB.symbol}</p>
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

  const stakePoolTotalLiq = lpTokenPrices ? (lpTokenPrices[id] ? lpTokenPrices[id].totalLiq : 0) : 0
  const lpTokenPrice = stakePoolTotalLiq && totalLPSupply > 0 ? stakePoolTotalLiq / totalLPSupply : 0
  const userShareFactor = lpTokenPrice && poolTokenPercentage ? Number(poolTokenPercentage.toFixed(10)) / 100 : 0
  const userShareUsd = userShareFactor > 0 && stakePoolTotalLiq > 0 ? stakePoolTotalLiq * userShareFactor : 0

  let rewards = false
  let currencyA = currency0
  let currencyB = currency1

  ACTIVE_REWARD_POOLS.forEach((pool: any) => {
    if (pool.address === liquidityToken.address) {
      rewards = true
    }
  })
  switch (currency1?.symbol) {
    case 'LINK':
      currencyA = currency1
      currencyB = currency0
      break

    case 'ETH':
      if (currencyA?.symbol !== 'LINK') {
        currencyA = currency1
        currencyB = currency0
      }
      break

    case 'YFLUSD':
      if (currencyA?.symbol !== 'LINK' && currencyA?.symbol !== 'ETH') {
        currencyA = currency1
        currencyB = currency0
      }
      break
  }

  return (
    <HoverCard border={border}>
      <AutoColumn gap="12px">
        <FixedHeightRow onClick={() => setShowMore(!showMore)} style={{ cursor: 'pointer' }}>
          <RowFixed style={{ position: 'relative' }}>
            <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin={true} size={22} />
            {!currency0 || !currency1 ? (
              <Text fontWeight={500} fontSize={20}>
                <Dots>{t('loading')}</Dots>
              </Text>
            ) : (
              <div style={{ display: 'flex' }}>
                <p style={{ fontWeight: 500, fontSize: 18 }}>{currencyA.symbol}</p>
                <p style={{ fontWeight: 100, fontSize: 18, margin: '18px 8px 0px 8px' }}> | </p>
                <p style={{ fontWeight: 500, fontSize: 18 }}>{currencyB.symbol}</p>
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
              <ButtonSecondary as={Link} to={`/add/${currencyId(currencyA)}/${currencyId(currencyB)}`} width="48%">
                {t('add')}
              </ButtonSecondary>
              <ButtonSecondary as={Link} width="48%" to={`/remove/${currencyId(currencyA)}/${currencyId(currencyB)}`}>
                {t('remove')}
              </ButtonSecondary>
            </RowBetween>
            {rewards && (
              <RowBetween marginTop="10px">
                <ButtonSecondary as={Link} width="100%" to={`/stake/${currencyId(currencyA)}/${currencyId(currencyB)}`}>
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
  const { tokenPrices } = useGetTokenPrices()
  const { lpTokenPrices } = useGetLPTokenPrices()
  const [showMore, setShowMore] = useState(show)
  const [fetching, setFetching] = useState(false)
  const { t } = useTranslation()
  const currency0 = unwrappedToken(values.tokens[0])
  const currency1 = unwrappedToken(values.tokens[1])
  const toggleWalletModal = useWalletModalToggle()
  const headerRowStyles = show ? 'defaut' : 'pointer'
  const addTransaction = useTransactionAdder()
  const apy = 0
  let currencyA = currency0
  let currencyB = currency1
  const isYFLUSD =
    values.liquidityToken.address === '0x195734d862DFb5380eeDa0ACD8acf697eA95D370' ||
    values.liquidityToken.address === '0x6cD7817e6f3f52123df529E1eDF5830240Ce48c1'
  const [information, setInformation] = useState<any>(false)
  if (!fetching || !account || !tokenPrices || !lpTokenPrices) {
    positionInformation(values, account, chainId, library, tokenPrices, lpTokenPrices).then(result => {
      setInformation(result)
      console.log(result)
    })
    setFetching(true)
  }

  async function claimRewards(rewardsContractAddress: string) {
    if (!chainId || !library || !account || !information) return
    const isDefault = information.poolType !== 'syflPool'
    const router = getContract(rewardsContractAddress, information.abi, library, account)
    const estimate = isDefault ? router.estimateGas.claimRewards : router.estimateGas.getReward
    const method: () => Promise<TransactionResponse> = isDefault ? router.claimRewards : router.getReward

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
    if (!chainId || !library || !account || !information) return
    const isDefault = information.poolType !== 'syflPool'
    const router = getContract(rewardsContractAddress, information.abi, library, account)
    const estimate = isDefault ? router.estimateGas.unstakeAndClaimRewards : router.estimateGas.exit
    const method: (...args: any) => Promise<TransactionResponse> = isDefault
      ? router.unstakeAndClaimRewards
      : router.exit
    const args: Array<string> = isDefault ? [information.rawUserBalance] : []

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

  switch (currency1?.symbol) {
    case 'LINK':
      currencyA = currency1
      currencyB = currency0
      break

    case 'ETH':
      if (currencyA?.symbol !== 'LINK') {
        currencyA = currency1
        currencyB = currency0
      }
      break

    case 'YFLUSD':
      if (currencyA?.symbol !== 'LINK' && currencyA?.symbol !== 'ETH') {
        currencyA = currency1
        currencyB = currency0
      }
      break
  }

  if (!information) {
    return <></>
  } else if (
    (information.userBalance === 0 && showOwn) ||
    (information.isInactive && !showExpired) ||
    (!information.isInactive && showExpired)
  ) {
    return <></>
  } else {
    return (
      <StakingCard highlight={information.userBalance > 0 && !my} show={show} uniswap={information.poolType === 'uni'}>
        <AutoColumn gap="12px">
          <FixedHeightRow
            onClick={() => {
              if (!show) {
                setShowMore(!showMore)
              }
            }}
            style={{ cursor: headerRowStyles, position: 'relative' }}
          >
            {!my && !information.isInactive && (
              <div style={{ position: 'absolute', right: '-13px', top: '-16px', fontSize: '12px' }}>
                {information.apy > 0 ? (
                  <p style={{ margin: 0 }}>{t('apy', { apy: numberToPercent(apy) })}</p>
                ) : (
                  <Dots>{t('loading')}</Dots>
                )}
              </div>
            )}
            <RowFixed>
              <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin={true} size={22} />
              {!currency0 || !currency1 ? (
                <Text fontWeight={500} fontSize={20}>
                  <Dots>{t('loading')}</Dots>
                </Text>
              ) : (
                <div style={{ display: 'flex', position: 'relative' }}>
                  <p style={{ fontWeight: 500, fontSize: 18, margin: '0 4px' }}>{currencyA.symbol}</p>
                  <p style={{ fontWeight: 100, fontSize: 18, margin: '0 4px' }}> | </p>
                  <p style={{ fontWeight: 500, fontSize: 18, margin: '0 4px' }}>{currencyB.symbol}</p>
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
              {information.userBalance > 0 && (
                <RowBetween>
                  <Text>{t('stakedTokenAmount')}</Text>
                  {numberToSignificant(information.userBalance)}
                </RowBetween>
              )}
              {information.userBalance > 0 && information.userShare > 0 && information.userShareUsd > 0 && (
                <RowBetween>
                  <Text>{t('yourPoolShare')}</Text>
                  {numberToUsd(information.userShareUsd)} ({numberToPercent(information.userShare)})
                </RowBetween>
              )}
              {information.rewardInfo[0].userReward > 0 || information.rewardInfo[1].userReward > 0 ? (
                <RowBetween style={{ alignItems: 'flex-start' }}>
                  <Text>{t('claimableRewards')}</Text>
                  <Text style={{ textAlign: 'end' }}>
                    {information.rewardInfo[0].userReward > 0 && (
                      <div>
                        {numberToSignificant(information.rewardInfo[0].userReward)} {information.rewardInfo[0].symbol}
                      </div>
                    )}
                    {information.rewardInfo[1].userReward > 0 && (
                      <div>
                        {numberToSignificant(information.rewardInfo[1].userReward)} {information.rewardInfo[1].symbol}
                      </div>
                    )}
                  </Text>
                </RowBetween>
              ) : (
                <>
                  {information.userBalance > 0 && (
                    <RowBetween style={{ alignItems: 'flex-start' }}>
                      <Text>{t('claimableRewards')}</Text>
                      <Dots>{t('loading')}</Dots>
                    </RowBetween>
                  )}
                </>
              )}
              {my && !show && (
                <RowBetween marginTop="10px">
                  <>
                    {information.poolType === 'uni' ? (
                      <ButtonSecondary
                        as={Link}
                        width="100%"
                        to={`/stake/UNI/${values.tokens[0].symbol}${values.tokens[1].symbol}`}
                      >
                        {t('stake')}
                      </ButtonSecondary>
                    ) : (
                      <ButtonSecondary
                        as={Link}
                        width="100%"
                        to={`/stake/${currencyId(currency0)}/${currencyId(currency1)}`}
                      >
                        {t('stake')}
                      </ButtonSecondary>
                    )}
                  </>
                </RowBetween>
              )}
              <RowBetween>
                <Text style={{ margin: '12px 0 0' }} fontSize="16px" fontWeight={600}>
                  {t('stakePoolStats')}
                </Text>
              </RowBetween>
              {information.stakePoolTotalLiq > 0 && (
                <RowBetween style={{ alignItems: 'flex-start' }}>
                  <Text>{t('stakePoolTotalLiq')}</Text>
                  <Text>{numberToUsd(information.stakePoolTotalLiq)}</Text>
                </RowBetween>
              )}
              {information.stakePoolTotalDeposited > 0 && (
                <RowBetween style={{ alignItems: 'flex-start' }}>
                  <Text>{t('stakePoolTotalDeposited')}</Text>
                  <Text>{numberToUsd(information.stakePoolTotalDeposited)}</Text>
                </RowBetween>
              )}
              {information.rewardInfo.length > 0 && !information.isInactive && (
                <RowBetween style={{ alignItems: 'flex-start' }}>
                  <Text>{t('stakePoolRewards')}</Text>
                  <Text style={{ textAlign: 'end' }}>
                    {information.rewardInfo[0]['rate'] > 0 && (
                      <div>
                        {t('stakeRewardPerDay', {
                          rate: information.rewardInfo[0].rate,
                          currencySymbol: information.rewardInfo[0].symbol
                        })}
                      </div>
                    )}
                    {information.rewardInfo.length > 1 && information.rewardInfo[1]['rate'] > 0 && (
                      <div style={{ textAlign: 'end' }}>
                        {t('stakeRewardPerDay', {
                          rate: information.rewardInfo[1].rate,
                          currencySymbol: information.rewardInfo[1].symbol
                        })}
                      </div>
                    )}
                    {apy > 0 && !information.isInactive && (
                      <div style={{ textAlign: 'end', marginTop: '8px' }}>
                        {t('apy', { apy: numberToPercent(apy) })}
                      </div>
                    )}
                  </Text>
                </RowBetween>
              )}
              <RowBetween>
                <Text>{t('timeRemaining')}</Text>
                {information.poolType === 'syflPool' && isYFLUSD ? (
                  <Countdown ends={information.periodFinish} format="DD[d] HH[h] mm[m] ss[s]" string="emissionDropIn" />
                ) : (
                  <Countdown ends={information.periodFinish} format="DD[d] HH[h] mm[m] ss[s]" string="endsIn" />
                )}
              </RowBetween>
              {information.userBalance > 0 && !my && !information.isInactive && (
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
                  <>
                    {information.poolType === 'uni' ? (
                      <ButtonSecondary
                        as={Link}
                        width="48%"
                        to={`/unstake/UNI/${values.tokens[0].symbol}${values.tokens[1].symbol}`}
                      >
                        {t('unstake')}
                      </ButtonSecondary>
                    ) : (
                      <ButtonSecondary
                        as={Link}
                        width="48%"
                        style={{ marginInlineStart: '1%' }}
                        to={`/unstake/${currencyId(currency0)}/${currencyId(currency1)}`}
                      >
                        {t('unstake')}
                      </ButtonSecondary>
                    )}
                  </>
                </RowBetween>
              )}
              {information.userBalance > 0 && !my && (
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
              {!my && !information.isInactive && (
                <RowBetween marginTop="10px">
                  {!account ? (
                    <ButtonLight onClick={toggleWalletModal}>{t('connectWallet')}</ButtonLight>
                  ) : (
                    <>
                      {information.poolType === 'uni' ? (
                        <ExternalButton target="_blank" href={values.liquidityUrl}>
                          {t('addLiquidity')}
                        </ExternalButton>
                      ) : (
                        <ButtonSecondary
                          as={Link}
                          to={`/add/${currencyId(currencyA)}/${currencyId(currencyB)}`}
                          width="100%"
                        >
                          {t('addLiquidity')}
                        </ButtonSecondary>
                      )}
                    </>
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
