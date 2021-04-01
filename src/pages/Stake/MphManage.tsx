import React, { useContext, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import Card, { BlueCard, LightCard, NavigationCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { RowBetween, RowFixed } from '../../components/Row'
import { Trans, useTranslation } from 'react-i18next'
import AppBody from '../AppBody'
import { Dots, Wrapper } from '../Pool/styleds'
import QuestionHelper from '../../components/QuestionHelper'
import { SINGLE_POOLS } from '../../constants'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Text } from 'rebass'
import { ButtonLight, ButtonSecondary } from '../../components/Button'
import { calculateGasMargin, getContract } from '../../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import ReactGA from 'react-ga'
import { mphPool } from '../../components/ABI'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { TYPE } from '../../theme'
import { FixedHeightRow } from '../../components/PositionCard'
import { numberToPercent, numberToSignificant, numberToUsd } from '../../utils/numberUtils'
import { SingleCurrencyLogo } from '../../components/DoubleLogo'
import Countdown from '../../components/Countdown'
import { useGetMphPools } from '../../state/mph/hooks'
import moment from 'moment'
import { useNavigationActiveItemManager } from '../../state/navigation/hooks'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius};
  justify-content: space-evenly;
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

const ExternalLink = styled.a`
  color: ${({ theme }) => theme.textPrimary};
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`

const FullPositionCard = styled(Card)`
  font-size: 14px;
  line-height: 18px;
  background: ${({ theme }) => theme.appBoxBG};
  position: relative;
  margin: 0 0 16px;
`

async function getDeposits(account: string) {
  try {
    const response = await fetch('https://api.thegraph.com/subgraphs/name/bacon-labs/eighty-eight-mph', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `{
          user(id: "${account}") {pools {id address mphDepositorRewardTakeBackMultiplier deposits(where: {user: "${account}", active: true} orderBy: nftID) {nftID fundingID amount maturationTimestamp depositTimestamp interestEarned mintMPHAmount takeBackMPHAmount}}
        }
      }`,
        variables: null
      }),
      method: 'POST'
    })

    if (response.ok) {
      const { data } = await response.json()
      return data.user.pools
    } else {
      return []
    }
  } catch (e) {
    console.log(e)
    return []
  }
}

