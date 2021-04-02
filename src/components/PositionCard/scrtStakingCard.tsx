import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AutoColumn } from '../Column'
import { displayNumber, divDecimals, numberToPercent, numberToSignificant, numberToUsd } from '../../utils/numberUtils'
import { RowBetween, RowFixed } from '../Row'
import { Text } from 'rebass'
import { ChevronDown, ChevronUp } from 'react-feather'
import { ButtonSecondary } from '../Button'
import { FixedHeightRow } from './index'
import styled from 'styled-components'
import Card from '../Card'
import { SCRTSVG } from '../SVG'
import KeplrConnect, { getKeplrClient, getKeplrObject, getViewingKey } from '../KeplrConnect'
import { useGetKplrConnect, useGetSecretPools } from '../../state/keplr/hooks'
import { Snip20GetBalance } from '../KeplrConnect/snip20'
import { SigningCosmWasmClient } from 'secretjs'
import { sleep } from '../../utils/sleep'
import { Link } from 'react-router-dom'
import { QueryDeposit, QueryRewards, Redeem } from '../KeplrConnect/scrtVault'
import Loader from '../Loader'
import { useGetTokenPrices } from '../../state/price/hooks'
import { Dots } from '../swap/styleds'

const StakingCard = styled(Card)<{ highlight?: boolean; show?: boolean }>`
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
const ScrtTokenLogo = styled.img`
  width: 24px;
  height: 24px;
  margin-inline-end: 8px;
  display: inline-block;
