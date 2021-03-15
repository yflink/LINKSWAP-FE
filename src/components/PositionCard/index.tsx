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
import { ButtonSecondary } from '../Button'
import Card, { GreyCard } from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween, RowFixed } from '../Row'
import { Dots } from '../swap/styleds'
import { useTranslation } from 'react-i18next'
import { ACTIVE_REWARD_POOLS } from '../../constants'
import { StakeSVG } from '../SVG'
import { getContract } from '../../utils'
import { LINKSWAPLPToken } from '../../components/ABI'
import { BigNumber } from '@ethersproject/bignumber'
import hexStringToNumber from '../../utils/hexStringToNumber'
import { useGetLPTokenPrices } from '../../state/price/hooks'
import { numberToUsd } from '../../utils/numberUtils'
import { getNetworkLibrary } from '../../connectors'

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
  border-radius: ${({ theme }) => theme.borderRadius};
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

export const ExternalButton = styled.a`
  background: ${({ theme }) => theme.buttonSecondaryBG};
  color: ${({ theme }) => theme.buttonSecondaryTextColor};
  font-size: 16px;
  border-radius: ${({ theme }) => theme.borderRadius};
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
                  <Text fontWeight={500} fontSize={16}>
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
                <Text fontWeight={500} fontSize={16}>
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
                        <Text fontSize={16} fontWeight={500}>
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
                        <Text fontSize={16} fontWeight={500}>
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
              <Text fontWeight={500} fontSize={16}>
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
                <Text fontWeight={500} fontSize={16}>
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
              <Text fontWeight={500} fontSize={16}>
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
