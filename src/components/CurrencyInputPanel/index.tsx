import React, { useState, useContext, useCallback } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Currency, Pair, ETHER } from '@uniswap/sdk'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween } from '../Row'
import { Input as NumericalInput } from '../NumericalInput'
import { TYPE } from '../../theme'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'
import { numberToSignificant } from '../../utils/numberUtils'

const CurrencySelectWrapper = styled.div`
  display: flex;
  align-items: space-between;
`

const CurrencySelect = styled.button<{
  selected: boolean
  primary?: boolean
  left?: boolean
  right?: boolean
  middle?: boolean
}>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  height: 52px;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ selected, primary, theme }) => {
    if (selected) {
      return theme.appCurrencyInputBGActive
    } else {
      if (primary) {
        return theme.appCurrencyInputBG
      } else {
        return theme.appCurrencyInputBGActive
      }
    }
  }};
  color: ${({ selected, theme }) =>
    selected ? theme.appCurrencyInputTextColorActive : theme.appCurrencyInputTextColor};
  border-radius: ${({ left, right, middle }) =>
    left ? '6px 0px 0px 6px' : right ? '0px 6px 6px 0px' : middle ? '0px' : '6px'};
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 5px 0.5rem;
  [dir='rtl'] & {
    border-radius: ${({ left, right, middle }) =>
      left ? '0px 6px 6px 0px' : right ? '6px 0px 0px 6px' : middle ? '0px' : '6px'};
  }
  :focus,
  :hover {
    background-color: ${({ selected, primary, theme }) => {
      if (selected) {
        return theme.appCurrencyInputBGActive
      } else {
        if (primary) {
          return theme.appCurrencyInputBGHover
        } else {
          return theme.appCurrencyInputBGActiveHover
        }
      }
    }};
  }
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.appCurrencyInputTextColor};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
  }
`

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.appCurrencyInputBG};
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '6px' : '6px')};
  border: 1px solid ${({ theme }) => theme.appCurrencyInputBG};
  background-color: ${({ theme }) => theme.appCurrencyInputBG};
`

const StyledTokenName = styled.div<{ inline?: boolean }>`
  font-size: ${({ inline }) => (inline ? '20px' : '12px')};
  margin-inline-start: ${({ inline }) => (inline ? '0.4rem' : 0)};
  width: ${({ inline }) => (inline ? 'auto' : '100%')};
  display: ${({ inline }) => (inline ? 'inline-block' : 'block')};
  text-align: ${({ inline }) => (inline ? 'left' : 'center')};
`

const StyledBalanceMax = styled.button`
  height: 28px;
  background-color: ${({ theme }) => theme.buttonSecondaryBG};
  border: 1px solid ${({ theme }) => theme.buttonSecondaryBorder};
  border-radius: 0.5rem;
  font-size: 0.875rem;

  font-weight: 500;
  cursor: pointer;
  margin-inline-end: 0.5rem;
  color: ${({ theme }) => theme.buttonSecondaryTextColor};
  :hover {
    border: 1px solid ${({ theme }) => theme.buttonSecondaryBorderHover};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.buttonSecondaryTextColor};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-inline-end: 0.5rem;
  `};
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  currency1?: Currency | null
  currency2?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  hideSelect?: boolean
  balanceOveride?: boolean
  newBalance?: number
  hideCurrencySelect?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
}

// Single input
export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  hideInput = false,
  hideSelect = false,
  hideCurrencySelect = false,
  otherCurrency,
  balanceOveride = false,
  newBalance = 0,
  id,
  showCommonBases
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useContext(ThemeContext)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <div>
      {!hideCurrencySelect && (
        <CurrencySelect
          style={{ marginBottom: '12px', width: '100%' }}
          selected={!!currency}
          className="open-currency-select-button"
          onClick={() => {
            if (!disableCurrencySelect) {
              setModalOpen(true)
            }
          }}
        >
          {currency ? <CurrencyLogo currency={currency} position="button" /> : null}
          <StyledTokenName className="token-symbol-container" inline={true}>
            {(currency && currency.symbol && currency.symbol.length > 20
              ? currency.symbol.slice(0, 4) +
                '...' +
                currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
              : currency?.symbol) || t('selectToken')}
          </StyledTokenName>
        </CurrencySelect>
      )}
      {!hideSelect && (
        <InputPanel id={id}>
          <Container hideInput={hideInput}>
            {!hideInput && (
              <LabelRow>
                <RowBetween>
                  <TYPE.body color={theme.textSecondary} fontWeight={500} fontSize={14}>
                    {label}
                  </TYPE.body>
                  {account && (
                    <TYPE.body
                      onClick={onMax}
                      color={theme.textPrimary}
                      fontWeight={500}
                      fontSize={14}
                      style={{ display: 'inline', cursor: 'pointer' }}
                    >
                      {!hideBalance && !!currency && selectedCurrencyBalance && !balanceOveride
                        ? t('balance', { balanceInput: selectedCurrencyBalance?.toSignificant(6) })
                        : balanceOveride
                        ? numberToSignificant(newBalance)
                        : ' -'}
                    </TYPE.body>
                  )}
                </RowBetween>
              </LabelRow>
            )}
            <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
              {!hideInput && (
                <>
                  <NumericalInput
                    className="token-amount-input"
                    value={value}
                    onUserInput={val => {
                      onUserInput(val)
                    }}
                  />
                  {account && currency && showMaxButton && label !== 'To' && (
                    <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
                  )}
                </>
              )}
            </InputRow>
          </Container>
        </InputPanel>
      )}
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </div>
  )
}