export default function MphManage({
  match: {
    params: { vaultName }
  }
}: RouteComponentProps<{ vaultName?: string }>) {
  const { account, chainId, library } = useActiveWeb3React()
  const { t } = useTranslation()
  const { mphPools } = useGetMphPools()
  const addTransaction = useTransactionAdder()
  const theme = useContext(ThemeContext)
  const currentVaultName = vaultName ? vaultName.toUpperCase() : 'NONE'
  const currentVault: Record<string, any> | undefined = SINGLE_POOLS[currentVaultName]
  const currency = currentVault?.tokens[0]
  const vaultAddress = currentVault?.rewardsAddress
  const balance = useTokenBalance(account ?? undefined, currentVault?.stakedToken)
  const [fetching, setFetching] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userBalance, setUserBalance] = useState(0)
  const [userPositions, setUserPositions] = useState<any>([])
  const toggleWalletModal = useWalletModalToggle()
  const now = moment().unix()
  const vaultStats = {
    stakePoolTotalLiq: 0,
    stakePoolTotalDeposited: 0,
    tokenPrice: 0,
    apy: 0,
    mphApy: 0
  }

  if (isLoading && typeof balance !== 'undefined') {
    setIsLoading(false)
    setUserBalance(Number(balance?.toSignificant(1)))
  }

  if (mphPools.length > 0 && vaultStats.apy === 0) {
    mphPools.forEach((pool: any, index: number) => {
      if (mphPools[index].address === currentVault?.poolAddress.toLowerCase()) {
        vaultStats.apy = Number(pool.oneYearInterestRate)
        vaultStats.mphApy = Number(pool.mphAPY)
        vaultStats.stakePoolTotalDeposited = Number(pool.totalValueLockedInUSD)
        vaultStats.tokenPrice = Number(pool.totalValueLockedInUSD) / Number(pool.totalValueLockedInToken)
        return
      }
    })
  }

  if (userBalance !== 0 && account) {
    if (!fetching) {
      getDeposits(account.toLowerCase()).then(result => {
        if (result.length > 0) {
          result.forEach(function(pool: Record<string, unknown>) {
            if (pool.address === currentVault?.rewardsAddress.toLowerCase()) {
              setUserPositions(pool.deposits)
            }
          })
        }
      })
      setFetching(true)
    }
  }

  async function withdraw(depositId: string, fundingId: string, early: boolean) {
    if (!chainId || !library || !account) return

    const router = getContract(currentVault?.rewardsAddress, mphPool, library, account)
    const estimate = early ? router.estimateGas.earlyWithdraw : router.estimateGas.withdraw
    const method: (...args: any) => Promise<TransactionResponse> = early ? router.earlyWithdraw : router.withdraw
    const args: Array<string> = [depositId, fundingId]
    const value: BigNumber | null = null
    await estimate(...args, value ? { value } : {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then(response => {
          addTransaction(response, {
            summary: t('withdraw88Vault', {
              vaultName: vaultName,
              position: depositId
            })
          })
          ReactGA.event({
            category: 'Staking',
            action: 'Withdraw',
            label: currency.symbol
          })
        })
      )
      .catch(error => {
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }

  const newActive = useNavigationActiveItemManager()
  useEffect(() => {
    newActive('stake')
  })
  if (!vaultName || !currentVault || !vaultAddress) {
    return null
  } else {
    return (
      <>
        <NavigationCard>
          <SwapPoolTabs active={'stake'} />
        </NavigationCard>
        <AppBody>
          <Tabs>
            <RowBetween style={{ padding: '1rem 0' }}>
              <ActiveText>{t('your88Deposits', { vaultName: currency.symbol })}</ActiveText>
              <QuestionHelper text={t('deposit88Description', { vaultName: currency.symbol })} />
            </RowBetween>
          </Tabs>
          <RowBetween>
            <Text style={{ margin: '0 0 12px' }} fontSize="16px">
              <Trans i18nKey="vaultDetails88mph">
                Detailed Vault information at:
                <ExternalLink href="https://88mph.app/" target="_blank">
                  88mph
                </ExternalLink>
              </Trans>
            </Text>
          </RowBetween>
          <Wrapper>
            <BlueCard>
              <AutoColumn gap="10px">
                <Text fontSize="16px">{t('deposit88WithdrawEarlyHead')}</Text>
                <Text fontSize="14px">{t('deposit88WithdrawEarly')}</Text>
              </AutoColumn>
            </BlueCard>
          </Wrapper>
          <RowBetween>
            <Text style={{ margin: '12px 0 0' }} fontSize="16px">
              <Trans i18nKey="vestedDetails88mph">
                Check your
                <ExternalLink href="https://88mph.app/vesting" target="_blank">
                  vested MPH rewards
                </ExternalLink>
              </Trans>
            </Text>
          </RowBetween>
          {!account && (
            <ButtonLight style={{ marginTop: '12px' }} onClick={toggleWalletModal}>
              {t('connectWallet')}
            </ButtonLight>
          )}
        </AppBody>
        {account && (
          <AutoColumn style={{ minWidth: '20rem', maxWidth: '420px', width: '100%', marginTop: '1rem' }}>
            {isLoading ? (
              <LightCard padding="40px">
                <TYPE.body color={theme.textPrimary} textAlign="center">
                  <Dots>{t('loading')}</Dots>
                </TYPE.body>
              </LightCard>
            ) : (
              <>
                {userPositions.length > 0 ? (
                  <>
                    {userPositions.map((userPosition: any, index: number) => (
                      <FullPositionCard key={index}>
                        <AutoColumn gap="12px">
                          <FixedHeightRow>
                            <RowFixed>
                              <SingleCurrencyLogo currency0={currency} margin={true} size={22} />
                              <div style={{ display: 'flex', position: 'relative' }}>
                                <p style={{ fontWeight: 500, fontSize: 18, margin: '0 4px' }}>
                                  {currency.symbol} ({t('depositId', { id: userPosition.nftID })})
                                </p>
                              </div>
                            </RowFixed>
                          </FixedHeightRow>
                          <AutoColumn gap="8px">
                            <RowBetween>
                              <Text>{t('depositedTokens')}</Text>
                              {numberToSignificant(userPosition.amount)} {currency.symbol}
                            </RowBetween>
                            {vaultStats.tokenPrice !== 0 && (
                              <RowBetween>
                                <Text>{t('yourPoolShare')}</Text>
                                {numberToUsd(Number(userPosition.amount) * vaultStats.tokenPrice)} (
                                {numberToPercent(
                                  Number(userPosition.amount) / (vaultStats.stakePoolTotalDeposited / 100)
                                )}
                                )
                              </RowBetween>
                            )}

                            <RowBetween style={{ alignItems: 'flex-start' }}>
                              <Text>{t('interestEarned')}</Text>
                              <Text style={{ textAlign: 'end' }}>
                                <div>
                                  {numberToSignificant(userPosition.interestEarned)} {currency.symbol}
                                </div>
                                <div>
                                  {t('vestedMPH', { vestedAmount: numberToSignificant(userPosition.mintMPHAmount) })}
                                </div>
                              </Text>
                            </RowBetween>

                            {now < userPosition.maturationTimestamp ? (
                              <>
                                <RowBetween>
                                  <Text>{t('timeRemaining')}</Text>
                                  <Countdown
                                    ends={userPosition.maturationTimestamp}
                                    format="DD[d] HH[h] mm[m] ss[s]"
                                    string="unlocksIn"
                                  />
                                </RowBetween>
                                <RowBetween marginTop="10px">
                                  <ButtonSecondary
                                    onClick={() => {
                                      withdraw(userPosition.nftID, userPosition.fundingID, true)
                                    }}
                                    width="100%"
                                    style={{ marginInlineEnd: '1%' }}
                                  >
                                    {t('withdrawEarly')}
                                  </ButtonSecondary>
                                </RowBetween>
                              </>
                            ) : (
                              <RowBetween marginTop="10px">
                                <ButtonSecondary
                                  onClick={() => {
                                    withdraw(userPosition.nftID, userPosition.fundingID, false)
                                  }}
                                  width="100%"
                                  style={{ marginInlineEnd: '1%' }}
                                >
                                  {t('withdraw')}
                                </ButtonSecondary>
                              </RowBetween>
                            )}
                            {vaultStats.tokenPrice !== 0 && (
                              <>
                                <RowBetween>
                                  <Text style={{ margin: '12px 0 0' }} fontSize="16px" fontWeight={600}>
                                    {t('stakePoolStats')}
                                  </Text>
                                </RowBetween>
                                <RowBetween style={{ alignItems: 'flex-start' }}>
                                  <Text>{t('stakePoolTotalDeposited')}</Text>
                                  <Text>{numberToUsd(vaultStats.stakePoolTotalDeposited)}</Text>
                                </RowBetween>
                                <RowBetween>
                                  <Text>{t('fixedApy')}</Text>
                                  <Text>{numberToPercent(vaultStats.apy)}</Text>
                                </RowBetween>
                                <RowBetween>
                                  <Text>{t('mphApy')}</Text>
                                  <Text>+{numberToPercent(vaultStats.mphApy)}</Text>
                                </RowBetween>
                              </>
                            )}
                          </AutoColumn>
                        </AutoColumn>
                      </FullPositionCard>
                    ))}
                  </>
                ) : (
                  <LightCard padding="40px">
                    <TYPE.body color={theme.textPrimary} textAlign="center">
                      {t('noDepositsFound')}
                    </TYPE.body>
                  </LightCard>
                )}
              </>
            )}
          </AutoColumn>
        )}
      </>
    )
  }
}
