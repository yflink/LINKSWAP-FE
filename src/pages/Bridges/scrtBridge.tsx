import React, { useContext, useEffect, useState } from 'react'
import { Link, Text } from 'rebass'
import { BlueCard, NavigationCard } from '../../components/Card'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import AppBody from '../AppBody'
import styled, { ThemeContext } from 'styled-components'
import { Loading } from '@renproject/react-components'
import { useWeb3React } from '@web3-react/core'
import { ButtonLight, ButtonSecondary } from '../../components/Button'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Trans, useTranslation } from 'react-i18next'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import Question from '../../components/QuestionHelper'
import { useTokenBalances } from '../../state/wallet/hooks'
import { LINK, secretETH, secretLINK, secretYFL, WETHER, YFL } from '../../constants'
import Web3 from 'web3'
import { TYPE } from '../../theme'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { Field } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'
import { TokenAmount, Token, ETHER } from '@uniswap/sdk'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { Link as HistoryLink, RouteComponentProps } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import { useNavigationActiveItemManager } from '../../state/navigation/hooks'
import { useGetKplrConnect, useKeplrConnect } from '../../state/keplr/hooks'

const NavigationWrapper = styled.div`
  display: flex;
  align-items: space-between;
  width: 100%;
  margin: 12px 0;
`

const KeplrHint = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 14px;
  line-height: 1.2;

  a {
    color: ${({ theme }) => theme.textHighlight};
    text-decoration: none;

    :hover,
    :focus {
      text-decoration: underline;
    }
  }
