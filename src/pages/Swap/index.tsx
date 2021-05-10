import { CurrencyAmount, JSBI, Token, Trade } from '@uniswap/sdk'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ArrowDown } from 'react-feather'
import ReactGA from 'react-ga'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'
import AddressInputPanel from '../../components/AddressInputPanel'
import { ButtonError, ButtonPrimary, ButtonConfirmed, ButtonSecondary } from '../../components/Button'
import Card, { GreyCard, NavigationCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { AutoRow, RowBetween } from '../../components/Row'
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee'
import {
  ArrowWrapper,
  BottomGrouping,
  SwapCallbackError,
  Wrapper,
  CopyToClipboard,
  CheckIcon,
  CopyIcon,
  CopiedToClipboard
} from '../../components/swap/styleds'
import TradePrice from '../../components/swap/TradePrice'
import TokenWarningModal from '../../components/TokenWarningModal'
import ProgressSteps from '../../components/ProgressSteps'
import { INITIAL_ALLOWED_SLIPPAGE, VRN, YFL } from '../../constants'
import { getTradeVersion } from '../../data/V1'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallback, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import useENSAddress from '../../hooks/useENSAddress'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import useToggledVersion, { Version } from '../../hooks/useToggledVersion'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { useToggleSettingsMenu, useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState
} from '../../state/swap/hooks'
import { useExpertModeManager, useGetTheme, useUserDeadline, useUserSlippageTolerance } from '../../state/user/hooks'
import { LinkStyledButton, TYPE } from '../../theme'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import AppBody from '../AppBody'
import { ClickableText } from '../Pool/styleds'
import Loader from '../../components/Loader'
import { useTranslation } from 'react-i18next'
import { useTokenList } from '../../state/lists/hooks'
import QuestionHelper from '../../components/QuestionHelper'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { calculateGasMargin, getContract } from '../../utils'
import { TransactionResponse } from '@ethersproject/providers'
import { numberToSignificant } from '../../utils/numberUtils'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { MigrationABI } from '../../components/ABI'
import { ethers } from 'ethers'

function containsKey(json: any, value: string) {
  let contains = false
  Object.keys(json).some(key => {
    contains = typeof json[key] === 'object' ? containsKey(json[key], value) : json[key] === value
    return contains
  })
  return contains
}

export default function Swap() {
  const loadedUrlParams = useDefaultsFromURLSearch()

  const addTransaction = useTransactionAdder()
  const [inversed, setInversed] = useState(false)
  const [copied, setCopied] = useState('')
  const migrationContractAddress = '0xf05336a9Bcc1805Fa6c9f9635300Ad43AC1B57Eb'
  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId)
  ]

  const currentList = useTokenList('https://linkswap.app/lists/linkswapList.json')

  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const urlLoadedTokens: Token[] = useMemo(
    () =>
      [loadedInputCurrency, loadedOutputCurrency]?.filter(
        (c): c is Token => c instanceof Token && !containsKey(currentList, c.address)
      ) ?? [],
    [loadedInputCurrency, loadedOutputCurrency, currentList]
  )
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  const { account, chainId, library } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // for expert mode
  const toggleSettings = useToggleSettingsMenu()
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [deadline] = useUserDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const {
    v1Trade,
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError
  } = useDerivedSwapInfo()
  const isMigration =
    wrappedCurrency(currencies[Field.INPUT], chainId)?.address.toLowerCase() === YFL.address.toLowerCase() &&
    wrappedCurrency(currencies[Field.OUTPUT], chainId)?.address.toLowerCase() === VRN.address.toLowerCase()

  const isCounterMigration =
    wrappedCurrency(currencies[Field.OUTPUT], chainId)?.address.toLowerCase() === YFL.address.toLowerCase() &&
    wrappedCurrency(currencies[Field.INPUT], chainId)?.address.toLowerCase() === VRN.address.toLowerCase()

  const { wrapType, execute: onWrap, inputError: wrapInputError } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  )
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const { address: recipientAddress } = useENSAddress(recipient)
  const toggledVersion = useToggledVersion()
  const trade =
    isCounterMigration || isMigration || showWrap
      ? undefined
      : {
          [Version.v1]: v1Trade,
          [Version.v2]: v2Trade
        }[toggledVersion]

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = isMigration ? true : !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  const [approvalMigration, approveMigrationCallback] = useApproveCallback(
    parsedAmounts[independentField],
    migrationContractAddress
  )

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    deadline,
    recipient
  )

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then(hash => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash })

        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
              ? 'Swap w/o Send + recipient'
              : 'Swap w/ Send',
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol,
            getTradeVersion(trade)
          ].join('/')
        })
      })
      .catch(error => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined
        })
      })
  }, [tradeToConfirm, account, priceImpactWithoutFee, recipient, recipientAddress, showConfirm, swapCallback, trade])

  const { t } = useTranslation()

  async function handleMigration() {
    if (!chainId || !library || !account) return
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined })

    const migrateAmount = parsedAmounts[independentField]?.toExact() ?? '0'
    const amount = ethers.utils.parseEther(migrateAmount)
    const router = getContract(migrationContractAddress, MigrationABI, library, account)
    const estimate = router.estimateGas.migrate
    const method: (...args: any) => Promise<TransactionResponse> = router.migrate
    const args: Array<any> = [amount]

    const value: any | null = null
    await estimate(...args, {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then(response => {
          addTransaction(response, {
            summary: t('migrateYFLtoVRN', {
              amount: numberToSignificant(Number(formattedAmounts[Field.INPUT]))
            })
          })

          ReactGA.event({
            category: 'Migration',
            action: 'Migrate',
            label: numberToSignificant(Number(formattedAmounts[Field.INPUT]))
          })
        })
      )
      .catch(error => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined
        })
      })
  }

  // errors
  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode

  const showApproveFlow = isMigration
    ? approvalMigration === ApprovalState.NOT_APPROVED ||
      approvalMigration === ApprovalState.PENDING ||
      (approvalSubmitted && approvalMigration === ApprovalState.APPROVED)
    : !swapInputError &&
      (approval === ApprovalState.NOT_APPROVED ||
        approval === ApprovalState.PENDING ||
        (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
      !(priceImpactSeverity > 3 && !isExpertMode)

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  const handleInputSelect = useCallback(
    inputCurrency => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(outputCurrency => onCurrencySelection(Field.OUTPUT, outputCurrency), [
    onCurrencySelection
  ])

  const currentInput =
    currencies[Field.INPUT]?.symbol === 'ETH' ? 'ETH' : wrappedCurrency(currencies[Field.INPUT], chainId)?.address
  const currentOutput =
    currencies[Field.OUTPUT]?.symbol === 'ETH' ? 'ETH' : wrappedCurrency(currencies[Field.OUTPUT], chainId)?.address
  const currentTheme = useGetTheme()

  let currentURL =
    currentInput !== 'ETH'
      ? `https://linkswap.app/#/swap/?inputCurrency=${currentInput}`
      : 'https://linkswap.app/#/swap'

  if (currentOutput) {
    currentURL += currentInput !== 'ETH' ? `&outputCurrency=${currentOutput}` : `?outputCurrency=${currentOutput}`
  }

  if (currentTheme !== 'default') {
    currentURL += currentInput !== 'ETH' || currentOutput ? `&theme=${currentTheme}` : `?theme=${currentTheme}`
  }

  function copyInputMessage(val: string) {
    const selBox = document.createElement('textarea')
    selBox.style.position = 'fixed'
    selBox.style.left = '0'
    selBox.style.top = '0'
    selBox.style.opacity = '0'
    selBox.value = val
    document.body.appendChild(selBox)
    selBox.focus()
    selBox.select()
    document.execCommand('copy')
    document.body.removeChild(selBox)
  }

  const migrationLabel =
    isMigration && !!formattedAmounts[Field.INPUT]
      ? Number(formattedAmounts[Field.INPUT]) <= Number(maxAmountInput?.toExact())
        ? t('migrate')
        : t('insufficientCurrencyBalance', { inputCurrency: YFL.symbol })
      : t('enterAmount')

  return (
    <>
      <TokenWarningModal
        isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning && !isMigration}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />
      <NavigationCard>
        <SwapPoolTabs active={'swap'} />
      </NavigationCard>
      <AppBody>
        <Wrapper id="swap-page">
          <ConfirmSwapModal
            isOpen={showConfirm}
            trade={trade}
            originalTrade={tradeToConfirm}
            onAcceptChanges={handleAcceptChanges}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onConfirm={handleSwap}
            swapErrorMessage={swapErrorMessage}
            onDismiss={handleConfirmDismiss}
          />
          <AutoColumn gap={'md'}>
            <CurrencyInputPanel
              label={independentField === Field.OUTPUT && !showWrap && trade ? t('fromEstimated') : t('from')}
              value={formattedAmounts[Field.INPUT]}
              showMaxButton={!atMaxAmountInput}
              currency={currencies[Field.INPUT]}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currencies[Field.OUTPUT]}
              id="swap-currency-input"
            />
            <AutoColumn justify="space-between">
              <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                <ArrowWrapper clickable>
                  <ArrowDown
                    size="16"
                    onClick={() => {
                      setApprovalSubmitted(false) // reset 2 step UI for approvals
                      onSwitchTokens()
                      setInversed(!inversed)
                    }}
                    color={
                      currencies[Field.INPUT] && currencies[Field.OUTPUT] ? theme.textHighlight : theme.textPrimary
                    }
                  />
                </ArrowWrapper>
                {recipient === null && !showWrap && isExpertMode && !isMigration && !isCounterMigration ? (
                  <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                    {t('addASend')}
                  </LinkStyledButton>
                ) : null}
              </AutoRow>
            </AutoColumn>
            <CurrencyInputPanel
              value={isMigration ? formattedAmounts[Field.INPUT] : formattedAmounts[Field.OUTPUT]}
              onUserInput={handleTypeOutput}
              label={independentField === Field.INPUT && !showWrap && trade ? t('toEstimated') : t('to')}
              showMaxButton={false}
              currency={currencies[Field.OUTPUT]}
              onCurrencySelect={handleOutputSelect}
              otherCurrency={currencies[Field.INPUT]}
              id="swap-currency-output"
            />
            {recipient !== null && !showWrap && !isMigration && !isCounterMigration ? (
              <>
                <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                  <ArrowWrapper clickable={false}>
                    <ArrowDown size="16" color={theme.textSecondary} />
                  </ArrowWrapper>
                  <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                    {t('removeSend')}
                  </LinkStyledButton>
                </AutoRow>
                <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
              </>
            ) : null}
            {showWrap || isMigration || isCounterMigration ? null : (
              <Card padding={'.25rem .75rem 0 .75rem'} borderRadius={'20px'}>
                <AutoColumn gap="4px">
                  {Boolean(trade) && (
                    <>
                      <RowBetween>
                        <TradePrice
                          price={trade?.executionPrice}
                          showInverted={true}
                          priceImpactSeverity={priceImpactSeverity}
                        />
                        <QuestionHelper text={t('priceDescription')} />
                      </RowBetween>
                      <RowBetween>
                        <TradePrice
                          price={trade?.executionPrice}
                          showInverted={false}
                          priceImpactSeverity={priceImpactSeverity}
                        />
                      </RowBetween>
                    </>
                  )}
                  {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                    <RowBetween align="center">
                      <ClickableText
                        fontWeight={500}
                        fontSize={14}
                        color={theme.textSecondary}
                        onClick={toggleSettings}
                      >
                        {t('slippageTolerance')}
                      </ClickableText>
                      <ClickableText
                        fontWeight={500}
                        fontSize={14}
                        color={theme.textSecondary}
                        onClick={toggleSettings}
                      >
                        {allowedSlippage / 100}%
                      </ClickableText>
                    </RowBetween>
                  )}
                </AutoColumn>
              </Card>
            )}
          </AutoColumn>
          <BottomGrouping>
            {!account ? (
              <ButtonSecondary style={{ height: '61px' }} onClick={toggleWalletModal}>
                {t('connectWallet')}
              </ButtonSecondary>
            ) : showWrap ? (
              <ButtonPrimary disabled={Boolean(wrapInputError)} onClick={onWrap}>
                {wrapInputError ??
                  (wrapType === WrapType.WRAP ? t('wrap') : wrapType === WrapType.UNWRAP ? t('unwrap') : null)}
              </ButtonPrimary>
            ) : noRoute && userHasSpecifiedInputOutput && !isMigration && !isCounterMigration ? (
              <GreyCard style={{ textAlign: 'center' }}>
                <TYPE.main mb="4px">{t('insufficientLiquidity')}</TYPE.main>
              </GreyCard>
            ) : showApproveFlow ? (
              isMigration ? (
                <RowBetween>
                  <ButtonConfirmed
                    onClick={approveMigrationCallback}
                    disabled={approvalMigration !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                    width="48%"
                    altDisabledStyle={approvalMigration === ApprovalState.PENDING} // show solid button while waiting
                    confirmed={approvalMigration === ApprovalState.APPROVED}
                  >
                    {approvalMigration === ApprovalState.PENDING ? (
                      <AutoRow gap="6px" justify="center">
                        Approving <Loader stroke="white" />
                      </AutoRow>
                    ) : approvalSubmitted && approvalMigration === ApprovalState.APPROVED ? (
                      t('approved')
                    ) : (
                      t('approveCurrency', { inputCurrency: currencies[Field.INPUT]?.symbol })
                    )}
                  </ButtonConfirmed>
                  <ButtonPrimary
                    onClick={() => {
                      handleMigration()
                    }}
                    width="48%"
                    disabled={
                      (isMigration && migrationLabel !== t('migrate')) || approvalMigration !== ApprovalState.APPROVED
                    }
                  >
                    {migrationLabel}
                  </ButtonPrimary>
                </RowBetween>
              ) : (
                <RowBetween>
                  <ButtonConfirmed
                    onClick={approveCallback}
                    disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                    width="48%"
                    altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                    confirmed={approval === ApprovalState.APPROVED}
                  >
                    {approval === ApprovalState.PENDING ? (
                      <AutoRow gap="6px" justify="center">
                        Approving <Loader stroke="white" />
                      </AutoRow>
                    ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                      t('approved')
                    ) : (
                      t('approveCurrency', { inputCurrency: currencies[Field.INPUT]?.symbol })
                    )}
                  </ButtonConfirmed>
                  <ButtonError
                    onClick={() => {
                      if (isExpertMode) {
                        handleSwap()
                      } else {
                        setSwapState({
                          tradeToConfirm: trade,
                          attemptingTxn: false,
                          swapErrorMessage: undefined,
                          showConfirm: true,
                          txHash: undefined
                        })
                      }
                    }}
                    width="48%"
                    id="swap-button"
                    disabled={
                      !isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                    }
                    error={isValid && priceImpactSeverity > 2}
                  >
                    {isCounterMigration
                      ? t('noTurningBack')
                      : priceImpactSeverity > 3 && !isExpertMode
                      ? t('priceImpactHigh')
                      : priceImpactSeverity > 2
                      ? t('swapAnyway')
                      : t('swap')}
                  </ButtonError>
                </RowBetween>
              )
            ) : (
              <ButtonError
                onClick={() => {
                  if (isMigration) {
                    handleMigration()
                  } else {
                    if (isExpertMode) {
                      handleSwap()
                    } else {
                      setSwapState({
                        tradeToConfirm: trade,
                        attemptingTxn: false,
                        swapErrorMessage: undefined,
                        showConfirm: true,
                        txHash: undefined
                      })
                    }
                  }
                }}
                id="swap-button"
                disabled={
                  (isMigration && migrationLabel !== t('migrate')) ||
                  (!isValid && !isMigration) ||
                  (priceImpactSeverity > 3 && !isExpertMode && !isMigration) ||
                  (!!swapCallbackError && !isMigration)
                }
                error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
              >
                {isCounterMigration
                  ? t('noTurningBack')
                  : isMigration
                  ? migrationLabel
                  : swapInputError
                  ? swapInputError
                  : priceImpactSeverity > 3 && !isExpertMode
                  ? t('priceImpactTooHigh')
                  : priceImpactSeverity > 2
                  ? t('swapAnyway')
                  : t('swap')}
              </ButtonError>
            )}
            {showApproveFlow && isMigration && <ProgressSteps steps={[approvalMigration === ApprovalState.APPROVED]} />}
            {showApproveFlow && !isMigration && <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />}
            {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
            <div style={{ marginTop: 12 }}>
              <Text textAlign="center" fontSize={14} style={{ padding: '.5rem 0 .5rem 0' }}>
                {copied === currentURL ? (
                  <CopiedToClipboard>
                    <CheckIcon /> {t('copied')}
                  </CopiedToClipboard>
                ) : (
                  <CopyToClipboard
                    onClick={() => {
                      copyInputMessage(currentURL)
                      setCopied(currentURL)
                    }}
                  >
                    <CopyIcon /> {t('copyCurrentSelection')}
                  </CopyToClipboard>
                )}
              </Text>
            </div>
            {/* {betterTradeLinkVersion && <BetterTradeLink version={betterTradeLinkVersion} />} */}
          </BottomGrouping>
        </Wrapper>
      </AppBody>
      <AdvancedSwapDetailsDropdown trade={trade} />
    </>
  )
}
