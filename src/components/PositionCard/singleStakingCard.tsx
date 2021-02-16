import { useActiveWeb3React } from '../../hooks'
import { useGetTokenPrices } from '../../state/price/hooks'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { StakingRewards } from '../../components/ABI'
import positionInformation from './positionInformation'
import hexStringToNumber from '../../utils/hexStringToNumber'
import { AutoColumn } from '../Column'
import { numberToPercent, numberToSignificant, numberToUsd } from '../../utils/numberUtils'
import { Dots } from '../swap/styleds'
import { RowBetween, RowFixed } from '../Row'
import { SingleCurrencyLogo } from '../DoubleLogo'
import { Text } from 'rebass'
import { ChevronDown, ChevronUp } from 'react-feather'
import { ButtonSecondary } from '../Button'
import { currencyId } from '../../utils/currencyId'
import Countdown from '../Countdown'
import { ExternalButton, FixedHeightRow } from './index'
import styled, { ThemeContext } from 'styled-components'
import Card, { LightCard } from '../Card'
import { YFLSVG, MPHSVG } from '../SVG'
import { TYPE } from '../../theme'
import { Link } from 'react-router-dom'

const FullStakingCard = styled(Card)<{ highlight?: boolean; show?: boolean }>`
  font-size: 14px;
  line-height: 18px;
  background: ${({ theme }) => theme.appBoxBG};
  border: 1px solid ${({ theme, highlight }) => (highlight ? theme.textHighlight : theme.appBoxBG)};
  :hover {
    border: 1px solid
      ${({ theme, highlight, show }) => (highlight ? theme.textHighlight : show ? theme.appBoxBG : theme.textTertiary)};
  }
  position: relative;
`

const PlatformIcon = styled.div`
  position: absolute;
  opacity: 0.1;
  height: 40px;
  width: 40px;
  left: 230px;
  top: 12px;

  & svg {
    height: 40px;
    width: 40px;
    fill: ${({ theme }) => theme.textPrimary};
  }
`

const ExternalLink = styled.a`
  color: ${({ theme }) => theme.textPrimary};
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`

