import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'

import { Currency, ETHER, TokenAmount } from '@uniswap/sdk'
import React, { useCallback, useContext, useState } from 'react'
import { Steps, Slider } from 'antd'
import { Plus } from 'react-feather'
import ReactGA from 'react-ga'
import { RouteComponentProps } from 'react-router-dom'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { ButtonGray, ButtonPrimary, ButtonSecondary } from '../../components/Button'
import Card, { BlueCard, LightCard, OutlineCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import CurrencyInputPanel, { CurrencyDoubleInputPanel } from '../../components/CurrencyInputPanel'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { SwapPoolTabs, CreateTabs } from '../../components/NavigationTabs'
import Row, { RowBetween, RowFixed, RowFlat } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { LINK, YFL } from '../../constants'
import './slider.css'
import './steps.css'
import { RateSVG } from '../../components/SVG'

// import { ROUTER_ADDRESS } from '../../constants'
// import { PairState } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
// import { useApproveCallback } from '../../hooks/useApproveCallback'
// import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'

import { useTransactionAdder } from '../../state/transactions/hooks'
import { useUserDeadline, useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE } from '../../theme'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../../utils'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import AppBody, { AppBodyDark } from '../AppBody'
import { Wrapper } from '../Pool/styleds'
import { currencyId } from '../../utils/currencyId'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import { useTranslation } from 'react-i18next'
import Toggle from '../../components/Toggle'
import { numberToSignificant, numberToUsd } from '../../utils/numberUtils'
import { Dots } from '../../components/swap/styleds'
import { useGetPriceBase } from '../../state/price/hooks'
import { useCurrencyUsdPrice } from '../../hooks/useCurrencyUsdPrice'

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

  const [isActive, setIsActive] = useState(false)
  const [period, setPeriod] = useState({ label: 'none', time: 0 })
  const [step, setStep] = useState(0)
  const [feeToken, setFeeToken] = useState('YFL')

  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    // pair,
    // pairState,
    currencyBalances,
    parsedAmounts,
    // price,
    noLiquidity,
    liquidityMinted
    // poolTokenPercentage,
    // error
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  // const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const [deadline] = useUserDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const [txHash, setTxHash] = useState<string>('')

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

  // check whether the user has approved the router on the tokens
  // const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS)
  // const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS)

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
  let feeTokenCount
  switch (feeToken) {
    case 'ETH':
      feeAmountUsd = numberToUsd(3000)
      feeTokenCount = numberToSignificant(3000 / priceObject['ethPriceBase'])
      break

    case 'LINK':
      feeAmountUsd = numberToUsd(2500)
      feeTokenCount = numberToSignificant(2500 / priceObject['linkPriceBase'])
      break

    default:
      feeAmountUsd = numberToUsd(2000)
      feeTokenCount = numberToSignificant(2000 / priceObject['ethPriceBase'])
  }

  async function onAdd() {
    if (!chainId || !library || !account) return
    const router = getRouterContract(chainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0]
    }

    const deadlineFromNow = Math.ceil(Date.now() / 1000) + deadline

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null
    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER
      estimate = router.estimateGas.addLiquidityETH
      method = router.addLiquidityETH
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadlineFromNow
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      estimate = router.estimateGas.addLiquidity
      method = router.addLiquidity
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadlineFromNow
      ]
      value = null
    }

    setAttemptingTxn(true)
    await estimate(...args, value ? { value } : {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then(response => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary:
              'Add ' +
              parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
              ' ' +
              currencies[Field.CURRENCY_A]?.symbol +
              ' and ' +
              parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
              ' ' +
              currencies[Field.CURRENCY_B]?.symbol
          })

          setTxHash(response.hash)

          ReactGA.event({
            category: 'Liquidity',
            action: 'Add',
            label: [currencies[Field.CURRENCY_A]?.symbol, currencies[Field.CURRENCY_B]?.symbol].join('/')
          })
        })
      )
      .catch(error => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }

  const modalHeader = () => {
    return noLiquidity ? (
      <AutoColumn gap="20px">
        <LightCard mt="20px" borderRadius="20px">
          <RowFlat>
            <Text fontSize="48px" fontWeight={500} lineHeight="42px" marginRight={10}>
              {currencies[Field.CURRENCY_A]?.symbol + '/' + currencies[Field.CURRENCY_B]?.symbol}
            </Text>
            <DoubleCurrencyLogo
              currency0={currencies[Field.CURRENCY_A]}
              currency1={currencies[Field.CURRENCY_B]}
              size={30}
            />
          </RowFlat>
        </LightCard>
      </AutoColumn>
    ) : (
      <AutoColumn gap="20px">
        <RowFlat style={{ marginTop: '20px' }}>
          <Text fontSize="48px" fontWeight={500} lineHeight="42px" marginRight={10}>
            {liquidityMinted?.toSignificant(6)}
          </Text>
          <DoubleCurrencyLogo
            currency0={currencies[Field.CURRENCY_A]}
            currency1={currencies[Field.CURRENCY_B]}
            size={30}
          />
        </RowFlat>
        <Row>
          <Text fontSize="24px">
            {currencies[Field.CURRENCY_A]?.symbol + '/' + currencies[Field.CURRENCY_B]?.symbol + ' Pool Tokens'}
          </Text>
        </Row>
        <TYPE.italic fontSize={12} textAlign="left" padding={'8px 0 0 0 '}>
          {`Output is estimated. If the price changes by more than ${allowedSlippage /
            100}% your transaction will revert.`}
        </TYPE.italic>
      </AutoColumn>
    )
  }

  const modalBottom = () => {
    return <div onClick={onAdd} />
  }

  const pendingText = `Supplying ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
    currencies[Field.CURRENCY_A]?.symbol
  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencies[Field.CURRENCY_B]?.symbol}`

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

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  const [rate, setRate] = useState('1')

  useCurrencyUsdPrice()
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
            <TransactionConfirmationModal
              isOpen={showConfirm}
              onDismiss={handleDismissConfirmation}
              attemptingTxn={attemptingTxn}
              hash={txHash}
              content={() => (
                <ConfirmationModalContent
                  title={noLiquidity ? t('youAreCreatingAPool') : t('youWillReceive')}
                  onDismiss={handleDismissConfirmation}
                  topContent={modalHeader}
                  bottomContent={modalBottom}
                />
              )}
              pendingText={pendingText}
            />
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
            <TransactionConfirmationModal
              isOpen={showConfirm}
              onDismiss={handleDismissConfirmation}
              attemptingTxn={attemptingTxn}
              hash={txHash}
              content={() => (
                <ConfirmationModalContent
                  title={noLiquidity ? t('youAreCreatingAPool') : t('youWillReceive')}
                  onDismiss={handleDismissConfirmation}
                  topContent={modalHeader}
                  bottomContent={modalBottom}
                />
              )}
              pendingText={pendingText}
            />
            <AutoColumn gap="20px">
              <CurrencyDoubleInputPanel
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
                disableCurrencySelect
              />
              <ColumnCenter>
                <Plus size="16" color={theme.textSecondary} />
              </ColumnCenter>
              <CurrencyInputPanel
                value={(Number(formattedAmounts[Field.CURRENCY_A]) * Number(rate)).toString()}
                onUserInput={val => onFieldAInput((Number(val) / Number(rate)).toString())}
                onCurrencySelect={handleCurrencyBSelect}
                onMax={() => {
                  onFieldAInput((Number(maxAmounts[Field.CURRENCY_B]?.toExact()) / Number(rate)).toString() ?? '')
                }}
                showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                currency={currencies[Field.CURRENCY_B]}
                id="add-liquidity-input-tokenb"
                showCommonBases
                disableCurrencySelect
              />
            </AutoColumn>
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
                            time = 2628000
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
                    setFeeToken('ETH')
                  }}
                  active={feeToken === 'ETH'}
                >
                  <CurrencyLogo currency={ETHER} size={'24px'} style={{ marginInlineEnd: '6px' }} position="button" />
                  ETH
                </CurrencyButton>
                <CurrencyButton
                  onClick={() => {
                    setFeeToken('LINK')
                  }}
                  active={feeToken === 'LINK'}
                >
                  <CurrencyLogo currency={LINK} size={'24px'} style={{ marginInlineEnd: '6px' }} position="button" />
                  LINK
                </CurrencyButton>
                <CurrencyButton
                  onClick={() => {
                    setFeeToken('YFL')
                  }}
                  active={feeToken === 'YFL'}
                >
                  <CurrencyLogo currency={YFL} size={'24px'} style={{ marginInlineEnd: '6px' }} position="button" /> YFL
                </CurrencyButton>
              </ButtonRow>
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
                      <Text>{t('pairCreationFee', { currency: feeToken })}</Text>
                      <Text>
                        {feeTokenCount} {feeToken} ({feeAmountUsd})
                      </Text>
                    </RowBetween>
                  </AutoColumn>
                </CreationSummary>
              )}{' '}
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
            <ButtonPrimary>{t('comingSoon')}</ButtonPrimary>
          ) : (
            <>
              {!noLiquidity ||
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
