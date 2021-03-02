import React, { useContext, useState } from 'react'
import { Text } from 'rebass'
import Card, { BlueCard } from '../../components/Card'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import AppBody from '../AppBody'
import styled, { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import Question from '../../components/QuestionHelper'
import { useNavigationActiveItemManager } from '../../state/navigation/hooks'
import { numberToSignificant, numberToUsd } from '../../utils/numberUtils'
import { ButtonLight, ButtonSecondary } from '../../components/Button'
import { Link } from 'react-router-dom'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { YFL, yYFL } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import Loader from '../../components/Loader'
import { getContract } from '../../utils'
import { governancePool } from '../../components/ABI'
import { ETH_API_KEYS, getNetworkLibrary } from '../../connectors'
import hexStringToNumber from '../../utils/hexStringToNumber'
import { BigNumber } from 'ethers'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useGetPriceBase } from '../../state/price/hooks'
import moment from 'moment'
import Countdown from '../../components/Countdown'

const GovernanceBalance = styled.div`
  display: flex;
  flex: 0 0 100%;
  margin: 0 0 24px;
  font-size: 14px;

  div {
    align-items: flex-start;
  }

  p {
    line-height: 1.4;
  }
`

const UserBalance = styled.div`
  display: flex;
  flex: 0 0 100%;
  margin: 0 0 12px;
  font-size: 14px;

  div {
    align-items: flex-start;
  }

  p {
    line-height: 1.4;
  }
`

const Title = styled.p`
  font-size: 18px;
  margin: 12px 0 0;
  font-weight: 700;
`

const BalanceText = styled.p`
  margin: 0;
  text-align: right;
`

async function getGovBalance() {
  try {
    const response = await fetch('https://api.thegraph.com/subgraphs/name/yflink/linkswap-v1', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `{
          user(id: "0x0389d755c1833c9b350d4e8b619eae16defc1cba") {
          liquidityPositions {
            id
            liquidityTokenBalance
            pair {
              id
              totalSupply
              reserveUSD
            }
          }
        }
      }`,
        variables: null
      }),
      method: 'POST'
    })

    if (response.ok) {
      const { data } = await response.json()
      return data.user.liquidityPositions
    } else {
      return []
    }
  } catch (e) {
    console.log(e)
    return []
  }
}

async function getBlockCountDown(targetBlock: number) {
  const ethAPIKey = ETH_API_KEYS[Math.floor(Math.random() * ETH_API_KEYS.length)]
  try {
    const url = `https://api.etherscan.io/api?module=block&action=getblockcountdown&blockno=${targetBlock}&apikey=${ethAPIKey}`
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    if (response.ok) {
      const content = await response.json()
      if (content.status === '0') {
        return 0
      } else {
        return content.result.EstimateTimeInSec
      }
    }
  } catch (e) {
    console.log(e)
  }
}