export default function SingleStakingCard({
  values,
  my,
  show,
  showOwn,
  showExpired,
  index
}: {
  values: any
  my: boolean
  show?: boolean | false
  showOwn?: boolean | false
  showExpired?: boolean | true
  index: number
}) {
  const theme = useContext(ThemeContext)
  const { account, chainId, library } = useActiveWeb3React()
  const { tokenPrices } = useGetTokenPrices()
  const [showMore, setShowMore] = useState(show)
  const { t } = useTranslation()
  const currency0 = unwrappedToken(values.tokens[0])
  const headerRowStyles = show ? 'defaut' : 'pointer'
  const fakeAccount = '0x0000000000000000000000000000000000000000'
  const [lifeLine, setLifeLine] = useState(false)
  const currencyA = currency0
  const [information, setInformation] = useState<any>({
    poolReserves: [0, 0],
    poolTokenPrices: [0, 0],
    userBalanceRaw: '0x00',
    userBalance: 0,
    userRewards: ['', ''],
    periodFinish: 0,
    rewardTokens: ['', ''],
    rewardTokenRates: ['0', '0'],
    totalSupply: 0,
    totalLPSupply: 0,
    poolType: values.type,
    apy: 0,
    userShare: 0,
    lpTokenPrice: 0,
    stakePoolTotalDeposited: 0,
    stakePoolTotalLiq: 0,
    userShareUsd: 0,
    isInactive: true,
    updated: false,
    abi: StakingRewards,
    rewardInfo: [
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
  })
  const [fetching, setFetching] = useState(false)

  if (!fetching) {
    if (!!tokenPrices) {
      setFetching(true)
      if (!information.updated) {
        positionInformation(values, account, chainId, library, tokenPrices, information).then(result => {
          setInformation(result)
        })
      }
    }
  }

  if (tokenPrices && information.apy === 0) {
    const token0id = values.tokens[0].address.toLowerCase()
    if (tokenPrices[token0id]) {
      information.poolTokenPrices[0] = Number(tokenPrices[token0id].price)
    }
  }

  if (information.updated && information.apy === 0) {
    if (information.rewardTokens[0] !== '' && information.rewardTokens[1] !== '' && tokenPrices) {
      const token0Address = information.rewardTokens[0].toLowerCase()
      const token1Address = information.rewardTokens[1].toLowerCase()

      if (tokenPrices[token0Address]) {
        information.rewardInfo[0].address = token0Address
        information.rewardInfo[0].decimals = tokenPrices[token0Address].decimals
        information.rewardInfo[0].symbol = tokenPrices[token0Address].symbol
        information.rewardInfo[0].price = tokenPrices[token0Address].price
      } else {
        if (token0Address !== fakeAccount) {
          if (values.tokens[0].address.toLowerCase() === token0Address && information.poolTokenPrices[0] !== 0) {
            information.rewardInfo[0].address = values.tokens[0].address
            information.rewardInfo[0].decimals = values.tokens[0].decimals
            information.rewardInfo[0].symbol = values.tokens[0].symbol
            information.rewardInfo[0].price = information.poolTokenPrices[0]
          }
          if (values.tokens[1].address.toLowerCase() === token0Address && information.poolTokenPrices[1] !== 0) {
            information.rewardInfo[0].address = values.tokens[1].address
            information.rewardInfo[0].decimals = values.tokens[1].decimals
            information.rewardInfo[0].symbol = values.tokens[1].symbol
            information.rewardInfo[0].price = information.poolTokenPrices[1]
          }
        }
      }

      if (information.rewardTokenRates[0] && information.rewardInfo[0].decimals) {
        information.rewardInfo[0].rate = hexStringToNumber(
          information.rewardTokenRates[0],
          information.rewardInfo[0].decimals,
          2,
          true
        )
      }

      if (tokenPrices[token1Address]) {
        information.rewardInfo[1].address = token1Address
        information.rewardInfo[1].decimals = tokenPrices[token1Address].decimals
        information.rewardInfo[1].symbol = tokenPrices[token1Address].symbol
        information.rewardInfo[1].price = tokenPrices[token1Address].price
      } else {
        if (token1Address !== fakeAccount) {
          if (values.tokens[0].address.toLowerCase() === token1Address && information.poolTokenPrices[0] !== 0) {
            information.rewardInfo[1].address = values.tokens[0].address
            information.rewardInfo[1].decimals = values.tokens[0].decimals
            information.rewardInfo[1].symbol = values.tokens[0].symbol
            information.rewardInfo[1].price = information.poolTokenPrices[0]
          }
          if (values.tokens[1].address.toLowerCase() === token1Address && information.poolTokenPrices[1] !== 0) {
            information.rewardInfo[1].address = values.tokens[1].address
            information.rewardInfo[1].decimals = values.tokens[1].decimals
            information.rewardInfo[1].symbol = values.tokens[1].symbol
            information.rewardInfo[1].price = information.poolTokenPrices[1]
          }
        }
      }

      if (information.rewardTokenRates[1] && information.rewardInfo[1].decimals) {
        information.rewardInfo[1].rate = hexStringToNumber(
          information.rewardTokenRates[1],
          information.rewardInfo[1].decimals,
          2,
          true
        )
      }
    }

    information.stakePoolTotalDeposited = information.totalSupply * information.poolTokenPrices[0]

    if (tokenPrices && information.stakePoolTotalDeposited) {
      let totalDailyRewardValue = 0
      if (information.rewardInfo[0].rate > 0) {
        const dailyToken0Value = information.rewardInfo[0].rate * information.rewardInfo[0].price
        if (dailyToken0Value > 0) {
          totalDailyRewardValue += dailyToken0Value
        }
      }

      if (information.rewardInfo[1].rate > 0) {
        const dailyToken1Value = information.rewardInfo[1].rate * information.rewardInfo[1].price
        if (dailyToken1Value > 0) {
          totalDailyRewardValue += dailyToken1Value
        }
      }

      if (!!information.totalSupply) {
        const yearlyRewardsValue = totalDailyRewardValue * 365
        const perDepositedDollarYearlyReward = yearlyRewardsValue / information.stakePoolTotalDeposited
        information.apy = perDepositedDollarYearlyReward * 100
      }
    }
  }
  if (information.userRewards[0] !== '') {
    information.rewardInfo[0].userReward = hexStringToNumber(
      information.userRewards[0],
      information.rewardInfo[0].decimals
    )
  }
  if (information.userRewards[1] !== '') {
    information.rewardInfo[1].userReward = hexStringToNumber(
      information.userRewards[1],
      information.rewardInfo[1].decimals
    )
  }

  if (information.userBalance > 0 && information.userShareUsd === 0) {
    information.userShare =
      information.totalSupply > 0 && information.userBalance > 0
        ? information.userBalance / (information.totalSupply / 100)
        : 0

    information.userShareUsd =
      information.lpTokenPrice && information.userBalance ? information.userBalance * information.lpTokenPrice : 0
  }

  if (!lifeLine) {
    if (
      (information.userBalance === 0 && showOwn) ||
      (information.isInactive && !showExpired) ||
      (!information.isInactive && showExpired)
    ) {
      setTimeout(() => setLifeLine(true), 2000)
    }
  }

  if (information.userBalance === 0 && showOwn) {
    return (
      <>
        {index === 0 && (
          <LightCard padding="40px">
            <TYPE.body color={theme.textPrimary} textAlign="center">
              <Dots>{t('loading')}</Dots>
            </TYPE.body>
          </LightCard>
        )}
      </>
    )
  } else {
    return (
      <FullStakingCard highlight={information.userBalance > 0 && !my} show={show}>
        {information.poolType === 'mph88' ? (
          <PlatformIcon>
            <MPHSVG />
          </PlatformIcon>
        ) : (
          <PlatformIcon>
            <YFLSVG />
          </PlatformIcon>
        )}
        <AutoColumn gap="12px">
          <FixedHeightRow
            onClick={() => {
              if (!show) {
                setShowMore(!showMore)
              }
            }}
            style={{ cursor: headerRowStyles, position: 'relative' }}
          >
            {!my && !information.isInactive && information.updated && (
              <div style={{ position: 'absolute', right: '-13px', top: '-16px', fontSize: '12px' }}>
                {information.apy > 0 ? (
                  <p style={{ margin: 0 }}>{t('apy', { apy: numberToPercent(information.apy) })}</p>
                ) : (
                  <Dots>{t('loading')}</Dots>
                )}
              </div>
            )}
            <RowFixed>
              <SingleCurrencyLogo currency0={currencyA} margin={true} size={22} />

              <div style={{ display: 'flex', position: 'relative' }}>
                <p style={{ fontWeight: 500, fontSize: 18, margin: '0 4px' }}>{currencyA.symbol}</p>
              </div>
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
              {information.poolType === 'mph88' && (
                <RowBetween>
                  <Text style={{ margin: '0 0 12px' }} fontSize="16px">
                    Vault hosted by:{' '}
                    <ExternalLink href="https://88mph.app/" target="_blank">
                      88mph
                    </ExternalLink>
                  </Text>
                </RowBetween>
              )}

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
              {information.userShareUsd > 0 && (
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
              {my && !show ? (
                <RowBetween marginTop="10px">
                  <>
                    {information.poolType === 'mph88' ? (
                      <ButtonSecondary as={Link} width="100%" to={`/stake/mph88/${values.tokens[0].symbol}`}>
                        {t('stake')}
                      </ButtonSecondary>
                    ) : (
                      <ButtonSecondary as={Link} width="100%" to={`/stake/single/${currencyId(currency0)}`}>
                        {t('stake')}
                      </ButtonSecondary>
                    )}
                  </>
                </RowBetween>
              ) : (
                <RowBetween marginTop="10px">
                  <>
                    {information.poolType === 'mph88' ? (
                      <ExternalButton href={values.liquidityUrl}>
                        {t('getToken', { currencySymbol: currency0.symbol })}
                      </ExternalButton>
                    ) : (
                      <ButtonSecondary as={Link} width="100%" to={`/swap/?outputCurrency=${currencyId(currency0)}`}>
                        {t('getToken', { currencySymbol: currency0.symbol })}
                      </ButtonSecondary>
                    )}
                  </>
                </RowBetween>
              )}
              {!information.infinitePeriod && (
                <>
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
                        {information.apy > 0 && !information.isInactive && (
                          <div style={{ textAlign: 'end', marginTop: '8px' }}>
                            {t('apy', { apy: numberToPercent(information.apy) })}
                          </div>
                        )}
                      </Text>
                    </RowBetween>
                  )}
                  <RowBetween>
                    <Text>{t('timeRemaining')}</Text>
                    <Countdown ends={information.periodFinish} format="DD[d] HH[h] mm[m] ss[s]" string="endsIn" />
                  </RowBetween>
                </>
              )}
            </AutoColumn>
          )}
        </AutoColumn>
      </FullStakingCard>
    )
  }
}