`

export default function ScrtStakingCard({ values, show }: { values: any; show?: boolean | false; index: number }) {
  const [showMore, setShowMore] = useState(show)
  const scrtChainId = 'secret-2'
  const { t } = useTranslation()
  const { tokenPrices } = useGetTokenPrices()
  const { secretPools } = useGetSecretPools()
  const headerRowStyles = show ? 'default' : 'pointer'
  let keplrObject = getKeplrObject()
  const [status, setStatus] = useState('Loading')
  const [tokenBalance, setTokenBalance] = useState<any>(undefined)
  const [balanceFetching, setBalanceFetching] = useState<boolean>(false)
  const [depositTokenBalance, setDepositTokenBalance] = useState<any>(undefined)
  const [depositFetching, setDepositFetching] = useState<boolean>(false)
  const [rewardsFetching, setRewardsFetching] = useState<boolean>(false)
  const [rewardsTokenBalance, setRewardsTokenBalance] = useState<any>(undefined)
  const [unlock, setUnlock] = useState(false)
  const { keplrConnected, keplrAccount } = useGetKplrConnect()
  const [keplrClient, setKeplrClient] = useState<SigningCosmWasmClient | undefined>(undefined)
  const [claiming, setClaiming] = useState<boolean>(false)
  const [claimingAll, setClaimingAll] = useState<boolean>(false)
  const { stakedToken, rewardsToken, rewardsAddress, tokens } = values
  let totalSupply = 0
  let tokenPrice = 0
  let totalLocked = 0
  let apy = 0

  async function getSnip20Balance(snip20Address: string, decimals?: string | number): Promise<string | boolean> {
    if (!keplrClient) {
      return false
    }

    if (!balanceFetching) {
      setBalanceFetching(true)

      const viewingKey = await getViewingKey({
        keplr: keplrObject,
        chainId: scrtChainId,
        address: snip20Address
      })

      if (!viewingKey) {
        return 'Unlock'
      }

      const rawBalance = await Snip20GetBalance({
        secretjs: keplrClient,
        token: snip20Address,
        address: keplrAccount,
        key: viewingKey
      })

      if (isNaN(Number(rawBalance))) {
        return 'Fix Unlock'
      }

      if (decimals) {
        const decimalsNum = Number(decimals)
        return divDecimals(rawBalance, decimalsNum)
      }

      return rawBalance
    } else {
      return false
    }
  }

  async function getBridgeRewardsBalance(snip20Address: string): Promise<string | boolean> {
    if (!keplrClient) {
      return false
    }

    if (!rewardsFetching && status === 'Unlocked') {
      setRewardsFetching(true)

      const height = await keplrClient.getHeight()

      const viewingKey = await getViewingKey({
        keplr: keplrObject,
        chainId: scrtChainId,
        address: snip20Address
      })

      if (!viewingKey) {
        return false
      }

      return await QueryRewards({
        cosmJS: keplrClient,
        contract: snip20Address,
        address: keplrAccount,
        key: viewingKey,
        height: String(height)
      })
    } else {
      return false
    }
  }

  async function getBridgeDepositBalance(snip20Address: string): Promise<string | boolean> {
    if (!keplrClient) {
      return false
    }
    if (!depositFetching && status === 'Unlocked') {
      setDepositFetching(true)

      const viewingKey = await getViewingKey({
        keplr: keplrObject,
        chainId: scrtChainId,
        address: snip20Address
      })

      if (!viewingKey) {
        setDepositFetching(false)
        return false
      }

      return await QueryDeposit({
        cosmJS: keplrClient,
        contract: snip20Address,
        address: keplrAccount,
        key: viewingKey
      })
    } else {
      return false
    }
  }

  async function getBalance() {
    if (typeof tokenBalance === 'undefined') {
      getSnip20Balance(stakedToken.address, stakedToken.decimals).then(balance => {
        if (balance !== 'Fix Unlock' && balance !== 'Unlock') {
          if (balance) {
            setStatus('Unlocked')
            setTokenBalance(Number(balance))
          }
        } else {
          if (balance) {
            setStatus(balance)
          }
        }
      })
    }
  }

  async function getBridgeData() {
    if (typeof rewardsTokenBalance === 'undefined') {
      getBridgeRewardsBalance(rewardsAddress).then(rewardBalance => {
        if (rewardBalance) {
          setRewardsFetching(false)
          setRewardsTokenBalance(divDecimals(Number(rewardBalance), rewardsToken.decimals))
        }
      })
    }

    if (typeof depositTokenBalance === 'undefined') {
      getBridgeDepositBalance(rewardsAddress).then(depositBalance => {
        if (depositBalance) {
          setDepositFetching(false)
          setDepositTokenBalance(depositBalance)
        }
      })
    }
  }

  async function unlockToken() {
    setUnlock(!unlock)
    if (!keplrObject) {
      keplrObject = getKeplrObject()
    } else {
      try {
        await keplrObject.suggestToken(scrtChainId, stakedToken.address)
        await sleep(1000)
        setDepositTokenBalance(undefined)
        setRewardsTokenBalance(undefined)
        setTokenBalance(undefined)
        setDepositFetching(false)
        setRewardsFetching(false)
        setBalanceFetching(false)
        setClaimingAll(false)
        getBalance()
        getBridgeData()
      } catch (error) {
        console.error(error)
      }
    }
  }

  async function claimRewards() {
    if (!keplrClient) return
    setClaiming(true)
    try {
      await Redeem({
        secretjs: keplrClient,
        address: rewardsAddress,
        amount: '0'
      })
      setTimeout(() => {
        setRewardsTokenBalance(undefined)
        setRewardsFetching(false)
        setClaiming(false)
        getBridgeData()
      }, 2000)
    } catch (reason) {
      setTimeout(() => {
        setRewardsTokenBalance(0)
        setRewardsFetching(false)
        setClaiming(false)
        getBridgeData()
      }, 2000)
      console.error(`Failed to claim: ${reason}`)
    }
  }

  async function unstakeAndClaimRewards() {
    if (!keplrClient) return
    setClaimingAll(true)
    try {
      await Redeem({
        secretjs: keplrClient,
        address: rewardsAddress,
        amount: depositTokenBalance
      })
      setDepositTokenBalance(undefined)
      setRewardsTokenBalance(undefined)
      setTokenBalance(undefined)
      setDepositFetching(false)
      setRewardsFetching(false)
      setBalanceFetching(false)
      setClaimingAll(false)
      getBalance()
      getBridgeData()
    } catch (reason) {
      setDepositTokenBalance(undefined)
      setRewardsTokenBalance(undefined)
      setTokenBalance(undefined)
      setDepositFetching(false)
      setRewardsFetching(false)
      setBalanceFetching(false)
      setClaimingAll(false)
      getBalance()
      getBridgeData()
      console.error(`Failed to claim: ${reason}`)
    }
  }

  if (!keplrObject) {
    keplrObject = getKeplrObject()
  } else {
    if (keplrAccount) {
      if (!keplrClient) {
        setKeplrClient(getKeplrClient(keplrAccount))
      }
      getBridgeData()
      getBalance()
    }
  }

  if (tokenPrices) {
    tokenPrice = tokenPrices[tokens[1].address.toLowerCase()] ? tokenPrices[tokens[1].address.toLowerCase()].price : 0

    if (secretPools) {
      totalLocked =
        Number(divDecimals(Number(secretPools[rewardsAddress.toLowerCase()].totalSupply), stakedToken.decimals)) ?? 0
      if (totalSupply === 0) {
        totalSupply = totalLocked * Number(tokenPrice)
      }

      const timeRemaining =
        (secretPools[rewardsAddress.toLowerCase()].deadline - 2424433) * 6.22 +
        1614681910 -
        Math.round(Date.now() / 1000)

      const pending =
        Number(divDecimals(secretPools[rewardsAddress.toLowerCase()].rewardsLeft, rewardsToken.decimals)) *
        secretPools[rewardsAddress.toLowerCase()].rewardsPrice
      const locked = Number(totalSupply)
      apy = ((pending * 100) / locked) * (3.154e7 / timeRemaining)
    }
  }

  const depositedTokens = depositTokenBalance
    ? Number(divDecimals(Number(depositTokenBalance), stakedToken.decimals))
    : 0

  return (
    <StakingCard highlight={depositTokenBalance > 0} show={show}>
      <PlatformIcon>
        <SCRTSVG />
      </PlatformIcon>
      <AutoColumn gap="12px">
        <FixedHeightRow
          onClick={() => {
            if (!show) {
              setShowMore(!showMore)
            }
          }}
          style={{ cursor: headerRowStyles, position: 'relative' }}
        >
          <div style={{ position: 'absolute', right: '-13px', top: '-16px', fontSize: '12px' }}>
            <p style={{ margin: 0 }}>{t('apy', { apy: numberToPercent(apy) })}</p>
          </div>
          <RowFixed>
            <ScrtTokenLogo src="//logos.linkswap.app/scrt.png" />
            <div style={{ display: 'flex', position: 'relative' }}>
              <p style={{ fontWeight: 500, fontSize: 18, margin: '0 4px' }}>{stakedToken.symbol}</p>
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
            {keplrConnected ? (
              <>
                {status === 'Unlocked' ? (
                  <>
                    {tokenBalance > 0.05 && (
                      <RowBetween>
                        <Text>{t('stakableTokenAmount')}</Text>
                        <Text>
                          {displayNumber(numberToSignificant(tokenBalance))} {stakedToken.symbol}
                        </Text>
                      </RowBetween>
                    )}
                    {depositTokenBalance > 0 && (
                      <RowBetween>
                        <Text>{t('stakedTokenAmount')}</Text>
                        {numberToSignificant(depositedTokens)} {stakedToken.symbol}
                      </RowBetween>
                    )}
                    {depositTokenBalance > 0 && (
                      <>
                        <RowBetween>
                          <Text>{t('yourPoolShare')}</Text>
                          {numberToUsd(tokenPrice * depositedTokens)} (
                          {numberToPercent(depositedTokens / (totalLocked / 100))})
                        </RowBetween>

                        {rewardsTokenBalance > 0 ? (
                          <RowBetween style={{ alignItems: 'flex-start' }}>
                            <Text>{t('claimableRewards')}</Text>
                            <Text style={{ textAlign: 'end' }}>
                              <div>
                                {numberToSignificant(rewardsTokenBalance)} {rewardsToken.symbol}
                              </div>
                            </Text>
                          </RowBetween>
                        ) : (
                          <RowBetween style={{ alignItems: 'flex-start' }}>
                            <Text>{t('claimableRewards')}</Text>
                            <Text>{t('none')}</Text>
                          </RowBetween>
                        )}
                      </>
                    )}

                    {tokenBalance > 0.05 && !show && (
                      <ButtonSecondary as={Link} width="100%" to={`/stake-scrt/${stakedToken.symbol.toLowerCase()}`}>
                        {t('stake')}
                      </ButtonSecondary>
                    )}
                  </>
                ) : status === 'Loading' ? (
                  <RowBetween style={{ alignItems: 'center' }}>
                    <Text textAlign="center" fontSize={16}>
                      <Dots>{t('loading')}</Dots>
                    </Text>
                    <Text>
                      <Loader />
                    </Text>
                  </RowBetween>
                ) : (
                  <>
                    <Text fontSize={14}>{t('unlockScrtTokenDescription', { tokenSymbol: stakedToken.symbol })}</Text>
                    <ButtonSecondary
                      onClick={() => {
                        unlockToken()
                      }}
                    >
                      {t('unlockScrtToken', { tokenSymbol: stakedToken.symbol })}
                    </ButtonSecondary>
                  </>
                )}
              </>
            ) : (
              <RowBetween marginTop="10px">
                <KeplrConnect />
              </RowBetween>
            )}
            <RowBetween>
              <Text style={{ margin: '12px 0 0' }} fontSize="16px" fontWeight={600}>
                {t('stakePoolStats')}
              </Text>
            </RowBetween>

            <RowBetween style={{ alignItems: 'flex-start' }}>
              <Text>{t('stakePoolTotalLiq')}</Text>
              <Text>{numberToUsd(Number(totalSupply))}</Text>
            </RowBetween>
            <RowBetween marginTop="10px">
              {!show && rewardsTokenBalance > 0 && (
                <ButtonSecondary
                  disabled={claiming}
                  onClick={() => {
                    claimRewards()
                  }}
                  width={rewardsTokenBalance > 0 ? '48%' : '100%'}
                  style={{ marginInlineStart: rewardsTokenBalance > 0 ? '1%' : '0' }}
                >
                  {claiming ? <Loader /> : t('claimRewards')}
                </ButtonSecondary>
              )}
              {!show && depositTokenBalance > 0 && (
                <ButtonSecondary
                  as={Link}
                  width={rewardsTokenBalance > 0 ? '48%' : '100%'}
                  style={{ marginInlineStart: rewardsTokenBalance > 0 ? '1%' : '0' }}
                  to={`/unstake-scrt/${stakedToken.symbol.toLowerCase()}`}
                >
                  {t('unstake')}
                </ButtonSecondary>
              )}
            </RowBetween>
            {!show && depositTokenBalance > 0 && (
              <RowBetween marginTop="10px">
                <ButtonSecondary
                  disabled={claimingAll}
                  onClick={() => {
                    unstakeAndClaimRewards()
                  }}
                  width="100%"
                  style={{ marginInlineEnd: '1%' }}
                >
                  {claimingAll ? <Loader /> : t('unstakeAndClaim')}
                </ButtonSecondary>
              </RowBetween>
            )}
          </AutoColumn>
        )}
      </AutoColumn>
    </StakingCard>
  )
}