// Double input
export function CurrencyDoubleInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label = 'Input',
  onCurrencySelect,
  currency: inputCurrency,
  disableCurrencySelect = false,
  hideBalance = false,
  hideInput = false,
  hideSelect = false,
  otherCurrency,
  id,
  showCommonBases
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()
  const currency1 = ETHER
  const currency2 = new WrappedTokenInfo(
    {
      address: '0x514910771af9ca656af840dff83e8264ecf986ca',
      chainId: 1,
      name: 'ChainLink',
      symbol: 'LINK',
      decimals: 18,
      logoURI: 'https://logos.linkswap.app/0x514910771af9ca656af840dff83e8264ecf986ca.png'
    },
    []
  )
  const currency3 = new WrappedTokenInfo(
    {
      address: '0x7b760d06e401f85545f3b50c44bf5b05308b7b62',
      chainId: 1,
      name: 'YFLink USD',
      symbol: 'YFLUSD',
      decimals: 18,
      logoURI: 'https://logos.linkswap.app/0x7b760d06e401f85545f3b50c44bf5b05308b7b62.png'
    },
    []
  )

  let initialCurrency
  if (!inputCurrency) {
    initialCurrency = ETHER
  } else {
    initialCurrency = inputCurrency

    if (initialCurrency?.symbol !== 'ETH') {
      if (initialCurrency?.symbol !== currency2.symbol) {
        initialCurrency = currency3
      } else {
        initialCurrency = currency2
      }
    } else {
      initialCurrency = ETHER
    }
  }

  const [currency, setCurrency] = useState(initialCurrency)
  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useContext(ThemeContext)

  console.log(currency)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])
  return (
    <div>
      <CurrencySelectWrapper>
        <CurrencySelect
          style={{ marginBottom: '12px', width: '100%' }}
          selected={currency.symbol === 'ETH'}
          primary
          left
          className="open-currency-select-button"
          onClick={() => {
            if (!disableCurrencySelect) {
              setCurrency(currency1)
              if (onCurrencySelect) {
                onCurrencySelect(currency1)
              }
            }
          }}
        >
          {currency1 ? <CurrencyLogo currency={currency1} size={'24px'} position="button" /> : null}
          <StyledTokenName className="token-symbol-container">
            {(currency1 && currency1.symbol && currency1.symbol.length > 20
              ? currency1.symbol.slice(0, 4) +
                '...' +
                currency1.symbol.slice(currency1.symbol.length - 5, currency1.symbol.length)
              : currency1?.symbol) || t('selectToken')}
          </StyledTokenName>
        </CurrencySelect>
        <CurrencySelect
          style={{ marginBottom: '12px', width: '100%' }}
          selected={currency.symbol === 'LINK'}
          primary
          middle
          className="open-currency-select-button"
          onClick={() => {
            if (!disableCurrencySelect) {
              setCurrency(currency2)
              if (onCurrencySelect) {
                onCurrencySelect(currency2)
              }
            }
          }}
        >
          {currency2 ? <CurrencyLogo currency={currency2} size={'24px'} position="button" /> : null}
          <StyledTokenName className="token-symbol-container">
            {(currency2 && currency2.symbol && currency2.symbol.length > 20
              ? currency2.symbol.slice(0, 4) +
                '...' +
                currency2.symbol.slice(currency2.symbol.length - 5, currency2.symbol.length)
              : currency2?.symbol) || t('selectToken')}
          </StyledTokenName>
        </CurrencySelect>
        <CurrencySelect
          style={{ marginBottom: '12px', width: '100%' }}
          selected={currency.symbol === 'YFLUSD'}
          primary
          right
          className="open-currency-select-button"
          onClick={() => {
            if (!disableCurrencySelect) {
              setCurrency(currency3)
              if (onCurrencySelect) {
                onCurrencySelect(currency3)
              }
            }
          }}
        >
          {currency3 ? <CurrencyLogo currency={currency3} size={'24px'} position="button" /> : null}
          <StyledTokenName className="token-symbol-container">
            {(currency3 && currency3.symbol && currency3.symbol.length > 20
              ? currency3.symbol.slice(0, 4) +
                '...' +
                currency3.symbol.slice(currency3.symbol.length - 5, currency3.symbol.length)
              : currency3?.symbol) || t('selectToken')}
          </StyledTokenName>
        </CurrencySelect>
      </CurrencySelectWrapper>
      {!hideSelect && (
        <InputPanel id={id}>
          <Container hideInput={hideInput}>
            {!hideInput && (
              <LabelRow>
                <RowBetween>
                  <TYPE.body color={theme.textSecondary} fontWeight={500} fontSize={14}>
                    {label}
                  </TYPE.body>
                  {account && (
                    <TYPE.body
                      onClick={onMax}
                      color={theme.textPrimary}
                      fontWeight={500}
                      fontSize={14}
                      style={{ display: 'inline', cursor: 'pointer' }}
                    >
                      {!hideBalance && !!currency && selectedCurrencyBalance
                        ? t('balance', { balanceInput: selectedCurrencyBalance?.toSignificant(6) })
                        : ' -'}
                    </TYPE.body>
                  )}
                </RowBetween>
              </LabelRow>
            )}
            <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
              {!hideInput && (
                <>
                  <NumericalInput
                    className="token-amount-input"
                    value={value}
                    onUserInput={val => {
                      onUserInput(val)
                    }}
                  />
                  {account && currency && showMaxButton && label !== 'To' && (
                    <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
                  )}
                </>
              )}
            </InputRow>
          </Container>
          {!disableCurrencySelect && onCurrencySelect && (
            <CurrencySearchModal
              isOpen={modalOpen}
              onDismiss={handleDismissSearch}
              onCurrencySelect={onCurrencySelect}
              selectedCurrency={currency}
              otherSelectedCurrency={otherCurrency}
              showCommonBases={showCommonBases}
            />
          )}
        </InputPanel>
      )}
    </div>
  )
}
