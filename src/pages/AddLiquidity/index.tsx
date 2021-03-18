import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Currency, currencyEquals, ETHER, TokenAmount, WETH } from '@uniswap/sdk'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Plus } from 'react-feather'
import ReactGA from 'react-ga'
import { RouteComponentProps } from 'react-router-dom'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import { ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import Card, { BlueCard, LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { SwapPoolTabs, AddRemoveTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import Row, { RowBetween, RowFlat } from '../../components/Row'
import { useTranslation } from 'react-i18next'
import { ROUTER_ADDRESS } from '../../constants'
import { PairState } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'

import { useTransactionAdder } from '../../state/transactions/hooks'
import { useIsExpertMode, useUserDeadline, useUserSlippageTolerance } from '../../state/user/hooks'
import { TYPE } from '../../theme'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../../utils'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import AppBody, { AppBodyDark } from '../AppBody'
import { Dots, Wrapper } from '../Pool/styleds'
import { ConfirmAddModalBottom } from './ConfirmAddModalBottom'
import { currencyId } from '../../utils/currencyId'
import { PoolPriceBar } from './PoolPriceBar'
import { useNavigationActiveItemManager } from '../../state/navigation/hooks'

export default function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB }
  },
  history
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const { account, chainId, library } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, WETH[chainId])) ||
        (currencyB && currencyEquals(currencyB, WETH[chainId])))
  )

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  const expertMode = useIsExpertMode()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const [deadline] = useUserDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const [txHash, setTxHash] = useState<string>('')
  const [update, setUpdate] = useState(false)
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
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS)

  const addTransaction = useTransactionAdder()

  const { t } = useTranslation()

  const newActive = useNavigationActiveItemManager()
  useEffect(() => {
    newActive('liquidity-add')
  })

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
            {t('pairedPoolTokens', {
              currencyA: currencies[Field.CURRENCY_A]?.symbol,
              currencyB: currencies[Field.CURRENCY_B]?.symbol
            })}
          </Text>
        </Row>
        <TYPE.italic fontSize={12} textAlign="left" padding={'8px 0 0 0 '}>
          {t('estimatedOutput', { slippage: allowedSlippage / 100 })}
        </TYPE.italic>
      </AutoColumn>
    )
  }

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
      />
    )
  }

  const pendingText = t('supplyingCurrencies', {
    currencyAAmount: parsedAmounts[Field.CURRENCY_A]?.toSignificant(6),
    currencyA: currencies[Field.CURRENCY_A]?.symbol,
    currencyBAmount: parsedAmounts[Field.CURRENCY_B]?.toSignificant(6),
    currencyB: currencies[Field.CURRENCY_B]?.symbol
  })

  const handleCurrencyASelect = useCallback(
    (selectedCurrencyA: Currency) => {
      const currencyIdA = currencyId(selectedCurrencyA)
      if (currencyIdA === currencyIdB) {
        history.push(`/add/${currencyIdB}`)
      } else {
        history.push(`/add/${currencyIdA}/${currencyIdB}`)
      }
      setUpdate(!update)
    },
    [currencyIdB, history, update]
  )
  const handleCurrencyBSelect = useCallback(
    (selectedCurrencyB: Currency) => {
      const currencyIdB = currencyId(selectedCurrencyB)
      if (currencyIdA === currencyIdB) {
        history.push(`/add/${currencyIdB}`)
      } else {
        history.push(`/add/${currencyIdA ? currencyIdA : 'ETH'}/${currencyIdB}`)
      }
      setUpdate(!update)
    },
    [currencyIdA, history, update]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  return (
    <>
      <Card style={{ maxWidth: '420px', padding: '12px', backgroundColor: theme.navigationBG, marginBottom: '16px' }}>
        <SwapPoolTabs active={'pool'} />
      </Card>
      <AppBody>
        <AddRemoveTabs adding={true} />
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
            {noLiquidity && (
              <ColumnCenter>
                <BlueCard>
                  <AutoColumn gap="10px">
                    <TYPE.link fontWeight={600} color={theme.appInfoBoxTextColor}>
                      {t('firstLiquidityProvider')}
                    </TYPE.link>
                    <TYPE.link fontWeight={400} color={theme.appInfoBoxTextColor}>
                      {t('ratioSetsPrice')}
                    </TYPE.link>
                    <TYPE.link fontWeight={400} color={theme.appInfoBoxTextColor}>
                      {t('happyToSupply')}
                    </TYPE.link>
                  </AutoColumn>
                </BlueCard>
              </ColumnCenter>
            )}
            <CurrencyInputPanel
              value={formattedAmounts[Field.CURRENCY_A]}
              onUserInput={onFieldAInput}
              onMax={() => {
                onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
              }}
              onCurrencySelect={handleCurrencyASelect}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
              currency={currencyA}
              id="add-liquidity-input-tokena"
              showCommonBases
            />
            <ColumnCenter>
              <Plus size="16" color={theme.textSecondary} />
            </ColumnCenter>
            <CurrencyInputPanel
              value={formattedAmounts[Field.CURRENCY_B]}
              onUserInput={onFieldBInput}
              onCurrencySelect={handleCurrencyBSelect}
              onMax={() => {
                onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
              }}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
              currency={currencyB}
              id="add-liquidity-input-tokenb"
              showCommonBases
            />
          </AutoColumn>
        </Wrapper>
      </AppBody>
      <AppBodyDark>
        <div style={{ marginBottom: '24px' }}>
          {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
            <>
              <RowBetween style={{ paddingBottom: '12px' }}>
                <TYPE.subHeader fontWeight={500} fontSize={14}>
                  {noLiquidity ? t('initialPricesAndShare') : t('pricesAndShare')}
                </TYPE.subHeader>
              </RowBetween>{' '}
              <PoolPriceBar
                currencies={currencies}
                poolTokenPercentage={poolTokenPercentage}
                noLiquidity={noLiquidity}
                price={price}
              />
            </>
          )}
        </div>
        {!account ? (
          <ButtonLight onClick={toggleWalletModal}>{t('connectWallet')}</ButtonLight>
        ) : (
          <AutoColumn gap={'md'}>
            {(approvalA === ApprovalState.NOT_APPROVED ||
              approvalA === ApprovalState.PENDING ||
              approvalB === ApprovalState.NOT_APPROVED ||
              approvalB === ApprovalState.PENDING) &&
              isValid && (
                <RowBetween>
                  {approvalA !== ApprovalState.APPROVED && (
                    <ButtonPrimary
                      onClick={approveACallback}
                      disabled={approvalA === ApprovalState.PENDING}
                      width={approvalB !== ApprovalState.APPROVED ? '48%' : '100%'}
                    >
                      {approvalA === ApprovalState.PENDING ? (
                        <Dots>{t('approvingCurrency', { inputCurrency: currencies[Field.CURRENCY_A]?.symbol })}</Dots>
                      ) : (
                        t('approveCurrency', { inputCurrency: currencies[Field.CURRENCY_A]?.symbol })
                      )}
                    </ButtonPrimary>
                  )}
                  {approvalB !== ApprovalState.APPROVED && (
                    <ButtonPrimary
                      onClick={approveBCallback}
                      disabled={approvalB === ApprovalState.PENDING}
                      width={approvalA !== ApprovalState.APPROVED ? '48%' : '100%'}
                    >
                      {approvalB === ApprovalState.PENDING ? (
                        <Dots>{t('approvingCurrency', { inputCurrency: currencies[Field.CURRENCY_B]?.symbol })}</Dots>
                      ) : (
                        t('approveCurrency', { inputCurrency: currencies[Field.CURRENCY_B]?.symbol })
                      )}
                    </ButtonPrimary>
                  )}
                </RowBetween>
              )}
            <ButtonError
              onClick={() => {
                expertMode ? onAdd() : setShowConfirm(true)
              }}
              disabled={!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
              error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
            >
              {error ?? t('supply')}
            </ButtonError>
          </AutoColumn>
        )}
      </AppBodyDark>
      {pair && !noLiquidity && pairState !== PairState.INVALID ? (
        <AutoColumn style={{ marginTop: '1rem', maxWidth: '420px', width: '100%' }}>
          <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
        </AutoColumn>
      ) : null}
    </>
  )
}
