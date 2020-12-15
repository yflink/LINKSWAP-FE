import React, { useState, useContext, useCallback } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Currency, Pair, ETHER } from '@uniswap/sdk'
import { darken } from 'polished'

import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween } from '../Row'
import { Input as NumericalInput } from '../NumericalInput'

import { TYPE } from '../../theme'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'

// import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'

const CurrencySelectWrapper = styled.div`
  display: flex;
  align-items: space-between;
`

const CurrencySelect = styled.button<{ selected: boolean; primary?: boolean; left?: boolean; right?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ selected, primary, theme }) => {
    if (selected) {
      return theme.bg7
    } else {
      if (primary) {
        return theme.bg6
      } else {
        return theme.primary1
      }
    }
  }};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  border-radius: ${({ left, right }) => (left ? '6px 0px 0px 6px' : right ? '0px 6px 6px 0px' : '6px')};
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;
  [dir='rtl'] & {
    border-radius: ${({ left, right }) => (left ? '0px 6px 6px 0px' : right ? '6px 0px 0px 6px' : '6px')};
  }
  :focus,
  :hover {
    background-color: ${({ selected, primary, theme }) => {
      if (selected) {
        return theme.bg7
      } else {
        if (primary) {
          return theme.bg6
        } else {
          return darken(0.05, theme.primary1)
        }
      }
    }};
  }
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

// const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
//   margin: 0 0.25rem 0 0.5rem;
//   height: 35%;
//   path {
//     stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
//     stroke-width: 1.5px;
//   }
// `

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg6};
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '6px' : '6px')};
  border: 1px solid ${({ theme }) => theme.bg6};
  background-color: ${({ theme }) => theme.bg6};
`

const StyledTokenName = styled.div<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '20px')};
`

