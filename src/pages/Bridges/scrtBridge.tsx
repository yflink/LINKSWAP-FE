import React, { SetStateAction, useCallback, useContext, useEffect, useState } from 'react'
import { Link, Text } from 'rebass'
import { BlueCard, NavigationCard } from '../../components/Card'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import AppBody from '../AppBody'
import styled, { ThemeContext } from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { ButtonLight, ButtonPrimary } from '../../components/Button'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Trans, useTranslation } from 'react-i18next'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import Question from '../../components/QuestionHelper'
import { useTokenBalances } from '../../state/wallet/hooks'
import { LINK, secretETH, secretLINK, secretYFL, SRCT_BRIDGE, WETHER, YFL } from '../../constants'
import { TYPE } from '../../theme'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { Field, typeInput } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'
import { TokenAmount, Token, ETHER } from '@uniswap/sdk'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { Link as HistoryLink, RouteComponentProps } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import { useNavigationActiveItemManager } from '../../state/navigation/hooks'
import { useGetKplrConnect } from '../../state/keplr/hooks'
import KeplrConnect, { getKeplr, getKeplrClient, getKeplrObject } from '../../components/KeplrConnect'
import BigNumber from 'bignumber.js'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { Dots } from '../Pool/styleds'
import { calculateGasMargin, getContract } from '../../utils'
import { TransactionResponse } from '@ethersproject/providers'
import ReactGA from 'react-ga'
import { SrctBridge } from '../../components/ABI'
import { useTransactionAdder } from '../../state/transactions/hooks'
import Web3 from 'web3'
import Transaction from '../../components/AccountDetails/Transaction'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../state'
import { AnyAction, Dispatch } from 'redux'
import { Keplr } from '@keplr-wallet/types'

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