export default function StakeGovernance() {
  const { account } = useActiveWeb3React()
  const fakeAccount = '0x0000000000000000000000000000000000000000'
  const fakeLibrary = getNetworkLibrary()
  const governanceAddress = '0x75D1aA733920b14fC74c9F6e6faB7ac1EcE8482E'
  const theme = useContext(ThemeContext)
  const [govBalanceFetching, setGovBalanceFetching] = useState(false)
  const [govBalance, setGovBalance] = useState(0)
  const [yyflPrice, setYyflPrice] = useState(0)
  const toggleWalletModal = useWalletModalToggle()
  const { t } = useTranslation()
  const newActive = useNavigationActiveItemManager()
  newActive('stake-governance')
  const [userBalances, fetchingUserBalances] = useTokenBalancesWithLoadingIndicator(account ?? undefined, [YFL, yYFL])
  const [govBalances, fetchingGovBalances] = useTokenBalancesWithLoadingIndicator(governanceAddress ?? undefined, [YFL])
  const [feeCountdownFetched, setFeeCountdownFetched] = useState(false)
  const [feeCountdown, setFeeCountdown] = useState(0)
  const govContract = getContract(governanceAddress, governancePool, fakeLibrary, fakeAccount)
  const priceObject = useGetPriceBase()
  const yflPriceUsd = priceObject ? priceObject['yflPriceBase'] : 0
  const yyflPriceUsd = priceObject && yyflPrice !== 0 ? priceObject['yflPriceBase'] * yyflPrice : 0
  const now = moment().unix()

  if (!govBalanceFetching && govBalance === 0) {
    setGovBalanceFetching(true)

    if (account) {
      const earlyWithdrawalFeeExpiryMethod: (...args: any) => Promise<BigNumber> = govContract.earlyWithdrawalFeeExpiry
      const args: Array<string> = [account]
      earlyWithdrawalFeeExpiryMethod(...args).then(response => {
        getBlockCountDown(hexStringToNumber(response.toHexString(), 0)).then(countdown => {
          setFeeCountdown(now + Math.ceil(countdown))
          setFeeCountdownFetched(true)
        })
      })
    }

    const getPricePerFullShareMethod: (...args: any) => Promise<BigNumber> = govContract.getPricePerFullShare
    getPricePerFullShareMethod().then(response => {
      setYyflPrice(hexStringToNumber(response.toHexString(), yYFL.decimals))
    })

    getGovBalance().then(result => {
      let govLpUsdBalance = 0
      if (result.length > 0) {
        result.forEach(function(pool: Record<string, any>) {
          const totalBalance = pool.liquidityTokenBalance
          const totalSupply = pool.pair.totalSupply
          const totalLiquidity = pool.pair.reserveUSD
          const lpPrice = Number(totalLiquidity) / Number(totalSupply)
          const positionBalance = Number(totalBalance) * lpPrice
          govLpUsdBalance += positionBalance
        })
        setGovBalance(govLpUsdBalance)
      }
    })
  }

  return (
    <>
      <Card style={{ maxWidth: '420px', padding: '12px', backgroundColor: theme.navigationBG, marginBottom: '16px' }}>
        <SwapPoolTabs active={'stake'} />
      </Card>
      <AppBody>
        <AutoColumn gap={'12px'}>
          <RowBetween>
            <Text color={theme.textPrimary} fontWeight={500}>
              {t('stakeGovernance')}
            </Text>
            <Question text={t('stakeGovernanceDescription')} />
          </RowBetween>
        </AutoColumn>
        <BlueCard style={{ margin: '12px 0' }}>
          <Text textAlign="center" fontSize={12} fontWeight={400}>
            {t('stakeGovernanceBalance')}
          </Text>
          <Text textAlign="center" fontSize={30} fontWeight={700}>
            {numberToUsd(govBalance)}
          </Text>
        </BlueCard>
        <GovernanceBalance>
          <AutoColumn gap={'12px'} style={{ width: '100%' }}>
            <Title>{t('stakeGovernanceStatistics')}</Title>
            <RowBetween>
              <Text>{t('stakedCurrency', { currencySymbol: YFL.symbol })}:</Text>
              {fetchingGovBalances ? (
                <Loader />
              ) : (
                <BalanceText>
                  {govBalances[YFL.address]?.toSignificant(8) + ' ' + YFL.symbol}
                  <br />
                  {numberToUsd(Number(govBalances[YFL.address]?.toSignificant(8)) * yflPriceUsd)}
                </BalanceText>
              )}
            </RowBetween>
            <RowBetween>
              <Text>{t('currencyPrice', { currencySymbol: yYFL.symbol })}:</Text>
              {yyflPrice === 0 ? (
                <Loader />
              ) : (
                <BalanceText>
                  {numberToSignificant(yyflPrice, 6) + ' ' + YFL.symbol}
                  <br />
                  {numberToUsd(yyflPriceUsd)}
                </BalanceText>
              )}
            </RowBetween>
          </AutoColumn>
        </GovernanceBalance>
        {account ? (
          <>
            <UserBalance>
              <AutoColumn gap={'12px'} style={{ width: '100%' }}>
                <Title>{t('stakeGovernanceStake')}</Title>
                <BlueCard style={{ margin: '0 0 12px' }}>
                  <Text fontSize="14px">{t('stakeGovernanceStakeDescription')}</Text>
                </BlueCard>
                <RowBetween>
                  <Text>{t('yourCurrencyBalance', { currencySymbol: YFL.symbol })}:</Text>
                  {fetchingUserBalances ? (
                    <Loader />
                  ) : (
                    <BalanceText>
                      {userBalances[YFL.address]?.toSignificant(4) + ' ' + YFL.symbol}
                      <br />({numberToUsd(Number(userBalances[YFL.address]?.toSignificant(8)) * yflPriceUsd)})
                    </BalanceText>
                  )}
                </RowBetween>
                <RowBetween>
                  <ButtonSecondary as={Link} width="100%" to="stake/single/gov">
                    {t('stake')}
                  </ButtonSecondary>
                </RowBetween>
              </AutoColumn>
            </UserBalance>
            <UserBalance>
              <AutoColumn gap={'12px'} style={{ width: '100%' }}>
                <Title>{t('stakeGovernanceUnstake')}</Title>
                <BlueCard style={{ margin: '0 0 12px' }}>
                  <Text fontSize="14px">{t('stakeGovernanceUnstakeDescription')}</Text>
                </BlueCard>
                <RowBetween>
                  <Text>{t('yourCurrencyBalance', { currencySymbol: yYFL.name })}:</Text>
                  {fetchingUserBalances ? (
                    <Loader />
                  ) : (
                    <BalanceText>
                      {userBalances[yYFL.address]?.toSignificant(4) + ' ' + yYFL.symbol}
                      <br />({numberToUsd(Number(userBalances[yYFL.address]?.toSignificant(8)) * yyflPriceUsd)})
                    </BalanceText>
                  )}
                </RowBetween>
                <RowBetween>
                  <Text>{t('stakeGovernanceUnstakeFee')}:</Text>
                  {!feeCountdownFetched ? (
                    <Loader />
                  ) : feeCountdown > 0 ? (
                    <BalanceText>
                      1% <br />
                      <Countdown ends={feeCountdown} format="DD[d] HH[h] mm[m] ss[s]" string="setToZeroPercentIn" />
                    </BalanceText>
                  ) : (
                    <Text>0%</Text>
                  )}
                </RowBetween>
                <RowBetween>
                  <ButtonSecondary as={Link} width="100%" to="unstake/single/gov">
                    {t('unstake')}
                  </ButtonSecondary>
                </RowBetween>
              </AutoColumn>
            </UserBalance>
          </>
        ) : (
          <ButtonSecondary onClick={toggleWalletModal}>{t('connectWallet')}</ButtonSecondary>
        )}
      </AppBody>
    </>
  )
}