`

const Navigation = styled.button<{ selected: boolean; primary?: boolean; left?: boolean; right?: boolean }>`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 48px;
  font-size: 20px;
  font-weight: 500;
  background: ${({ selected, primary, theme }) => {
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
  border-radius: ${({ left, right, theme }) =>
    left
      ? `${theme.borderRadius} 0px 0px ${theme.borderRadius} `
      : right
      ? `0px ${theme.borderRadius} ${theme.borderRadius} 0px`
      : theme.borderRadius};
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;
  [dir='rtl'] & {
    border-radius: ${({ left, right, theme }) =>
      left
        ? `0px ${theme.borderRadius} ${theme.borderRadius} 0px`
        : right
        ? `${theme.borderRadius} 0px 0px ${theme.borderRadius} `
        : theme.borderRadius};
  }
  :focus,
  :hover {
    background: ${({ selected, primary, theme }) => {
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
const Input = styled.input<{ error?: boolean }>`
  font-size: 16px;
  outline: none;
  border: none;
  flex: 1 1 auto;
  width: 0;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.appCurrencyInputBG};
  transition: color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  color: ${({ error, theme }) => (error ? theme.red1 : theme.textPrimary)};
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  width: 100%;
  ::placeholder {
    color: ${({ theme }) => theme.textTertiary};
  }
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.textTertiary};
  }
`

const Loader = styled(Loading)`
  display: inline-block;
  &:after {
    border-color: ${({ theme }) => theme.textHighlight} transparent !important;
  }
`

const BackButton = styled.div`
  display: flex;
  flex: 0 0 100%;

  > * {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.textPrimary};
    font-size: 16px;
    text-decoration: none;
  }
`

export default function ScrtBridge({
  match: {
    params: { bridgeName }
  }
}: RouteComponentProps<{ bridgeName?: string }>) {
  const [action, setAction] = useState('mint')
  const inputCurrency = bridgeName ? bridgeName.toUpperCase() : 'YFL'
  const outputCurrency = 'secret' + inputCurrency
  let tokens: [
    Token,
    {
      address: string
      decimals: number
      symbol: string
      name: string
    }
  ]
  switch (inputCurrency) {
    case 'ETH':
      tokens = [WETHER, secretETH]
      break
    case 'LINK':
      tokens = [LINK, secretLINK]
      break
    default:
      tokens = [YFL, secretYFL]
  }
  const { account } = useWeb3React()
  const theme = useContext(ThemeContext)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const toggleWalletModal = useWalletModalToggle()
  const { t } = useTranslation()
  const balances = useTokenBalances(account ?? undefined, [tokens[0]])
  const userBalance = action === 'mint' ? balances[tokens[0].address] : undefined
  const outputBalance = action === 'mint' ? undefined : balances[tokens[0].address]
  const web3 = new Web3(Web3.givenProvider)
  const provider = web3.currentProvider
  const keplrWalletConnect = useKeplrConnect()
  const keplrWallet = useGetKplrConnect()
  const { independentField, typedValue } = useMintState()
  const { dependentField, currencies, parsedAmounts, noLiquidity, currencyBalances } = useDerivedMintInfo(
    action === 'mint' ? (inputCurrency === 'ETH' ? ETHER ?? undefined : tokens[0] ?? undefined) : undefined,
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

  const newActive = useNavigationActiveItemManager()
  const acitveId = tokens[1].symbol ? `bridges-${tokens[1].symbol.toLowerCase()}` : 'bridges-secretyfl'
  useEffect(() => {
    newActive(acitveId)
  })

  return (
    <>
      <NavigationCard>
        <SwapPoolTabs active={'none'} />
      </NavigationCard>
      <AppBody>
        <AutoColumn gap={'12px'}>
          <BackButton>
            <HistoryLink to="/scrt">
              <ArrowLeft /> {t('bridgesScrt')}
            </HistoryLink>
          </BackButton>
          <RowBetween>
            <Text color={theme.textPrimary} fontWeight={500}>
              {t('bridgeScrt', { inputCurrency: outputCurrency })}
            </Text>
            <Question
              text={t('bridgeScrtDescription', { inputCurrency: inputCurrency, outputCurrency: outputCurrency })}
            />
          </RowBetween>
          <RowBetween>
            <Text>
              {t('yourTokenBalance', { currency: outputCurrency, balance: outputBalance?.toSignificant(4) ?? 0 })}
            </Text>
          </RowBetween>
          <NavigationWrapper>
            <Navigation
              selected={action === 'mint'}
              primary={true}
              left={true}
              onClick={() => {
                setAction('mint')
              }}
            >
              {t('mint')}
            </Navigation>
            <Navigation
              selected={action === 'burn'}
              primary={true}
              right={true}
              onClick={() => {
                setAction('burn')
              }}
            >
              {t('burn')}
            </Navigation>
          </NavigationWrapper>
        </AutoColumn>
        {!account ? (
          <AutoColumn gap={'12px'}>
            <Text>{t('walletConnectDisclaimerBridge')}</Text>
            <ButtonLight onClick={toggleWalletModal}>{t('connectWallet')}</ButtonLight>
          </AutoColumn>
        ) : (
          <>
            {action === 'mint' ? (
              <AutoColumn gap={'12px'}>
                <BlueCard style={{ margin: '12px 0 0' }}>
                  <TYPE.link textAlign="center" fontWeight={400}>
                    {t('mintScrtDescription', { inputCurrency: inputCurrency, outputCurrency: outputCurrency })}
                  </TYPE.link>
                </BlueCard>
                <CurrencyInputPanel
                  label={currencies[Field.CURRENCY_A]?.symbol}
                  hideCurrencySelect={true}
                  value={formattedAmounts[Field.CURRENCY_A]}
                  onUserInput={onFieldAInput}
                  onMax={() => {
                    setErrorMessage(null)
                    onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                  }}
                  showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                  currency={currencies[Field.CURRENCY_A]}
                  id="mint-token-input"
                  showCommonBases
                />
                <KeplrHint>
                  <Trans i18nKey="walletConnectDisclaimerScrtMintKeplr">
                    To mint <strong>{{ outputCurrency }}</strong> you need to connect your
                    <Link href="https://wallet.keplr.app/" target="_blank">
                      Keplr Wallet
                    </Link>
                    and select the &quot;Secret Network&quot;
                  </Trans>
                </KeplrHint>
                <ButtonSecondary onClick={keplrWalletConnect}>{t('connectKeplrWallet')}</ButtonSecondary>
              </AutoColumn>
            ) : (
              <AutoColumn gap={'12px'}>
                <BlueCard style={{ margin: '12px 0' }}>
                  <TYPE.link textAlign="center" fontWeight={400}>
                    {t('burnScrtDescription', { inputCurrency: outputCurrency, outputCurrency: inputCurrency })}
                  </TYPE.link>
                </BlueCard>
                <CurrencyInputPanel
                  label={currencies[Field.CURRENCY_A]?.symbol}
                  hideCurrencySelect={true}
                  value={formattedAmounts[Field.CURRENCY_A]}
                  onUserInput={onFieldAInput}
                  onMax={() => {
                    setErrorMessage(null)
                    onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                  }}
                  showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                  currency={currencies[Field.CURRENCY_A]}
                  id="burn-token-input"
                  showCommonBases
                />
              </AutoColumn>
            )}
            {errorMessage && (
              <Text padding="1rem 0 0" color={theme.red1}>
                {errorMessage}
              </Text>
            )}
          </>
        )}
      </AppBody>
    </>
  )
}
