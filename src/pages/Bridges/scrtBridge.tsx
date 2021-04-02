import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, Text } from 'rebass'
import { BlueCard, NavigationCard } from '../../components/Card'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import AppBody from '../AppBody'
import styled, { ThemeContext } from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { ButtonLight, ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Trans, useTranslation } from 'react-i18next'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import Question from '../../components/QuestionHelper'
import { LINK, secretETH, secretLINK, secretYFL, SRCT_BRIDGE, WETHER, YFL } from '../../constants'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { Field } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'
import { TokenAmount, Token } from '@uniswap/sdk'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { Link as HistoryLink, RouteComponentProps } from 'react-router-dom'
import { AlertTriangle, ArrowLeft } from 'react-feather'
import { useNavigationActiveItemManager } from '../../state/navigation/hooks'
import { useGetKplrConnect } from '../../state/keplr/hooks'
import KeplrConnect, { getKeplrClient, getKeplrObject, getViewingKey } from '../../components/KeplrConnect'
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
import { Snip20GetBalance, Snip20SendToBridge, Snip20SwapHash } from '../../components/KeplrConnect/snip20'
import { divDecimals, mulDecimals, numberToSignificant, numberToUsd } from '../../utils/numberUtils'
import { SigningCosmWasmClient } from 'secretjs'
import { sleep } from '../../utils/sleep'
import { FormErrorInner, FormErrorInnerAlertTriangle } from '../../components/Form/error'
import { useGetPriceBase } from '../../state/price/hooks'
import { useGetGasPrices } from '../../state/gas/hooks'
import Loader from '../../components/Loader'

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
  const outputCurrency = inputCurrency === 'WETH' ? 'secretETH' : 'secret' + inputCurrency
  let tokens: [
    Token,
    {
      address: string
      decimals: number
      symbol: string
      name: string
      proxy?: boolean
    }
  ]
  switch (inputCurrency) {
    case 'WETH':
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
  let keplrObject = getKeplrObject()
  const theme = useContext(ThemeContext)
  const toggleWalletModal = useWalletModalToggle()
  const { t } = useTranslation()
  const [txHash, setTxHash] = useState<string>('')
  const [status, setStatus] = useState('Loading')
  const [minting, setMinting] = useState(false)
  const [burning, setBurning] = useState(false)
  const [burnInput, setBurnInput] = useState('')
  const [burnBalance, setBurnBalance] = useState<any>(undefined)
  const [scrtTx, setScrtTx] = useState<string>('')
  const [scrtTxHash, setScrtTxHash] = useState<string>('')
  const [keplrClient, setKeplrClient] = useState<SigningCosmWasmClient | undefined>(undefined)
  const { independentField, typedValue } = useMintState()
  const priceObject = useGetPriceBase()
  const gasObject = useGetGasPrices()
  const { dependentField, currencies, parsedAmounts, noLiquidity, currencyBalances } = useDerivedMintInfo(
    tokens[0] ?? undefined,
    undefined
  )
  const { onFieldAInput } = useMintActionHandlers(noLiquidity)
  const onFieldBInput = useCallback(
    (typedValue: string) => {
      setBurnInput(typedValue)
    },
    [setBurnInput]
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

  async function getSnip20Balance(snip20Address: string, decimals?: string | number): Promise<string> {
    if (!keplrClient) {
      return '0'
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
    getSnip20Balance(tokens[1].address, tokens[1].decimals).then(balance => {
      if (balance !== 'Fix Unlock' && balance !== 'Unlock') {
        setStatus('Burn')
        if (!burnBalance) {
          setBurnBalance(String(balance))
        }
      } else {
        setStatus(balance)
      }
    })
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
        await keplrObject.suggestToken(scrtChainId, tokens[1].address)
        await sleep(1000)
        getBalance()
      } catch (error) {
        console.error(error)
      }
    }
  }

  async function burnTokens() {
    if (!account || !keplrClient) return

    const isEth = inputCurrency === 'WETH'
    const decimals = tokens[1].decimals
    let snip20Address = tokens[1].address
    let recipient = 'secret1tmm5xxxe0ltg6df3q2d69dq770030a2syydc9u'
    let proxyContract = ''

    if (!isEth) {
      if (tokens[1].proxy) {
        proxyContract = 'secret1zxt48uqzquvjsp2a7suzxlyd9n3jfpdw4k5zve'
        recipient = 'secret1zxt48uqzquvjsp2a7suzxlyd9n3jfpdw4k5zve'
        snip20Address = 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek'
      }
    }

    const amount = mulDecimals(burnInput, decimals).toString()
    let txId = ''

    setBurning(true)
    try {
      txId = await Snip20SendToBridge({
        recipient,
        secretjs: keplrClient,
        address: snip20Address,
        amount,
        msg: btoa(account)
      })
      setScrtTx(txId)
    } catch (e) {
      setScrtTx('')
      setBurning(false)
      console.log(e)
    }

    setScrtTxHash(
      Snip20SwapHash({
        txId,
        address: proxyContract !== '' ? proxyContract : snip20Address
      })
    )
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
                  <Text textAlign="center">
                    {t('mintScrtDescription', { inputCurrency: inputCurrency, outputCurrency: outputCurrency })}
                  </Text>
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
                  <Text textAlign="center">
                    {t('burnScrtDescription', { inputCurrency: outputCurrency, outputCurrency: inputCurrency })}
                  </Text>
                </BlueCard>
                {status === 'Burn' ? (
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
                ) : status === 'Loading' ? (
                  <RowBetween style={{ alignItems: 'center' }}>
                    <Text textAlign="center" fontSize={16}>
                      <Dots>{t('loading')}</Dots>
                    </Text>
                    <Text>
                      <Loader />
                    </Text>
                  </RowBetween>
                ) : (
                  <>
                    <Text fontSize={14}>{t('unlockScrtTokenDescription', { tokenSymbol: tokens[1].symbol })}</Text>
                    <ButtonSecondary
                      onClick={() => {
                        unlockToken()
                      }}
                    >
                      {t('unlockScrtToken', { tokenSymbol: tokens[1].symbol })}
                    </ButtonSecondary>
                  </>
                )}
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
                        {burning ? (
                          <MintStatus>
                            <Text fontSize={14}>
                              {t('burningInProgress', {
                                inputToken: tokens[1].symbol,
                                outputToken: tokens[0].symbol,
                                amount: numberToSignificant(burnInput)
                              })}
                            </Text>
                            {scrtTx && (
                              <>
                                <Text style={{ marginTop: '12px' }} fontWeight={600}>
                                  {t('scrtTxId')}:
                                </Text>
                                <Text>{scrtTx}</Text>
                              </>
                            )}
                            {scrtTxHash && (
                              <>
                                <Text style={{ marginTop: '12px' }} fontWeight={600}>
                                  {t('scrtTxHash')}:
                                </Text>
                                <Text>{scrtTx}</Text>
                              </>
                            )}
                          </MintStatus>
                        ) : (
                          <FormErrorInner>
                            <FormErrorInnerAlertTriangle>
                              <AlertTriangle size={24} />
                            </FormErrorInnerAlertTriangle>
                            <p>
                              {t('scrtFeeDisclaimer', {
                                gasCosts: numberToUsd(
                                  (Number(priceObject['ethPriceBase']) / Math.pow(10, 17)) *
                                    (500000 * Number(mulDecimals(gasObject['averageGas'], 8)))
                                )
                              })}
                            </p>
                          </FormErrorInner>
                        )}
                      </>
                    ) : (
                      <>{status === 'Burn' && <ButtonPrimary disabled={true}>{t('enterAmount')}</ButtonPrimary>}</>
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
