import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'

import { Currency, ETHER, FACTORY_ADDRESS, TokenAmount, WETH } from '@uniswap/sdk'
import React, { useCallback, useContext, useState } from 'react'
import { Steps, Slider } from 'antd'
import { AlertTriangle, Plus } from 'react-feather'
import ReactGA from 'react-ga'
import { RouteComponentProps } from 'react-router-dom'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { ButtonGray, ButtonPrimary } from '../../components/Button'
import Card, { BlueCard, OutlineCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import CurrencyInputPanel, { CurrencyDoubleInputPanel } from '../../components/CurrencyInputPanel'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { SwapPoolTabs, CreateTabs } from '../../components/NavigationTabs'
import { RowBetween, RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { LINK, ROUTER_ADDRESS, WETHER, YFL } from '../../constants'
import './slider.css'
import './steps.css'
import { RateSVG } from '../../components/SVG'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { Field } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { TYPE } from '../../theme'
import { getContract } from '../../utils'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import AppBody, { AppBodyDark } from '../AppBody'
import { Wrapper } from '../Pool/styleds'
import { currencyId } from '../../utils/currencyId'
import { useTranslation } from 'react-i18next'
import Toggle from '../../components/Toggle'
import { numberToSignificant, numberToUsd } from '../../utils/numberUtils'
import { Dots } from '../../components/swap/styleds'
import { useGetPriceBase } from '../../state/price/hooks'
import { useCurrencyUsdPrice } from '../../hooks/useCurrencyUsdPrice'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { transparentize } from 'polished'
import { Factory } from '../../components/ABI'
import { useETHBalances, useTokenBalance } from '../../state/wallet/hooks'

const { Step } = Steps

const StepsContainer = styled.div`
  .ant-steps-item-active .ant-steps-item-icon {
    background-color: ${({ theme }) => theme.appCurrencyInputBGActive};

    color: ${({ theme }) => theme.appCurrencyInputTextColorActive};
  }

  .ant-steps-item-wait .ant-steps-item-icon {
    background-color: ${({ theme }) => theme.appCurrencyInputBG};
    color: ${({ theme }) => theme.appCurrencyInputTextColor};
  }

  .ant-steps-item-finish .ant-steps-item-icon {
    background-color: ${({ theme }) => theme.appInfoBoxBG};
    color: ${({ theme }) => theme.appInfoBoxTextColor};
  }
`

const SvgIcon = styled.div`
  position: absolute;
  right: 14px;
  top: 10px;

  > svg {
    height: 14px;
    width: auto;
    fill: ${({ theme }) => theme.textPrimary};
  }
`
const SliderWrapper = styled.div`
  margin: 24px 0 0;

  .ant-slider-track {
    background-color: ${({ theme }) => theme.modalInputBorderFocus};
  }

  .ant-slider-handle {
    background-color: ${({ theme }) => theme.textPrimary};
    border-color: ${({ theme }) => theme.textPrimary};
  }
`
const CreationSummary = styled(Card)`
  font-size: 14px;
  line-height: 18px;
  background-color: ${({ theme }) => theme.appBoxBG};
`

const ButtonRow = styled.div`
  display: flex;
  flex: 0 0 100%;
  justify-content: space-between;
  margin: 0 0 18px;
`

const CurrencyButton = styled(ButtonPrimary)<{ active?: boolean }>`
  width: 30%;
  flex: 0 0 30%;
  pointer-events: ${({ active }) => (active ? 'none' : 'auto')};
  background-color: ${({ active, theme }) => (active ? theme.buttonBG : theme.buttonBGDisabled)};
  padding: 0;
  height: 54px;
`

const ErrorInner = styled.div`
  background-color: ${({ theme }) => transparentize(0.9, theme.red1)};
  border-radius: 1rem;
  display: flex;
  align-items: center;
  font-size: 0.825rem;
  width: 100%;
  padding: 1rem;
  margin-top: 18px;
  color: ${({ theme }) => theme.red1};
  p {
    padding: 0;
    margin: 0;
    font-weight: 500;
  }
`

const ErrorInnerAlertTriangle = styled.div`
  background-color: ${({ theme }) => transparentize(0.9, theme.red1)};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-inline-end: 12px;
  border-radius: 6px;
  min-width: 48px;
  height: 48px;
`

export default function CreateNewPool({
  match: {
    params: { currencyIdA, currencyIdB }
  },
  history
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const { account, chainId, library } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)
  const LINKcurrency = unwrappedToken(LINK)
  const YFLcurrency = unwrappedToken(YFL)

  const [isActive, setIsActive] = useState(false)
  const [period, setPeriod] = useState({ label: 'none', time: 0 })
  const [step, setStep] = useState(0)
  const [feeCurrency, setFeeToken] = useState(YFLcurrency)

  const { independentField, typedValue, otherTypedValue } = useMintState()
  const { dependentField, currencies, currencyBalances, parsedAmounts, noLiquidity } = useDerivedMintInfo(
    currencyA ?? undefined,
    currencyB ?? undefined
  )
  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field])
      }
    },
    {}
  )

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0')
      }
    },
    {}
  )

  const addTransaction = useTransactionAdder()

  const { t } = useTranslation()

  const marks = {
    0: {
      style: {
        whiteSpace: 'nowrap'
      },
      label: t('weekSingular')
    },
    33: {
      style: {
        whiteSpace: 'nowrap'
      },
      label: t('monthSingular')
    },
    67: {
      style: {
        whiteSpace: 'nowrap'
      },
      label: t('monthPlural', { months: 3 })
    },
    100: {
      style: {
        whiteSpace: 'nowrap'
      },
      label: t('monthPlural', { months: 6 })
    }
  }

  const priceObject = useGetPriceBase()
  let feeAmountUsd
  let feeCurrencyCount
  let feeToken
  switch (feeCurrency) {
    case ETHER:
      feeAmountUsd = numberToUsd(3000)
      feeCurrencyCount = 3000 / priceObject['ethPriceBase']
      feeToken = undefined
      break

    case LINKcurrency:
      feeAmountUsd = numberToUsd(2500)
      feeCurrencyCount = 2500 / priceObject['linkPriceBase']
      feeToken = LINK
      break

    default:
      feeAmountUsd = numberToUsd(2000)
      feeCurrencyCount = 2000 / priceObject['ethPriceBase']
      feeToken = YFL
  }

  const handleCurrencyASelect = useCallback(
    (currencyA: Currency) => {
      const newCurrencyIdA = currencyId(currencyA)
      if (newCurrencyIdA === currencyIdB) {
        history.push(`/create/${currencyIdB}/${currencyIdA}`)
      } else {
        history.push(`/create/${newCurrencyIdA}/${currencyIdB}`)
      }
    },
    [currencyIdB, history, currencyIdA]
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB: Currency) => {
      const newCurrencyIdB = currencyId(currencyB)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          history.push(`/create/${currencyIdB}/${newCurrencyIdB}`)
        } else {
          history.push(`/create/${newCurrencyIdB}`)
        }
      } else {
        history.push(`/create/${currencyIdA ? currencyIdA : 'ETH'}/${newCurrencyIdB}`)
      }
    },
    [currencyIdA, history, currencyIdB]
  )

  const [rate, setRate] = useState('1')

  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS)
  const approvalCParse =
    !!feeToken && feeCurrencyCount !== Infinity
      ? new TokenAmount(feeToken, BigInt(Math.ceil(feeCurrencyCount)))
      : undefined
  const [approvalC, approveCCallback] = useApproveCallback(approvalCParse, ROUTER_ADDRESS)

  const handleTypeCurrencyA = useCallback(
    (value: string) => {
      const inputValue = Number(value) ?? 0
      const inputValueB = inputValue * Number(rate)
      onFieldAInput(inputValue.toString())
      onFieldBInput(inputValueB.toString())
    },
    [onFieldAInput, onFieldBInput, rate]
  )
  const handleTypeCurrencyB = useCallback(
    (value: string) => {
      const inputValue = Number(value) ?? 0
      const inputValueA = inputValue / Number(rate)
      onFieldAInput(inputValueA.toString())
      onFieldBInput(inputValue.toString())
    },
    [onFieldAInput, onFieldBInput, rate]
  )

  let error = false
  if (Number(formattedAmounts[Field.CURRENCY_A]) > Number(maxAmounts[Field.CURRENCY_A]?.toExact()) && step === 2) {
    error = t('insufficientCurrencyBalance', { inputCurrency: currencyA?.symbol })
  }

  if (
    Number(formattedAmounts[Field.CURRENCY_B]) > Number(maxAmounts[Field.CURRENCY_B]?.toExact()) &&
    !error &&
    step === 2
  ) {
    error = t('insufficientCurrencyBalance', { inputCurrency: currencyB?.symbol })
  }

  if (isActive && step === 2) {
    const rugLockBarrier = 100000
    const priceBase = currencyA?.symbol === 'LINK' ? priceObject['linkPriceBase'] : priceObject['ethPriceBase']
    const rugLockTokenBarrier = numberToSignificant(rugLockBarrier / priceBase, 2)
    error =
      Number(formattedAmounts[Field.CURRENCY_A]) < rugLockTokenBarrier
        ? t('insufficientLiquidityForRuglock', { currencySymbol: currencyA?.symbol, minimum: rugLockTokenBarrier })
        : error
  }

  if (!isActive && step === 2) {
    const minimalLiquidityBarrier = 1000
    const priceBase = currencyA?.symbol === 'LINK' ? priceObject['linkPriceBase'] : priceObject['ethPriceBase']
    const tokenBarrier = numberToSignificant(minimalLiquidityBarrier / priceBase, 2)
    error =
      Number(formattedAmounts[Field.CURRENCY_A]) < tokenBarrier
        ? t('insufficientLiquidityForPairCreation', { currencySymbol: currencyA?.symbol, minimum: tokenBarrier })
        : error
  }

  const userLinkBalance = useTokenBalance(account ?? undefined, LINK)
  const userYflBalance = useTokenBalance(account ?? undefined, YFL)
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  if (step === 3) {
    if (currencyA?.symbol === 'LINK' && feeToken === LINK) {
      if (Number(formattedAmounts[Field.CURRENCY_A]) + feeCurrencyCount > Number(userLinkBalance?.toExact())) {
        error = t('insufficientTokenBalanceForFee', { currencySymbol: currencyA?.symbol })
      }
    }

    if (currencyA?.symbol !== 'LINK' && !feeToken) {
      if (Number(formattedAmounts[Field.CURRENCY_A]) + feeCurrencyCount > Number(userEthBalance?.toExact())) {
        error = t('insufficientTokenBalanceForFee', { currencySymbol: 'ETH' })
      }
    }

    if (feeToken === YFL) {
      if (feeCurrencyCount > Number(userYflBalance?.toExact())) {
        error = t('insufficientTokenBalanceForFee', { currencySymbol: 'YFL' })
      }
    }

    if (feeToken === LINK) {
      if (feeCurrencyCount > Number(userLinkBalance?.toExact())) {
        error = t('insufficientTokenBalanceForFee', { currencySymbol: 'YFL' })
      }
    }

    if (!feeToken) {
      if (feeCurrencyCount > Number(userEthBalance?.toExact())) {
        error = t('insufficientTokenBalanceForFee', { currencySymbol: 'YFL' })
      }
    }
  }

  useCurrencyUsdPrice()

  const redirectUrl = `/created/${currencyIdA}/${currencyIdB}`
  async function createPair(
    newToken: string,
    newTokenAmount: string,
    lockupToken: string,
    lockupTokenAmount: string,
    LockupPeriod: number,
    listingFeeToken: string
  ) {
    if (!account || !library || !chainId) return
    const router = getContract(FACTORY_ADDRESS, Factory, library, account)
    const args: Array<string | number> = [
      newToken,
      newTokenAmount,
      lockupToken,
      lockupTokenAmount,
      LockupPeriod,
      listingFeeToken
    ]
    const method: (...args: any) => Promise<TransactionResponse> = router.createPair
    method(...args, { gasLimit: 3865729 })
      .then(response => {
        addTransaction(response, {
          summary: t('createNewPair', {
            currencyASymbol: currencyA?.symbol,
            currencyBSymbol: currencyB?.symbol
          })
        })

        ReactGA.event({
          category: 'Create',
          action: 'CreateNewPair',
          label: currencyA?.symbol + ' | ' + currencyB?.symbol
        })
        window.open(redirectUrl, '_self')
      })

      .catch(error => {
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }

  const chainIdentifier = chainId ?? 1
  const newToken = currencyIdB ?? ''
  const newTokenAmount = parsedAmounts[Field.CURRENCY_B]?.raw.toString() ?? '0'
  const lockupToken = currencyIdA === 'ETH' ? WETH[chainIdentifier].address : currencyIdA ?? ''
  const lockupTokenAmount = parsedAmounts[Field.CURRENCY_A]?.raw.toString() ?? '0'
  const LockupPeriod = period.time
  const listingFeeToken = !feeToken ? WETH[chainIdentifier].address : feeToken?.address ?? ''

  return (
    <>
      <Card style={{ maxWidth: '420px', padding: '12px', backgroundColor: theme.appBGColor, marginBottom: '16px' }}>
        <SwapPoolTabs active={'create'} />
      </Card>
      <AppBody>
        <CreateTabs />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <StepsContainer style={{ width: 320, display: 'flex', alignItems: 'flex-center', marginBottom: 16 }}>
            <Steps size="small" labelPlacement="vertical" current={step}>
              <Step className="white" title={t('pairing')} />
              <Step className="white" title={t('rate')} />
              <Step className="white" title={t('liquidity')} />
              <Step className="white" title={t('payment')} />
            </Steps>
          </StepsContainer>
        </div>
        {step === 0 ? (
          <Wrapper>
            <AutoColumn gap="20px">
              {noLiquidity ? (
                <ColumnCenter>
                  <BlueCard>
                    <AutoColumn gap="10px">
                      <TYPE.link fontWeight={600} color={theme.appInfoBoxTextColor}>
                        {t('firstLiquidityProvider')}
                      </TYPE.link>
                      <TYPE.link fontWeight={400} color={theme.appInfoBoxTextColor}>
                        {t('ratioSetsPrice')}
                      </TYPE.link>
                    </AutoColumn>
                  </BlueCard>
                </ColumnCenter>
              ) : !currencyB ? (
                <ColumnCenter>
                  <BlueCard>
                    <AutoColumn gap="10px">
                      <TYPE.link fontWeight={600} color={theme.appInfoBoxTextColor}>
                        {t('noPairSelected')}
                      </TYPE.link>
                      <TYPE.link fontWeight={400} color={theme.appInfoBoxTextColor}>
                        {t('selectCurrencies')}
                      </TYPE.link>
                    </AutoColumn>
                  </BlueCard>
                </ColumnCenter>
              ) : (
                <ColumnCenter>
                  <BlueCard>
                    <AutoColumn gap="10px">
                      <TYPE.link fontWeight={600} color={theme.appInfoBoxTextColor}>
                        {t('poolAlreadyExists')}
                      </TYPE.link>
                      <TYPE.link fontWeight={400} color={theme.appInfoBoxTextColor}>
                        {t('cannotCreatePool')}
                      </TYPE.link>
                    </AutoColumn>
                  </BlueCard>
                </ColumnCenter>
              )}
              <CurrencyDoubleInputPanel
                hideSelect
                value={formattedAmounts[Field.CURRENCY_A]}
                onUserInput={onFieldAInput}
                onMax={() => {
                  onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                }}
                onCurrencySelect={handleCurrencyASelect}
                showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                currency={currencies[Field.CURRENCY_A]}
                id="add-liquidity-input-tokena"
                showCommonBases
              />
              <ColumnCenter>
                <Plus size="16" color={theme.textSecondary} />
              </ColumnCenter>
              <CurrencyInputPanel
                hideSelect
                value={formattedAmounts[Field.CURRENCY_B]}
                onUserInput={onFieldBInput}
                onCurrencySelect={handleCurrencyBSelect}
                onMax={() => {
                  onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                }}
                showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                currency={currencies[Field.CURRENCY_B]}
                id="add-liquidity-input-tokenb"
                showCommonBases
              />
            </AutoColumn>
          </Wrapper>
        ) : step === 1 ? (
          <Wrapper>
            <AutoColumn>
              <div style={{ backgroundColor: theme.appBoxBG, padding: '12px', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <Text fontSize={12}>1 {currencies[Field.CURRENCY_A]!.symbol} =</Text>
                  <SvgIcon>
                    <RateSVG />
                  </SvgIcon>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <NumericalInput
                    style={{ backgroundColor: theme.appBoxBG }}
                    className="token-amount-input"
                    value={rate}
                    onUserInput={val => {
                      setRate(val)
                    }}
                  />
                  <Text fontWeight={600} fontSize={18} style={{ marginInlineEnd: '4px' }}>
                    {currencies[Field.CURRENCY_B]!.symbol}
                  </Text>
                </div>
              </div>
            </AutoColumn>
          </Wrapper>
        ) : step === 2 ? (
          <Wrapper>
            <AutoColumn gap="20px">
              <CurrencyDoubleInputPanel
                value={formattedAmounts[Field.CURRENCY_A]}
                onUserInput={handleTypeCurrencyA}
                onMax={() => {
                  onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                  onFieldBInput((Number(maxAmounts[Field.CURRENCY_A]?.toExact()) * Number(rate)).toString() ?? '')
                }}
                onCurrencySelect={handleCurrencyASelect}
                showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                currency={currencies[Field.CURRENCY_A]}
                id="add-liquidity-input-tokena"
                showCommonBases
                disableCurrencySelect
              />
              <ColumnCenter>
                <Plus size="16" color={theme.textSecondary} />
              </ColumnCenter>
              <CurrencyInputPanel
                value={formattedAmounts[Field.CURRENCY_B]}
                onUserInput={handleTypeCurrencyB}
                onCurrencySelect={handleCurrencyBSelect}
                onMax={() => {
                  onFieldAInput((Number(maxAmounts[Field.CURRENCY_B]?.toExact()) / Number(rate)).toString() ?? '')
                  onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                }}
                showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                currency={currencies[Field.CURRENCY_B]}
                id="add-liquidity-input-tokenb"
                showCommonBases
                disableCurrencySelect
              />
            </AutoColumn>
            {error && (
              <ErrorInner>
                <ErrorInnerAlertTriangle>
                  <AlertTriangle size={24} />
                </ErrorInnerAlertTriangle>
                <p>{error}</p>
              </ErrorInner>
            )}
            <AutoColumn style={{ marginTop: '24px' }}>
              <OutlineCard>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text fontWeight={700} fontSize={14} style={{ marginBottom: '6px' }}>
                      RugLock
                    </Text>
                    <TYPE.black fontWeight={400} fontSize={14} color={theme.textSecondary}>
                      {t('rugLockTokens')}
                    </TYPE.black>
                  </div>
                  <Toggle
                    id="toggle-rucklog-button"
                    isActive={isActive}
                    toggle={() => {
                      setIsActive(!isActive)
                      if (!isActive) {
                        setPeriod({ label: t('monthPlural', { months: 3 }), time: 15768000 })
                      } else {
                        setPeriod({ label: 'none', time: 0 })
                      }
                    }}
                  />
                </div>
                {isActive && (
                  <SliderWrapper>
                    <Slider
                      marks={marks}
                      step={null}
                      defaultValue={67}
                      tooltipVisible={false}
                      onChange={(val: number) => {
                        let label
                        let time
                        switch (val) {
                          case 33:
                            label = t('monthSingular')
                            time = 2628000
                            break
                          case 67:
                            label = t('monthPlural', { months: 3 })
                            time = 7884000
                            break
                          case 100:
                            label = t('monthPlural', { months: 6 })
                            time = 15768000
                            break

                          default:
                            label = t('weekSingular')
                            time = 604800
                        }
                        setPeriod({ label: label, time: time })
                      }}
                    />
                  </SliderWrapper>
                )}
              </OutlineCard>
            </AutoColumn>
          </Wrapper>
        ) : (
          <Wrapper>
            <AutoColumn>
              <Text style={{ marginBottom: 18 }}>{t('payment')}</Text>
              <BlueCard style={{ padding: 14, marginBottom: 18 }}>
                <TYPE.body color={theme.appInfoBoxTextColor} textAlign="center">
                  {t('paymentDisclaimer')}
                </TYPE.body>
              </BlueCard>
              <Text style={{ marginBottom: 18 }}>{t('pairCreationSelectFeeToken')}</Text>
              <ButtonRow>
                <CurrencyButton
                  onClick={() => {
                    setFeeToken(ETHER)
                  }}
                  active={feeCurrency === ETHER}
                >
                  <CurrencyLogo currency={ETHER} size={'24px'} style={{ marginInlineEnd: '6px' }} position="button" />
                  ETH
                </CurrencyButton>
                <CurrencyButton
                  onClick={() => {
                    setFeeToken(LINKcurrency)
                  }}
                  active={feeCurrency === LINKcurrency}
                >
                  <CurrencyLogo currency={LINK} size={'24px'} style={{ marginInlineEnd: '6px' }} position="button" />
                  LINK
                </CurrencyButton>
                <CurrencyButton
                  onClick={() => {
                    setFeeToken(YFLcurrency)
                  }}
                  active={feeCurrency === YFLcurrency}
                >
                  <CurrencyLogo currency={YFL} size={'24px'} style={{ marginInlineEnd: '6px' }} position="button" /> YFL
                </CurrencyButton>
              </ButtonRow>
              {error && (
                <ErrorInner style={{ margin: '0 0 18px' }}>
                  <ErrorInnerAlertTriangle>
                    <AlertTriangle size={24} />
                  </ErrorInnerAlertTriangle>
                  <p>{error}</p>
                </ErrorInner>
              )}
              <Text style={{ marginBottom: 18 }}>{t('pairCreationSummary')}</Text>
              {currencyA && currencyB && (
                <CreationSummary>
                  <RowFixed style={{ marginBottom: 10 }}>
                    <DoubleCurrencyLogo currency0={currencyA} currency1={currencyB} margin={true} size={22} />
                    <div style={{ display: 'flex', position: 'relative' }}>
                      <p style={{ fontWeight: 500, fontSize: 18, margin: '0 4px' }}>{currencyA.symbol}</p>
                      <p style={{ fontWeight: 100, fontSize: 18, margin: '0 4px' }}> | </p>
                      <p style={{ fontWeight: 500, fontSize: 18, margin: '0 4px' }}>{currencyB.symbol}</p>
                    </div>
                  </RowFixed>
                  <AutoColumn gap="8px">
                    <RowBetween style={{ alignItems: 'flex-start' }}>
                      <Text>{t('pairCreationTokenAmount', { currency: currencyA.symbol })}</Text>
                      <Text>{numberToSignificant(formattedAmounts[Field.CURRENCY_A])}</Text>
                    </RowBetween>
                    <RowBetween style={{ alignItems: 'flex-start' }}>
                      <Text>{t('pairCreationTokenAmount', { currency: currencyB.symbol })}</Text>
                      <Text>{numberToSignificant(Number(formattedAmounts[Field.CURRENCY_A]) * Number(rate))}</Text>
                    </RowBetween>
                    <RowBetween style={{ alignItems: 'flex-start' }}>
                      <Text>RugLock</Text>
                      {isActive ? (
                        <Text>
                          {t('yes')} ({period.label})
                        </Text>
                      ) : (
                        <Text>{t('no')}</Text>
                      )}
                    </RowBetween>
                    <RowBetween style={{ alignItems: 'flex-start' }}>
                      <Text>{t('pairCreationFee', { currency: feeCurrency })}</Text>
                      {isActive ? (
                        <Text>{t('freeRuglockListing')}</Text>
                      ) : (
                        <Text>
                          {numberToSignificant(feeCurrencyCount)} {feeCurrency.symbol} ({feeAmountUsd})
                        </Text>
                      )}
                    </RowBetween>
                  </AutoColumn>
                </CreationSummary>
              )}
              {(approvalA !== ApprovalState.APPROVED ||
                approvalB !== ApprovalState.APPROVED ||
                (approvalC !== ApprovalState.APPROVED && feeCurrency !== ETHER)) && (
                <AutoColumn gap="18px">
                  <RowBetween style={{ marginTop: 18 }}>
                    <Text>{t('pairCreationApprovals')}</Text>
                  </RowBetween>
                  {approvalA !== ApprovalState.APPROVED && (
                    <RowBetween>
                      <ButtonPrimary onClick={approveACallback} disabled={approvalA === ApprovalState.PENDING}>
                        {approvalA === ApprovalState.PENDING ? (
                          <Dots>{t('approvingCurrency', { inputCurrency: currencies[Field.CURRENCY_A]?.symbol })}</Dots>
                        ) : (
                          t('approveCurrency', { inputCurrency: currencies[Field.CURRENCY_A]?.symbol })
                        )}
                      </ButtonPrimary>
                    </RowBetween>
                  )}
                  {approvalB !== ApprovalState.APPROVED && (
                    <RowBetween>
                      <ButtonPrimary onClick={approveBCallback} disabled={approvalB === ApprovalState.PENDING}>
                        {approvalB === ApprovalState.PENDING ? (
                          <Dots>{t('approvingCurrency', { inputCurrency: currencies[Field.CURRENCY_B]?.symbol })}</Dots>
                        ) : (
                          t('approveCurrency', { inputCurrency: currencies[Field.CURRENCY_B]?.symbol })
                        )}
                      </ButtonPrimary>
                    </RowBetween>
                  )}
                  {approvalC !== ApprovalState.APPROVED && feeCurrency !== ETHER && (
                    <RowBetween>
                      <ButtonPrimary onClick={approveCCallback} disabled={approvalC === ApprovalState.PENDING}>
                        {approvalC === ApprovalState.PENDING ? (
                          <Dots>{t('approvingCurrency', { inputCurrency: feeCurrency.symbol })}</Dots>
                        ) : (
                          t('approveCurrency', { inputCurrency: feeCurrency.symbol })
                        )}
                      </ButtonPrimary>
                    </RowBetween>
                  )}
                </AutoColumn>
              )}
            </AutoColumn>
          </Wrapper>
        )}
      </AppBody>
      <AppBodyDark>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {step !== 0 && (
            <ButtonGray style={{ marginInlineEnd: 8 }} onClick={() => setStep(Math.max(0, step - 1))}>
              {t('back')}
            </ButtonGray>
          )}
          {step === 3 ? (
            <>
              {approvalA === ApprovalState.APPROVED &&
              approvalB === ApprovalState.APPROVED &&
              (approvalC === ApprovalState.APPROVED || feeCurrency === ETHER) &&
              !error ? (
                <ButtonPrimary
                  onClick={() => {
                    createPair(newToken, newTokenAmount, lockupToken, lockupTokenAmount, LockupPeriod, listingFeeToken)
                  }}
                >
                  {t('createPair')}
                </ButtonPrimary>
              ) : (
                <ButtonGray disabled={true}>{t('createPair')}</ButtonGray>
              )}
            </>
          ) : (
            <>
              {!noLiquidity ||
              error ||
              (step === 0 && !currencyB) ||
              (step === 1 && !rate) ||
              (step === 2 && !formattedAmounts[Field.CURRENCY_A]) ? (
                <ButtonGray style={{ marginInlineStart: 8 }} disabled={true}>
                  {t('next')}
                </ButtonGray>
              ) : (
                <ButtonPrimary style={{ marginInlineStart: 8 }} onClick={() => setStep(Math.min(3, step + 1))}>
                  {t('next')}
                </ButtonPrimary>
              )}
            </>
          )}
        </div>
      </AppBodyDark>
    </>
  )
}
