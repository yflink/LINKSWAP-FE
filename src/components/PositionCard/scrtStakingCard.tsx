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
import { useGetKplrConnect } from '../../state/keplr/hooks'
import { Snip20GetBalance } from '../KeplrConnect/snip20'
import { SigningCosmWasmClient } from 'secretjs'
import { sleep } from '../../utils/sleep'
import { Link } from 'react-router-dom'
import { QueryDeposit, QueryRewards } from '../KeplrConnect/scrtVault'
import Loader from '../Loader'
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

export default function ScrtStakingCard({
  values,
  show,
  showOwn,
  showExpired
}: {
  values: any
  show?: boolean | false
  showOwn?: boolean | false
  showExpired?: boolean | true
  index: number
}) {
  const [showMore, setShowMore] = useState(show)
  const scrtChainId = 'secret-2'
  const { t } = useTranslation()
  const headerRowStyles = show ? 'default' : 'pointer'
  let keplrObject = getKeplrObject()
  const [status, setStatus] = useState('Unlock')
  const [tokenBalance, setTokenBalance] = useState<any>(undefined)
  const [depositTokenBalance, setDepositTokenBalance] = useState<any>(undefined)
  const [rewardsTokenBalance, setRewardsTokenBalance] = useState<any>(undefined)
  const { keplrConnected, keplrAccount } = useGetKplrConnect()
  const [keplrClient, setKeplrClient] = useState<SigningCosmWasmClient | undefined>(undefined)
  const { stakedToken, rewardsToken, rewardsAddress } = values

  async function getSnip20Balance(snip20Address: string, decimals?: string | number): Promise<string | boolean> {
    if (!keplrClient) {
      return false
    }

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
  }

  async function getBridgeRewardsBalance(snip20Address: string): Promise<string | boolean> {
    if (!keplrClient) {
      return false
    }

    const height = await keplrClient.getHeight()

    const viewingKey = await getViewingKey({
      keplr: keplrObject,
      chainId: scrtChainId,
      address: snip20Address
    })

    return await QueryRewards({
      cosmJS: keplrClient,
      contract: snip20Address,
      address: keplrAccount,
      key: viewingKey,
      height: String(height)
    })
  }

  async function getBridgeDepositBalance(snip20Address: string): Promise<string | boolean> {
    if (!keplrClient) {
      return false
    }

    const viewingKey = await getViewingKey({
      keplr: keplrObject,
      chainId: scrtChainId,
      address: snip20Address
    })

    return await QueryDeposit({
      cosmJS: keplrClient,
      contract: snip20Address,
      address: keplrAccount,
      key: viewingKey
    })
  }

  async function getBalance() {
    if (!tokenBalance) {
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
    if (!rewardsTokenBalance) {
      getBridgeRewardsBalance(rewardsAddress).then(rewardBalance => {
        if (rewardBalance) {
          setRewardsTokenBalance(Number(rewardBalance))
        }
      })
    }

    if (!depositTokenBalance) {
      getBridgeDepositBalance(rewardsAddress).then(depositBalance => {
        if (depositBalance) {
          setDepositTokenBalance(Number(depositBalance))
        }
      })
    }
  }

  async function unlockToken() {
    if (!keplrObject) {
      keplrObject = getKeplrObject()
    } else {
      try {
        await keplrObject.suggestToken(scrtChainId, stakedToken.address)
        await sleep(1000)
        getBalance()
      } catch (error) {
        console.error(error)
      }
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

  console.log(tokenBalance, rewardsTokenBalance, depositTokenBalance)

  return (
    <StakingCard highlight={depositTokenBalance && depositTokenBalance !== 0} show={show}>
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
            <p style={{ margin: 0 }}>{t('apy', { apy: numberToPercent(33) })}</p>
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
                    <RowBetween>
                      <Text>{t('stakableTokenAmount')}</Text>
                      {!tokenBalance ? (
                        <Loader />
                      ) : (
                        <Text>
                          {displayNumber(numberToSignificant(tokenBalance))} {stakedToken.symbol}
                        </Text>
                      )}
                    </RowBetween>
                    {depositTokenBalance > 0 && (
                      <RowBetween>
                        <Text>{t('stakedTokenAmount')}</Text>
                        {numberToSignificant(depositTokenBalance)} {stakedToken.symbol}
                      </RowBetween>
                    )}
                    {depositTokenBalance > 0 && (
                      <>
                        <RowBetween>
                          <Text>{t('yourPoolShare')}</Text>
                          {numberToUsd(0)} ({numberToPercent(0)})
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
                            <Dots>{t('loading')}</Dots>
                          </RowBetween>
                        )}
                      </>
                    )}

                    {tokenBalance && tokenBalance !== 0 && (
                      <ButtonSecondary as={Link} width="100%" to={`/stake/scrt/${stakedToken.symbol.toLowerCase()}`}>
                        {t('stake')}
                      </ButtonSecondary>
                    )}
                  </>
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
              <Text>{numberToUsd(9197829.42)}</Text>
            </RowBetween>
            <RowBetween style={{ alignItems: 'flex-start' }}>
              <Text>{t('stakePoolRewards')}</Text>
              <Text style={{ textAlign: 'end' }}>
                <div>
                  {t('stakeRewardPerDay', {
                    rate: 100,
                    currencySymbol: 'sSCRT'
                  })}
                </div>

                <div style={{ textAlign: 'end', marginTop: '8px' }}>{t('apy', { apy: numberToPercent(33) })}</div>
              </Text>
            </RowBetween>
          </AutoColumn>
        )}
      </AutoColumn>
    </StakingCard>
  )
}
