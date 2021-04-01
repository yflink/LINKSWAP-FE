import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { BlueCard, NavigationCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { RowBetween } from '../../components/Row'
import { Trans, useTranslation } from 'react-i18next'
import AppBody from '../AppBody'
import { Dots, Wrapper } from '../Pool/styleds'
import QuestionHelper from '../../components/QuestionHelper'
import { SINGLE_POOLS } from '../../constants'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { Field } from '../../state/mint/actions'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'
import { TokenAmount } from '@uniswap/sdk'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { Text } from 'rebass'
import { ButtonLight, ButtonPrimary } from '../../components/Button'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { calculateGasMargin, getContract } from '../../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import ReactGA from 'react-ga'
import { mphPool } from '../../components/ABI'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { useTransactionAdder } from '../../state/transactions/hooks'
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

const CustomInput = styled(NumericalInput)`
  background-color: ${({ theme }) => theme.appCurrencyInputBG};
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.borderRadius};
  flex: 0 0 60px
  font-size: 16px;
`

const LendingDurationWrapper = styled.div`
  display: flex;
  flex: 0 0 100%;
  flex-wrap: wrap;
  width: 100%;
`

const LendingDuration = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 0 0 100%;
  width: 100%;
`

const DurationSelect = styled.div<{ isActive?: boolean }>`
  display: flex;
  color: ${({ theme, isActive }) => (isActive ? theme.buttonTextColor : theme.buttonSecondaryTextColor)};
  background-color: ${({ theme, isActive }) => (isActive ? theme.buttonBG : theme.buttonSecondaryBG)};
  padding: 6px 10px;
  font-weight: 500;
  text-align: center;
  border-radius: ${({ theme }) => theme.borderRadius};

  &:hover {
    background-color: ${({ theme, isActive }) => (isActive ? theme.buttonBGHover : theme.buttonSecondaryBGHover)};
    cursor: pointer;
  }

  &::selection {
    background: transparent;
  }
`

const ExternalLink = styled.a`
  color: ${({ theme }) => theme.textPrimary};
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`

export default function MphVault({
  match: {
    params: { vaultName }
  }
}: RouteComponentProps<{ vaultName?: string }>) {
  const { account, chainId, library } = useActiveWeb3React()
  const { t } = useTranslation()
  const [depositing, setDepositing] = useState(false)
  const [duration, setDuration] = useState(7)
  const currentVaultName = vaultName ? vaultName.toUpperCase() : 'NONE'
  const currentVault: Record<string, any> | undefined = SINGLE_POOLS[currentVaultName]
  const currency = currentVault?.tokens[0]
  const vaultAddress = currentVault?.rewardsAddress
  const userBalance = useTokenBalance(account ?? undefined, currency)
  const toggleWalletModal = useWalletModalToggle()
  const addTransaction = useTransactionAdder()
  const { independentField, typedValue } = useMintState()
  const { dependentField, currencies, currencyBalances, parsedAmounts, noLiquidity } = useDerivedMintInfo(
    currency ?? undefined,
    undefined
  )
  const { onFieldAInput } = useMintActionHandlers(noLiquidity)
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmountSpend(currencyBalances[field])
    }
  }, {})
  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0')
    }
  }, {})
  const { [Field.CURRENCY_A]: parsedAmountA } = parsedAmounts
  const [approvalA, approveACallback] = useApproveCallback(parsedAmountA, vaultAddress)
  const presetDurations = [7, 14, 30, 60, 90, 180, 365]
  let buttonString = parsedAmountA ? t('deposit') : t('enterAmount')
  let hasError
  if (
    (parsedAmountA &&
      Number(parsedAmounts[Field.CURRENCY_A]?.toExact()) > Number(maxAmounts[Field.CURRENCY_A]?.toExact())) ||
    Number(userBalance?.toSignificant(currency.decimals)) === 0
  ) {
    buttonString = t('insufficientCurrencyBalance', { inputCurrency: currencies[Field.CURRENCY_A]?.symbol })
    hasError = true
  } else {
    hasError = false
  }

  if (duration < 7) {
    buttonString = t('minimumDuration', { minDuration: 7 })
    hasError = true
  }

  if (duration > 365) {
    setDuration(365)
  }

  async function onDeposit() {
    if (!chainId || !library || !account) return

    const router = getContract(vaultAddress, mphPool, library, account)
    if (!parsedAmountA) {
      return
    }

    const estimate = router.estimateGas.deposit
    const method: (...args: any) => Promise<TransactionResponse> = router.deposit
    const today = new Date(Date.now())
    const maturationTimestamp = Math.floor(today.setDate(today.getDate() + duration) / 1000.0) + 3600
    const args: Array<string | string[] | number> = [parsedAmountA.raw.toString(), maturationTimestamp]
    const value: BigNumber | null = null
    await estimate(...args, value ? { value } : {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then(response => {
          setDepositing(true)
          addTransaction(response, {
            summary: t('deposit88AmountIntoVault', {
              vaultName: vaultName,
              amount: parsedAmountA.toSignificant(3)
            })
          })
          ReactGA.event({
            category: 'Staking',
            action: 'Deposit',
            label: currencies[Field.CURRENCY_A]?.symbol
          })
        })
      )
      .catch(error => {
        setDepositing(false)
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
              <ActiveText>{t('deposit88IntoVault', { vaultName: currency.symbol })}</ActiveText>
              <QuestionHelper text={t('deposit88IntoVaultDescription', { vaultName: vaultName })} />
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
            <AutoColumn gap="20px">
              <CurrencyInputPanel
                hideCurrencySelect={true}
                value={formattedAmounts[Field.CURRENCY_A]}
                onUserInput={onFieldAInput}
                onMax={() => {
                  onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                }}
                showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                currency={currencies[Field.CURRENCY_A]}
                id="stake-input-tokena"
                showCommonBases
              />
              <LendingDurationWrapper>
                <Text style={{ margin: '0 0 12px' }}>{t('deposit88PresetDuration')}</Text>
                <LendingDuration>
                  {presetDurations.map((itemDuration, index) => (
                    <DurationSelect
                      isActive={duration === itemDuration}
                      key={index}
                      onClick={() => {
                        setDuration(itemDuration)
                      }}
                    >
                      {t('daysShort', { days: itemDuration })}
                    </DurationSelect>
                  ))}
                </LendingDuration>
              </LendingDurationWrapper>
              <RowBetween>
                <Text>{t('deposit88CustomDuration')}</Text>
                <CustomInput
                  className="custom-duration"
                  value={duration}
                  align="right"
                  onUserInput={val => {
                    setDuration(Number(val))
                  }}
                />
              </RowBetween>
              {!account ? (
                <ButtonLight onClick={toggleWalletModal}>{t('connectWallet')}</ButtonLight>
              ) : (
                <AutoColumn gap={'md'}>
                  {approvalA === ApprovalState.NOT_APPROVED || approvalA === ApprovalState.PENDING ? (
                    <RowBetween>
                      <ButtonPrimary
                        onClick={approveACallback}
                        disabled={approvalA === ApprovalState.PENDING}
                        width="100%"
                      >
                        {approvalA === ApprovalState.PENDING ? <Dots>{t('approving')}</Dots> : t('approve')}
                      </ButtonPrimary>
                    </RowBetween>
                  ) : depositing ? (
                    <ButtonPrimary disabled={true}>
                      <Dots>{t('depositing')}</Dots>
                    </ButtonPrimary>
                  ) : (
                    <ButtonPrimary
                      onClick={() => {
                        onDeposit()
                      }}
                      disabled={approvalA !== ApprovalState.APPROVED || hasError}
                    >
                      {buttonString}
                    </ButtonPrimary>
                  )}
                </AutoColumn>
              )}
              <BlueCard>
                <AutoColumn gap="10px">
                  <Text fontSize="14px">{t('deposit88IntoVaultStep1', { currencySymbol: currency.symbol })}</Text>
                  <Text fontSize="14px">{t('deposit88IntoVaultStep2')}</Text>
                  <Text fontSize="14px">{t('deposit88IntoVaultStep3')}</Text>
                  <Text fontSize="14px">{t('deposit88IntoVaultStep4')}</Text>
                  <Text fontSize="14px">{t('deposit88IntoVaultStep5')}</Text>
                </AutoColumn>
              </BlueCard>
            </AutoColumn>
          </Wrapper>
        </AppBody>
      </>
    )
  }
}