const MintStatus = styled.div`
  a {
    font-size: 16px;
    line-height: 1.2;
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
  const addTransaction = useTransactionAdder()
  const scrtChainId = 'secret-2'
  const { account, chainId, library } = useWeb3React()
  const { keplrConnected, keplrAccount } = useGetKplrConnect()
  const keplrObject = getKeplrObject()
  const theme = useContext(ThemeContext)
  const toggleWalletModal = useWalletModalToggle()
  const { t } = useTranslation()
  const [txHash, setTxHash] = useState<string>('')
  const [minting, setMinting] = useState(false)
  const [burning, setBurning] = useState(false)
  const [burnInput, setBurnInput] = useState('')
  const [burnBalance, setBurnBalance] = useState('3.1234123')
  const { independentField, typedValue } = useMintState()
  const { dependentField, currencies, parsedAmounts, noLiquidity, currencyBalances } = useDerivedMintInfo(
    inputCurrency === 'ETH' ? ETHER ?? undefined : tokens[0] ?? undefined,
    undefined
  )
  const dispatch = useDispatch<AppDispatch>()
  const { onFieldAInput } = useMintActionHandlers(noLiquidity)
  const onFieldBInput = useCallback(
    (typedValue: string) => {
      setBurnInput(typedValue)
    },
    [dispatch, setBurnInput]
  )

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
  const web3 = new Web3(Web3.givenProvider)
  const newActive = useNavigationActiveItemManager()
  const acitveId = tokens[1].symbol ? `bridges-${tokens[1].symbol.toLowerCase()}` : 'bridges-secretyfl'
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], SRCT_BRIDGE)
  const { [Field.CURRENCY_A]: parsedAmountA } = parsedAmounts

  useEffect(() => {
    newActive(acitveId)
  })

  async function getBalances() {
    if (keplrObject) {
      await keplrObject.suggestToken(scrtChainId, tokens[1].address).then((result: any) => {
        console.log(result)
      })
    }
  }

  if (!keplrObject) {
    getKeplrObject()
  } else {
    getBalances()
  }

  async function burnTokens() {
    console.log('BURN')
  }

  async function mintTokens() {
    if (!keplrAccount || !chainId || !library || !account) return

    const router = getContract(SRCT_BRIDGE, SrctBridge, library, account)

    if (!parsedAmountA) {
      return
    }
    const secretAddrHex = web3.utils.fromAscii(keplrAccount)

    const estimate = router.estimateGas.swapToken
    const method: (...args: any) => Promise<TransactionResponse> = router.swapToken
    const args: string[] = [secretAddrHex, parsedAmountA.raw.toString(), tokens[0].address]

    const value: BigNumber | null = null
    await estimate(...args, value ? { value } : {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then(response => {
          setMinting(true)
          addTransaction(response, {
            summary: t('swapERC20toSNIP20', {
              erc20Symbol: tokens[0].symbol,
              snip20Symbol: tokens[1].symbol,
              amount: parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)
            })
          })

          setTxHash(response.hash)

          ReactGA.event({
            category: 'Minting',
            action: 'Mint',
            label: tokens[1].symbol
          })
        })
      )
      .catch(error => {
        setMinting(false)
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }

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
                  label={tokens[0].symbol}
                  hideCurrencySelect={true}
                  value={formattedAmounts[Field.CURRENCY_A]}
                  onUserInput={onFieldAInput}
                  onMax={() => {
                    onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                  }}
                  showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                  currency={currencies[Field.CURRENCY_A]}
                  id={`mint-${currencies[Field.CURRENCY_A]?.symbol}-src-token`}
                />
                {keplrConnected ? (
                  <>
                    <RowBetween>
                      <Text>
                        <strong>{t('recipientAddress')}</strong>
                        <br />
                        <span style={{ wordBreak: 'break-all', fontSize: '14px' }}>{keplrAccount}</span>
                      </Text>
                      <Question text={t('scrtAddressDescription')} />
                    </RowBetween>

                    {approvalA === ApprovalState.NOT_APPROVED || approvalA === ApprovalState.PENDING ? (
                      <ButtonPrimary
                        onClick={approveACallback}
                        disabled={approvalA === ApprovalState.PENDING}
                        width="100%"
                      >
                        {approvalA === ApprovalState.PENDING ? <Dots>{t('approving')}</Dots> : t('approve')}
                      </ButtonPrimary>
                    ) : (
                      <>
                        {formattedAmounts[Field.CURRENCY_A] ? (
                          <>
                            {Number(formattedAmounts[Field.CURRENCY_A]) >
                            Number(maxAmounts[Field.CURRENCY_A]?.toExact()) ? (
                              <ButtonPrimary disabled={true}>
                                {t('insufficientCurrencyBalance', {
                                  inputCurrency: tokens[0].symbol
                                })}
                              </ButtonPrimary>
                            ) : (
                              <ButtonPrimary
                                onClick={() => {
                                  mintTokens()
                                }}
                                disabled={minting}
                              >
                                {minting ? <Dots>{t('minting')}</Dots> : t('mint')}
                              </ButtonPrimary>
                            )}
                          </>
                        ) : (
                          <ButtonPrimary disabled={true}>{t('enterAmount')}</ButtonPrimary>
                        )}
                      </>
                    )}
                    {txHash && (
                      <MintStatus>
                        <Transaction
                          hash={txHash}
                          callback={() => {
                            setMinting(false)
                          }}
                        />
                      </MintStatus>
                    )}
                  </>
                ) : (
                  <>
                    <KeplrHint>
                      <Trans i18nKey="walletConnectDisclaimerScrtMintKeplr">
                        To mint <strong>{{ outputCurrency }}</strong> you need to connect your
                        <Link href="https://wallet.keplr.app/" target="_blank">
                          Keplr Wallet
                        </Link>
                        and select the &quot;Secret Network&quot;
                      </Trans>
                    </KeplrHint>
                    <KeplrConnect />
                  </>
                )}
              </AutoColumn>
            ) : (
              <AutoColumn gap={'12px'}>
                <BlueCard style={{ margin: '12px 0' }}>
                  <TYPE.link textAlign="center" fontWeight={400}>
                    {t('burnScrtDescription', { inputCurrency: outputCurrency, outputCurrency: inputCurrency })}
                  </TYPE.link>
                </BlueCard>
                <CurrencyInputPanel
                  label={tokens[1].symbol}
                  hideCurrencySelect={true}
                  value={burnInput}
                  onUserInput={onFieldBInput}
                  onMax={() => {
                    setBurnInput(burnBalance)
                  }}
                  currency={currencies[Field.CURRENCY_A]}
                  balanceOveride
                  newBalance={Number(burnBalance)}
                  showMaxButton={!burnInput || parseFloat(burnInput) < parseFloat(burnBalance)}
                  id={`burn-${tokens[1].symbol.toLowerCase()}-src-token`}
                />
                {keplrConnected ? (
                  <>
                    <RowBetween>
                      <Text>
                        <strong>{t('recipientAddress')}</strong>
                        <br />
                        <span style={{ wordBreak: 'break-all', fontSize: '14px' }}>{account}</span>
                      </Text>
                      <Question text={t('web3AddressDescription')} />
                    </RowBetween>
                    {burnInput ? (
                      <>
                        {parseFloat(burnInput) > parseFloat(burnBalance) ? (
                          <ButtonPrimary disabled={true}>
                            {t('insufficientCurrencyBalance', {
                              inputCurrency: tokens[1].symbol
                            })}
                          </ButtonPrimary>
                        ) : (
                          <ButtonPrimary
                            onClick={() => {
                              burnTokens()
                            }}
                            disabled={burning}
                          >
                            {burning ? <Dots>{t('burning')}</Dots> : t('burn')}
                          </ButtonPrimary>
                        )}
                      </>
                    ) : (
                      <ButtonPrimary disabled={true}>{t('enterAmount')}</ButtonPrimary>
                    )}
                  </>
                ) : (
                  <>
                    <KeplrHint>
                      <Trans i18nKey="walletConnectDisclaimerScrtMintKeplr">
                        To mint <strong>{{ outputCurrency }}</strong> you need to connect your
                        <Link href="https://wallet.keplr.app/" target="_blank">
                          Keplr Wallet
                        </Link>
                        and select the &quot;Secret Network&quot;
                      </Trans>
                    </KeplrHint>
                    <KeplrConnect />
                  </>
                )}
              </AutoColumn>
            )}
          </>
        )}
      </AppBody>
    </>
  )
}
