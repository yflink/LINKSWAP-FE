import React, { useContext, useEffect, useState } from 'react'
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
import { displayNumber, numberToPercent, numberToSignificant, numberToUsd } from '../../utils/numberUtils'
import { ButtonSecondary } from '../../components/Button'
import { Link } from 'react-router-dom'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { MARKETCAPS, SINGLE_POOLS, YFL, yYFL } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import Loader from '../../components/Loader'
import { getContract } from '../../utils'
import { governancePool } from '../../components/ABI'
import { ETH_API_KEYS, getNetworkLibrary, NETWORK_URL } from '../../connectors'
import hexStringToNumber from '../../utils/hexStringToNumber'
import { BigNumber } from 'ethers'
import { useBlockNumber, useWalletModalToggle } from '../../state/application/hooks'
import { useGetPriceBase } from '../../state/price/hooks'
import moment from 'moment'
import Countdown from '../../components/Countdown'
import Web3 from 'web3'

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
  margin: 0;
  font-weight: 700;
`

const BalanceText = styled.p`
  margin: 0;
  text-align: right;
`

const LinkedBalance = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.appInfoBoxTextColor};
`

const VotingButton = styled.a`
  padding: 18px;
  width: 100%;
  font-weight: 500;
  text-align: center;
  border-radius: ${({ theme }) => theme.borderRadius};
  outline: none;
  border: 1px solid transparent;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  position: relative;
  background: ${({ theme }) => theme.buttonBG};
  color: ${({ theme }) => theme.buttonTextColor};
  font-size: 18px;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.buttonBGHover};
    background: ${({ theme }) => theme.buttonBGHover};
    color: ${({ theme }) => theme.buttonTextColorHover};
  }
  &:hover {
    background: ${({ theme }) => theme.buttonBGHover};
    color: ${({ theme }) => theme.buttonTextColorHover};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.buttonBGActive};
    background: ${({ theme }) => theme.buttonBGActive};
    color: ${({ theme }) => theme.buttonTextColorActive};
  }
  }
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
        return ['']
      } else {
        return content.result.EstimateTimeInSec
      }
    } else {
      return ['']
    }
  } catch (e) {
    console.log(e)
  }
}

async function getIncomingTransactions(senderAddress: string) {
  const ethAPIKey = ETH_API_KEYS[Math.floor(Math.random() * ETH_API_KEYS.length)]
  try {
    const url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0x28cb7e841ee97947a86b06fa4090c8451f64c0be&address=${senderAddress}&startblock=0&endblock=999999999&sort=desc&apikey=${ethAPIKey}`
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
        return content.result
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
  const governanceAddress = SINGLE_POOLS.GOV.rewardsAddress
  const theme = useContext(ThemeContext)
  const [govBalanceFetching, setGovBalanceFetching] = useState(false)
  const [govBalance, setGovBalance] = useState(0)
  const [yyflPrice, setYyflPrice] = useState(0)
  const [yyflPriceLastMonth, setYyflPriceLastMonth] = useState(0)
  const [apy, setApy] = useState(0)
  const [totalApy, setTotalApy] = useState(0)
  const [receivedYFLManual, setReceivedYFLManual] = useState(0)
  const [receivedYFLAuto, setReceivedYFLAuto] = useState(0)
  const [receivedYFLLinkpad, setReceivedYFLLinkpad] = useState(0)
  const [daysSinceLastDistribution, setDaysSinceLastDistribution] = useState(0)
  const toggleWalletModal = useWalletModalToggle()
  const { t } = useTranslation()
  const newActive = useNavigationActiveItemManager()
  const [userBalances, fetchingUserBalances] = useTokenBalancesWithLoadingIndicator(account ?? undefined, [YFL, yYFL])
  const [govBalances, fetchingGovBalances] = useTokenBalancesWithLoadingIndicator(governanceAddress ?? undefined, [YFL])
  const [feeCountdownFetched, setFeeCountdownFetched] = useState(false)
  const [feeCountdown, setFeeCountdown] = useState(0)
  const govContract = getContract(governanceAddress, governancePool, fakeLibrary, fakeAccount)
  const priceObject = useGetPriceBase()
  const yflPriceUsd = priceObject ? priceObject['yflPriceBase'] : 0
  const yyflPriceUsd = priceObject && yyflPrice !== 0 ? priceObject['yflPriceBase'] * yyflPrice : 0
  const now = moment().unix()
  const lastBlockNumber = useBlockNumber()
  const numberOfDaysForApy = 60
  const lastMonthBlockNumber = lastBlockNumber ? lastBlockNumber - numberOfDaysForApy * 6408 : 0
  const startDate = moment('11-27-2020', 'MM-DD-YYYY')
  const daysSinceStart = moment().diff(startDate, 'days')
  const yflStartPrice = 1
  const hasYfl = Number(userBalances[YFL.address]?.toSignificant(1)) > 0
  const hasYyfl = Number(userBalances[yYFL.address]?.toSignificant(1)) > 0
  const totalStaked = Number(govBalances[YFL.address]?.toSignificant(8))
  const percentageStakedTVL = totalStaked / (MARKETCAPS.YFL * 0.01)
  useEffect(() => {
    newActive('stake-governance')
  })

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

    if (receivedYFLManual === 0) {
      getIncomingTransactions('0x0389d755c1833c9b350d4e8b619eae16defc1cba').then(transactions => {
        let YFLManual = 0
        transactions.forEach(function(transaction: Record<string, any>) {
          if (transaction.to === governanceAddress.toLowerCase()) {
            YFLManual += Number(transaction.value)
            setDaysSinceLastDistribution(moment().diff(moment.unix(transaction.timeStamp), 'days'))
          }
        })
        setReceivedYFLManual(YFLManual)
      })
    }
    if (receivedYFLLinkpad === 0) {
      getIncomingTransactions('0xbdde61544cc567cd658fc6cc2fee28acceb419fd').then(transactions => {
        let YFLLinkpad = 0
        transactions.forEach(function(transaction: Record<string, any>) {
          if (transaction.to === governanceAddress.toLowerCase()) {
            YFLLinkpad += Number(transaction.value)
          }
        })
        setReceivedYFLLinkpad(YFLLinkpad)
      })
    }
    if (receivedYFLAuto === 0) {
      getIncomingTransactions('0xdecaf44d70f377b28b6165c20846b74c04d90088').then(transactions => {
        let YFLAuto = 0
        transactions.forEach(function(transaction: Record<string, any>) {
          if (transaction.to === governanceAddress.toLowerCase()) {
            YFLAuto += Number(transaction.value)
          }
        })
        setReceivedYFLAuto(YFLAuto)
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

  if (lastMonthBlockNumber !== 0 && yyflPriceLastMonth === 0) {
    const web3 = new Web3(new Web3.providers.HttpProvider(NETWORK_URL))
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const abstractContract = new web3.eth.Contract(governancePool, governanceAddress)
    abstractContract.methods
      .getPricePerFullShare()
      .call({}, lastMonthBlockNumber)
      .then((response: any) => {
        setYyflPriceLastMonth(hexStringToNumber(response.toHexString(), yYFL.decimals))
      })
  }

  if (yyflPrice > 0 && yyflPriceLastMonth > 0 && apy === 0) {
    const priceDifference = yyflPrice - yyflPriceLastMonth
    const percentageDifference = (priceDifference / ((yyflPriceLastMonth + yyflPrice) / 2)) * 100
    const dailyPercentage = percentageDifference / numberOfDaysForApy
    setApy(dailyPercentage * 365)
  }

  if (yyflPrice > 0 && totalApy === 0) {
    const totalPriceDifference = yyflPrice - yflStartPrice
    const totalPercentageDifference = (totalPriceDifference / ((yflStartPrice + yyflPrice) / 2)) * 100
    const dailyTotalPercentage = totalPercentageDifference / daysSinceStart
    setTotalApy(dailyTotalPercentage * 365)
  }

  const totalReceivedYFL = (receivedYFLManual + receivedYFLLinkpad + receivedYFLAuto) / 1000000000000000000

  return (
    <>
      <Card style={{ maxWidth: '420px', padding: '12px', backgroundColor: theme.navigationBG, marginBottom: '16px' }}>
        <SwapPoolTabs active={'stake'} />
      </Card>
      <AppBody>
        <AutoColumn gap={'12px'}>
          <RowBetween>
            <Title>{t('stakeGovernance')}</Title>
            <Question text={t('stakeGovernanceDescription')} />
          </RowBetween>
        </AutoColumn>
        <BlueCard style={{ margin: '12px 0' }}>
          <Text textAlign="center" fontSize={12} fontWeight={400}>
            {t('stakeGovernanceBalance')}
          </Text>
          <Text textAlign="center" fontSize={30} fontWeight={700}>
            <LinkedBalance
              href="https://zapper.fi/dashboard?address=0x0389d755c1833c9b350d4e8b619eae16defc1cba"
              title={t('stakeGovernanceBalance')}
            >
              {numberToUsd(govBalance)}
            </LinkedBalance>
          </Text>
        </BlueCard>
        <Text fontSize="12px" color={theme.textSecondary}>
          {t('stakeGovernanceBalanceDisclaimer', { inputCurrency: YFL.symbol, outputCurrency: yYFL.symbol })}
        </Text>
        <Text fontSize="12px" color={theme.textSecondary}>
          {t('stakeGovernanceLastDistribution', { days: daysSinceLastDistribution })}
        </Text>

        {apy !== 0 && (
          <>
            <BlueCard style={{ margin: '24px 0 12px' }}>
              <Text textAlign="center" fontSize={12} fontWeight={400}>
                {t('currentEstimatedAPY')}
              </Text>
              <Text textAlign="center" fontSize={30} fontWeight={700}>
                {numberToPercent(apy)}
              </Text>
            </BlueCard>
            <Text fontSize="12px" color={theme.textSecondary}>
              {t('currentEstimatedAPYDisclaimer', { days: numberOfDaysForApy })}
            </Text>
          </>
        )}
        <GovernanceBalance>
          <AutoColumn gap={'12px'} style={{ width: '100%' }}>
            <RowBetween style={{ marginTop: '24px' }}>
              <Title>{t('stakeGovernanceStatistics')}</Title>
            </RowBetween>
            <RowBetween>
              <Text>{t('stakedCurrency', { currencySymbol: YFL.symbol })}:</Text>
              {fetchingGovBalances ? (
                <Loader />
              ) : (
                <BalanceText>
                  {displayNumber(totalStaked) + ' ' + YFL.symbol}
                  <br />
                  {numberToUsd(Number(govBalances[YFL.address]?.toSignificant(8)) * yflPriceUsd)}
                  <br />
                  {t('stakeOfTotalSupply', { percent: numberToPercent(percentageStakedTVL) })}
                </BalanceText>
              )}
            </RowBetween>
            <RowBetween>
              <Text>{t('currencyPrice', { currencySymbol: yYFL.symbol })}:</Text>
              {yyflPrice === 0 ? (
                <Loader />
              ) : (
                <BalanceText>{numberToSignificant(yyflPrice, 6) + ' ' + YFL.symbol}</BalanceText>
              )}
            </RowBetween>
            {totalReceivedYFL > 1 && (
              <RowBetween style={{ margin: '12px 0 0', alignItems: 'flex-start', lineHeight: '1.4' }}>
                <Text> {t('stakeGovernanceTotalDistributed')}</Text>
                <BalanceText>
                  {`${numberToSignificant(totalReceivedYFL, 5)} ${YFL.symbol}`}
                  <br />({numberToUsd(totalReceivedYFL * yflPriceUsd)})
                </BalanceText>
              </RowBetween>
            )}
            {totalApy !== 0 && (
              <>
                <RowBetween>
                  <Text textAlign="center">{t('currentEstimatedTotalAPY')}</Text>
                  <BalanceText>{numberToPercent(totalApy)}</BalanceText>
                </RowBetween>
                <RowBetween>
                  <Text fontSize="12px" color={theme.textSecondary}>
                    {t('currentEstimatedTotalAPYDisclaimer', { days: daysSinceStart })}
                  </Text>
                </RowBetween>
              </>
            )}
          </AutoColumn>
        </GovernanceBalance>

        <UserBalance>
          <AutoColumn gap={'12px'} style={{ width: '100%' }}>
            <RowBetween style={{ marginTop: '24px' }}>
              <Title>{t('stakeGovernanceStake')}</Title>
              <Question text={t('stakeGovernanceStakeDescription')} />
            </RowBetween>
            {account && (
              <>
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
                  {hasYfl ? (
                    <ButtonSecondary as={Link} width="100%" to="/stake/single/gov">
                      {t('stake')}
                    </ButtonSecondary>
                  ) : (
                    <ButtonSecondary
                      as={Link}
                      width="100%"
                      to="/swap?outpuCurrency=0x28cb7e841ee97947a86b06fa4090c8451f64c0be"
                    >
                      {t('buyCurrency', { currency: YFL.symbol })}
                    </ButtonSecondary>
                  )}
                </RowBetween>
              </>
            )}
          </AutoColumn>
        </UserBalance>
        {account ? (
          <>
            {hasYyfl && (
              <UserBalance>
                <AutoColumn gap={'12px'} style={{ width: '100%' }}>
                  <RowBetween style={{ marginTop: '24px' }}>
                    <Title>{t('stakeGovernanceVoting')}</Title>
                    <Question text={t('stakeGovernanceVotingDescription')} />
                  </RowBetween>
                  <RowBetween>
                    <VotingButton href="https://snapshot.page/#/yflink">{t('stakeGovernanceVoting')}</VotingButton>
                  </RowBetween>
                </AutoColumn>
              </UserBalance>
            )}
            <UserBalance>
              <AutoColumn gap={'12px'} style={{ width: '100%' }}>
                <RowBetween style={{ marginTop: '24px' }}>
                  <Title>{t('stakeGovernanceUnstake')}</Title>
                  <Question text={t('stakeGovernanceUnstakeDescription')} />
                </RowBetween>
                <RowBetween>
                  <Text>{t('yourCurrencyBalance', { currencySymbol: yYFL.name })}:</Text>
                  {fetchingUserBalances ? (
                    <Loader />
                  ) : (
                    <BalanceText>
                      {numberToSignificant(Number(userBalances[yYFL.address]?.toSignificant(18)) * yyflPrice, 4) +
                        ' ' +
                        YFL.symbol}
                      <br />
                      {userBalances[yYFL.address]?.toSignificant(4) + ' ' + yYFL.symbol}
                      <br />({numberToUsd(Number(userBalances[yYFL.address]?.toSignificant(8)) * yyflPriceUsd)})
                    </BalanceText>
                  )}
                </RowBetween>
                {hasYyfl && (
                  <RowBetween>
                    <Text>{t('stakeGovernanceUnstakeFee')}:</Text>
                    {!feeCountdownFetched ? (
                      <Loader />
                    ) : feeCountdown > now ? (
                      <BalanceText>
                        1% <br />
                        <Countdown
                          ends={feeCountdown}
                          format="DD[d] HH[h] mm[m] ss[s]"
                          string="setToZeroPercentIn"
                          endedString="stakeGovernanceNoFee"
                        />
                      </BalanceText>
                    ) : (
                      <Text>0%</Text>
                    )}
                  </RowBetween>
                )}
                {hasYyfl && (
                  <RowBetween>
                    <ButtonSecondary as={Link} width="100%" to="/unstake/single/gov">
                      {t('unstake')}
                    </ButtonSecondary>
                  </RowBetween>
                )}
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