const StyledBalanceMax = styled.button`
  height: 28px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 0.875rem;

  font-weight: 500;
  cursor: pointer;
  margin-inline-end: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
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
  pair = null, // used for double token logo
  hideInput = false,
  hideSelect = false,
  otherCurrency,
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
        {pair ? (
          <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} margin={true} />
        ) : currency ? (
          <CurrencyLogo currency={currency} position="button"/>
        ) : null}
        {pair ? (
          <StyledTokenName className="pair-name-container">
            {pair?.token0.symbol}:{pair?.token1.symbol}
          </StyledTokenName>
        ) : (
          <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
            {(currency && currency.symbol && currency.symbol.length > 20
              ? currency.symbol.slice(0, 4) +
                '...' +
                currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
              : currency?.symbol) || t('selectToken')}
          </StyledTokenName>
        )}
        {/* {!disableCurrencySelect && <StyledDropDown selected={!!currency} />} */}
      </CurrencySelect>
      {!hideSelect && (
        <InputPanel id={id}>
          <Container hideInput={hideInput}>
            {!hideInput && (
              <LabelRow>
                <RowBetween>
                  <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                    {label}
                  </TYPE.body>
                  {account && (
                    <TYPE.body
                      onClick={onMax}
                      color={theme.text1}
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
                    style={{ backgroundColor: theme.bg6 }}
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
              {/* <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
              ) : currency ? (
                <CurrencyLogo currency={currency} size={'24px'} />
              ) : null}
              {pair ? (
                <StyledTokenName className="pair-name-container">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </StyledTokenName>
              ) : (
                <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? currency.symbol.slice(0, 4) +
                      '...' +
                      currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                    : currency?.symbol) || t('selectToken')}
                </StyledTokenName>
              )}
              {!disableCurrencySelect && <StyledDropDown selected={!!currency} />}
          </CurrencySelect> */}
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
  pair = null, // used for double token logo
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
      logoURI:
        'https://logos.linkswap.app/0x514910771af9ca656af840dff83e8264ecf986ca.png'
    },
    []
  )

  let initialCurrency
  let initialSelected
  if (!inputCurrency) {
    initialCurrency = ETHER
    initialSelected = 0
  } else {
    initialCurrency = inputCurrency
    if (initialCurrency === ETHER) {
      initialSelected = 0
    } else {
      initialSelected = 1
    }
  }

  const [currency, setCurrency] = useState(initialCurrency)
  const [selected, setSelected] = useState(initialSelected)

  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const theme = useContext(ThemeContext)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  return (
    <div>
      <CurrencySelectWrapper>
        <CurrencySelect
          style={{ marginBottom: '12px', width: '100%' }}
          selected={selected === 0}
          primary
          left
          className="open-currency-select-button"
          onClick={() => {
            if (!disableCurrencySelect) {
              setCurrency(currency1)
              setSelected(0)
              if (onCurrencySelect) {
                onCurrencySelect(currency1)
              }
            }
          }}
        >
          {pair ? (
            <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
          ) : currency1 ? (
            <CurrencyLogo currency={currency1} size={'24px'} position="button" />
          ) : null}
          {pair ? (
            <StyledTokenName className="pair-name-container">
              {pair?.token0.symbol}:{pair?.token1.symbol}
            </StyledTokenName>
          ) : (
            <StyledTokenName className="token-symbol-container" active={Boolean(currency1 && currency1.symbol)}>
              {(currency1 && currency1.symbol && currency1.symbol.length > 20
                ? currency1.symbol.slice(0, 4) +
                  '...' +
                  currency1.symbol.slice(currency1.symbol.length - 5, currency1.symbol.length)
                : currency1?.symbol) || t('selectToken')}
            </StyledTokenName>
          )}
          {/* {!disableCurrencySelect && <StyledDropDown selected={!!currency} />} */}
        </CurrencySelect>
        <CurrencySelect
          style={{ marginBottom: '12px', width: '100%' }}
          selected={selected === 1}
          primary
          right
          className="open-currency-select-button"
          onClick={() => {
            if (!disableCurrencySelect) {
              setCurrency(currency2)
              setSelected(1)
              if (onCurrencySelect) {
                onCurrencySelect(currency2)
              }
            }
          }}
        >
          {pair ? (
            <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
          ) : currency2 ? (
            <CurrencyLogo currency={currency2} size={'24px'} position="button" />
          ) : null}
          {pair ? (
            <StyledTokenName className="pair-name-container">
              {pair?.token0.symbol}:{pair?.token1.symbol}
            </StyledTokenName>
          ) : (
            <StyledTokenName className="token-symbol-container" active={Boolean(currency2 && currency2.symbol)}>
              {(currency2 && currency2.symbol && currency2.symbol.length > 20
                ? currency2.symbol.slice(0, 4) +
                  '...' +
                  currency2.symbol.slice(currency2.symbol.length - 5, currency2.symbol.length)
                : currency2?.symbol) || t('selectToken')}
            </StyledTokenName>
          )}
          {/* {!disableCurrencySelect && <StyledDropDown selected={!!currency} />} */}
        </CurrencySelect>
      </CurrencySelectWrapper>
      {!hideSelect && (
        <InputPanel id={id}>
          <Container hideInput={hideInput}>
            {!hideInput && (
              <LabelRow>
                <RowBetween>
                  <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                    {label}
                  </TYPE.body>
                  {account && (
                    <TYPE.body
                      onClick={onMax}
                      color={theme.text1}
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
                    style={{ backgroundColor: theme.bg6 }}
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
              {/* <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={24} margin={true} />
              ) : currency ? (
                <CurrencyLogo currency={currency} size={'24px'} />
              ) : null}
              {pair ? (
                <StyledTokenName className="pair-name-container">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </StyledTokenName>
              ) : (
                <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? currency.symbol.slice(0, 4) +
                      '...' +
                      currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                    : currency?.symbol) || t('selectToken')}
                </StyledTokenName>
              )}
              {!disableCurrencySelect && <StyledDropDown selected={!!currency} />}
          </CurrencySelect> */}
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
