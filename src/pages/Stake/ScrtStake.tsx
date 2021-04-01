import React, { useCallback, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { NavigationCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { RowBetween } from '../../components/Row'
import { useTranslation } from 'react-i18next'
import { secretYFL, SINGLE_POOLS, YFL } from '../../constants'
import AppBody from '../AppBody'
import { Dots, Wrapper } from '../Pool/styleds'
import QuestionHelper from '../../components/QuestionHelper'
import { Text } from 'rebass'
import { divDecimals } from '../../utils/numberUtils'
import KeplrConnect, { getKeplrClient, getKeplrObject, getViewingKey } from '../../components/KeplrConnect'
import { useGetKplrConnect } from '../../state/keplr/hooks'
import { SigningCosmWasmClient } from 'secretjs'
import { Snip20GetBalance } from '../../components/KeplrConnect/snip20'
import { sleep } from '../../utils/sleep'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import ScrtStakingCard from '../../components/PositionCard/scrtStakingCard'
import { ETHER } from '@uniswap/sdk'
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

export const ExternalButton = styled.a`
  padding: 18px;
  font-weight: 500;
  text-align: center;
  border-radius: ${({ theme }) => theme.borderRadius};
  outline: none;
  border: 1px solid transparent;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  font-size: 16px;
  z-index: 1;
  &:disabled {
    cursor: auto;
  }
  background: ${({ theme }) => theme.buttonBG};
  color: ${({ theme }) => theme.buttonTextColor};
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

  > * {
    user-select: none;
  }
`

export default function ScrtStake({
  match: {
    params: { currency }
  }
}: RouteComponentProps<{ currency: string }>) {
  const { t } = useTranslation()
  const scrtChainId = 'secret-2'
  const { keplrConnected, keplrAccount } = useGetKplrConnect()
  let keplrObject = getKeplrObject()
  const [status, setStatus] = useState('Unlock')
  const [unstaking, setUnstaking] = useState(false)
  const [found, setFound] = useState(false)
  const [poolDetails, setPoolDetails] = useState<any>(undefined)
  const [input, setInput] = useState('')
  const [balance, setBalance] = useState<any>(undefined)
  const [keplrClient, setKeplrClient] = useState<SigningCosmWasmClient | undefined>(undefined)
  const onFieldInput = useCallback(
    (typedValue: string) => {
      setInput(typedValue)
    },
    [setInput]
  )

  let stakedToken = secretYFL
  const pool = SINGLE_POOLS[currency.toUpperCase()]
  if (!found) {
    if (typeof pool !== 'undefined') {
      setFound(true)
      setPoolDetails(pool)
    }
    stakedToken = pool.stakedToken
  }

  async function getSnip20Balance(snip20Address: string, decimals?: string | number): Promise<boolean | string> {
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

  async function getBalance() {
    if (!balance && found) {
      getSnip20Balance(stakedToken.address, stakedToken.decimals).then(tokenBalance => {
        if (tokenBalance !== 'Fix Unlock' && tokenBalance !== 'Unlock') {
          setStatus('Unlocked')
          if (tokenBalance) {
            setBalance(String(tokenBalance))
          }
        } else {
          setStatus(tokenBalance)
        }
      })
    }
  }

  if (!keplrObject) {
    keplrObject = getKeplrObject()
  } else {
    if (keplrAccount) {
      if (!keplrClient) {
        setKeplrClient(getKeplrClient(keplrAccount))
      }
      getBalance()
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

  async function stakeTokens() {
    setUnstaking(true)
  }

  const newActive = useNavigationActiveItemManager()
  useEffect(() => {
    newActive('stake')
  })

  if (!found) {
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
              <ActiveText>
                {t('stakeSingleToken', {
                  currencyASymbol: stakedToken.symbol
                })}
              </ActiveText>
              <QuestionHelper
                text={t('stakeSingleDescription', {
                  currencyASymbol: stakedToken.symbol
                })}
              />
            </RowBetween>
          </Tabs>
          <Wrapper>
            <AutoColumn gap={'12px'}>
              {status === 'Unlocked' ? (
                <CurrencyInputPanel
                  label={stakedToken.symbol}
                  hideCurrencySelect={true}
                  value={input}
                  onUserInput={onFieldInput}
                  onMax={() => {
                    setInput(balance)
                  }}
                  currency={ETHER}
                  balanceOveride
                  newBalance={Number(balance)}
                  showMaxButton={!input || parseFloat(input) < parseFloat(balance)}
                  id={`stake-${stakedToken.symbol.toLowerCase()}-src-token`}
                />
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
              {keplrConnected ? (
                <>
                  {input ? (
                    <>
                      {parseFloat(input) > parseFloat(balance) ? (
                        <ButtonPrimary disabled={true}>
                          {t('insufficientCurrencyBalance', {
                            inputCurrency: stakedToken.symbol
                          })}
                        </ButtonPrimary>
                      ) : (
                        <ButtonPrimary
                          onClick={() => {
                            stakeTokens()
                          }}
                          disabled={unstaking}
                        >
                          {unstaking ? <Dots>{t('staking')}</Dots> : t('stake')}
                        </ButtonPrimary>
                      )}
                    </>
                  ) : (
                    <>{status === 'Unlocked' && <ButtonPrimary disabled={true}>{t('enterAmount')}</ButtonPrimary>}</>
                  )}
                </>
              ) : (
                <KeplrConnect />
              )}
            </AutoColumn>
          </Wrapper>
        </AppBody>
        <AutoColumn style={{ marginTop: '1rem', maxWidth: '420px', width: '100%' }}>
          <ScrtStakingCard values={poolDetails} show={true} index={0} />
        </AutoColumn>
      </>
    )
  }
}
