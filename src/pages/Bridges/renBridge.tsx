import React, { useCallback, useContext, useMemo, useState } from 'react'
import { Text } from 'rebass'
import Card, { BlueCard } from '../../components/Card'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import AppBody from '../AppBody'
import styled, { ThemeContext } from 'styled-components'
import RenJS from '@renproject/ren'
import { Loading } from '@renproject/react-components'
import { RenNetwork } from '@renproject/interfaces'
import { useWeb3React } from '@web3-react/core'
import { ButtonLight, ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useTranslation } from 'react-i18next'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import BridgeWarningModal from '../../components/Bridges/warning-modal'
import Question from '../../components/QuestionHelper'
import { Asset, defaultMintChain } from '../../utils/assets'
import { useTokenBalances } from '../../state/wallet/hooks'
import { renBCH, renBTC, renDGB, renDOGE, renFIL, renLUNA, renZEC } from '../../constants'
import { startBurn, startMint } from '../../utils/mint'
import { useTransactionStorage } from '../../utils/useTransactionStorage'
import Web3 from 'web3'
import { Dots } from '../../components/swap/styleds'
import { TYPE } from '../../theme'
import BigNumber from 'bignumber.js'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { Field } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'
import { TokenAmount } from '@uniswap/sdk'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { BurnObject } from '../../components/Burn'
import { DepositObject } from '../../components/Deposit'
import { RouteComponentProps } from 'react-router-dom'

const NavigationWrapper = styled.div`
  display: flex;
  align-items: space-between;
  width: 100%;
  margin: 12px 0;
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
  border-radius: 8px;
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

export default function RenBridge({
  match: {
    params: { bridgeName }
  }
}: RouteComponentProps<{ bridgeName?: string }>) {
  const inputCurrency = bridgeName ? bridgeName.toUpperCase() : 'DOGE'
  const outputCurrency = 'ren' + inputCurrency
  let token
  let tokenAsset: any
  let tokenName: string
  switch (inputCurrency) {
    case 'BTC':
      token = renBTC
      tokenAsset = Asset.BTC
      tokenName = 'Bitcoin'
      break
    case 'BCH':
      token = renBCH
      tokenAsset = Asset.BCH
      tokenName = 'Bitcoin Cash'
      break
    case 'FIL':
      token = renFIL
      tokenAsset = Asset.FIL
      tokenName = 'Filecoin'
      break
    case 'ZEC':
      token = renZEC
      tokenAsset = Asset.ZEC
      tokenName = 'ZCash'
      break
    case 'LUNA':
      token = renLUNA
      tokenAsset = Asset.LUNA
      tokenName = 'Terra (LUNA)'
      break
    case 'DGB':
      token = renDGB
      tokenAsset = Asset.DGB
      tokenName = 'Digibyte'
      break
    default:
      token = renDOGE
      tokenAsset = Asset.DOGE
      tokenName = 'Dogecoin'
  }

  const { account } = useWeb3React()
  const theme = useContext(ThemeContext)
  const [dismissBridgeWarning, setDismissBridgeWarning] = useState<boolean>(false)
  const handleConfirmBridgeWarning = useCallback(() => {
    setDismissBridgeWarning(true)
  }, [])
  const [action, setAction] = useState('mint')
  const [resume, setResume] = useState(false)
  const [generatingAddress, setGeneratingAddress] = useState(false)
  const [depositAddress, setDepositAddress] = useState<
    string | { address: string; params?: string; memo?: string } | null
  >(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [recipientAddress, setRecipientAddress] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const toggleWalletModal = useWalletModalToggle()
  const { t } = useTranslation()
  const renJS = useMemo(() => new RenJS(RenNetwork.Mainnet, {}), [])
  const balance = useTokenBalances(account ?? undefined, [token])
  const userBalance = balance[token.address]
  const web3 = new Web3(Web3.givenProvider)
  const provider = web3.currentProvider
  const { independentField, typedValue } = useMintState()
  const { dependentField, currencies, parsedAmounts, noLiquidity, currencyBalances } = useDerivedMintInfo(
    token ?? undefined,
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
  const updateBalance = useCallback(
    (assetIn?: Asset) => {
      if (assetIn && assetIn !== tokenAsset) {
        return
      }
      return userBalance
    },
    [userBalance, tokenAsset]
  )

  const { deposits, addDeposit, addBurn, updateTransaction } = useTransactionStorage(updateBalance)
  async function generateMintAddress() {
    setGeneratingAddress(true)
    setDepositAddress(null)

    if (!provider) {
      return
    }

    if (!account) {
      return
    }
    try {
      await startMint(renJS, defaultMintChain, provider, tokenAsset, account, setDepositAddress, addDeposit)
    } catch (error) {
      console.error(error)
      setErrorMessage(String(error.message || error.error || JSON.stringify(error)))
    }
    setGeneratingAddress(false)
  }

  async function burnTokens() {
    setSubmitting(true)
    setErrorMessage(null)
    if (!provider) {
      return
    }
    if (!account) {
      return
    }
    if (!formattedAmounts[Field.CURRENCY_A]) {
      setErrorMessage(t('needValidAmount'))
      setSubmitting(false)
      return
    }
    if (new BigNumber(formattedAmounts[Field.CURRENCY_A]).lte(0.00005)) {
      setErrorMessage(t('needMinimumAmount'))
      setSubmitting(false)
      return
    }
    setErrorMessage(null)
    try {
      const burn = await startBurn(
        renJS,
        defaultMintChain,
        provider,
        tokenAsset,
        recipientAddress,
        formattedAmounts[Field.CURRENCY_A],
        account,
        updateTransaction
      )
      const txHash = await burn.txHash()
      if (burn.burnDetails) {
        addBurn(txHash, burn)
      }
    } catch (error) {
      console.error(error)
      setErrorMessage(String(error.message || error.error || JSON.stringify(error)))
    }
    setSubmitting(false)
  }

  return (
    <>
      <BridgeWarningModal isOpen={!dismissBridgeWarning} onConfirm={handleConfirmBridgeWarning} />
      <Card style={{ maxWidth: '420px', padding: '12px', backgroundColor: theme.navigationBG, marginBottom: '16px' }}>
        <SwapPoolTabs active={'none'} />
      </Card>
      <AppBody>
        <AutoColumn gap={'12px'}>
          <RowBetween>
            <Text color={theme.textPrimary} fontWeight={500}>
              {t('bridgeRen', { inputCurrency: outputCurrency })}
            </Text>
            <Question
              text={t('bridgeRenDescription', { inputCurrency: inputCurrency, outputCurrency: outputCurrency })}
            />
          </RowBetween>
          <RowBetween>
            <Text>
              {t('yourRenBalance', { currency: outputCurrency, balance: userBalance?.toSignificant(4) ?? 0 })}
            </Text>
          </RowBetween>
          <NavigationWrapper>
            <Navigation
              selected={action === 'mint'}
              primary={true}
              left={true}
              onClick={() => {
                setAction('mint')
                setResume(false)
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
                setResume(false)
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
                <BlueCard style={{ margin: '12px 0 24px' }}>
                  <TYPE.link textAlign="center" fontWeight={400}>
                    {t('mintDescription', { inputCurrency: inputCurrency, outputCurrency: outputCurrency })}
                  </TYPE.link>
                </BlueCard>
                {depositAddress && !resume ? (
                  <AutoColumn gap={'5px'}>
                    <Text style={{ padding: '15px 0 0' }}>{t('sendCurrencyTo', { currency: tokenAsset })}:</Text>
                    {typeof depositAddress === 'string' ? (
                      <Text fontSize="14px" fontWeight={600} style={{ wordBreak: 'break-all' }}>
                        {depositAddress}
                      </Text>
                    ) : (
                      <>
                        <Text fontWeight={600} style={{ wordBreak: 'break-all' }}>
                          {depositAddress.address}
                        </Text>
                        {depositAddress.params && (
                          <>
                            <Text style={{ padding: '10px 0 0' }}>{t('addParamsBase64')}:</Text>
                            <Text fontSize="14px" fontWeight={600} style={{ wordBreak: 'break-all' }}>
                              {depositAddress.params}
                            </Text>
                            <Text style={{ padding: '10px 0 0' }}>{t('addParamsBaseHex')}:</Text>
                            <Text fontSize="14px" fontWeight={600} style={{ wordBreak: 'break-all' }}>
                              {Buffer.from(depositAddress.params, 'base64').toString('hex')}
                            </Text>
                          </>
                        )}
                        {depositAddress.memo && (
                          <>
                            <Text style={{ padding: '10px 0 0' }}>{t('addMemo')}:</Text>
                            <Text fontSize="14px" fontWeight={600} style={{ wordBreak: 'break-all' }}>
                              {depositAddress.memo}
                            </Text>
                          </>
                        )}
                      </>
                    )}

                    <BlueCard style={{ margin: '15px 0' }}>
                      <Text textAlign="center" fontSize="12px">
                        {t('onlyDepositOnce')}
                      </Text>
                    </BlueCard>
                    <Text textAlign="center">{t('watchingForDeposits')}</Text>
                    <Text textAlign="center">
                      <Loader />
                    </Text>
                  </AutoColumn>
                ) : (
                  <>
                    {(generatingAddress || resume) && deposits.count() === 0 && (
                      <Text textAlign="center">
                        <Loader />
                      </Text>
                    )}
                    {!generatingAddress && !resume && (
                      <AutoColumn gap="12px">
                        <ButtonPrimary
                          onClick={() => {
                            setResume(false)
                            generateMintAddress()
                          }}
                        >
                          {t('mint')}
                        </ButtonPrimary>
                        <ButtonSecondary
                          padding="18px"
                          onClick={() => {
                            setResume(true)
                            generateMintAddress()
                          }}
                        >
                          {t('resume', { action: t(action) })}
                        </ButtonSecondary>
                      </AutoColumn>
                    )}
                  </>
                )}
              </AutoColumn>
            ) : (
              <AutoColumn gap={'12px'}>
                <BlueCard style={{ margin: '12px 0 12px' }}>
                  <TYPE.link textAlign="center" fontWeight={400}>
                    {t('burnDescription', { inputCurrency: outputCurrency, outputCurrency: inputCurrency })}
                  </TYPE.link>
                </BlueCard>
                {!resume && (
                  <>
                    <Input
                      type="text"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      placeholder={t('walletAddress', { currency: tokenName })}
                      onChange={e => {
                        setErrorMessage(null)
                        setRecipientAddress(e.target.value)
                      }}
                      value={recipientAddress}
                    />
                    <CurrencyInputPanel
                      label={outputCurrency}
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
                  </>
                )}
                <>
                  {submitting && (
                    <Text textAlign="center">
                      <Loader />
                    </Text>
                  )}
                  {!submitting && !resume && (
                    <AutoColumn gap="12px">
                      <ButtonPrimary
                        onClick={() => {
                          burnTokens()
                        }}
                      >
                        {t('burn')}
                      </ButtonPrimary>
                    </AutoColumn>
                  )}
                </>
              </AutoColumn>
            )}
            {errorMessage && (
              <Text padding="1rem 0 0" color={theme.red1}>
                {errorMessage}
              </Text>
            )}
          </>
        )}
        {deposits && action === 'mint' && (
          <>
            {Array.from(deposits.keys())
              .map(txHash => {
                const depositDetails = deposits.get(txHash)!
                if (depositDetails.type === 'BURN') {
                  return <></>
                }
                const { deposit, status } = depositDetails
                return (
                  <DepositObject
                    key={txHash}
                    txHash={txHash}
                    deposit={deposit}
                    status={status}
                    updateTransaction={updateTransaction}
                  />
                )
              })
              .reverse()}
          </>
        )}
        {deposits && action === 'burn' && (
          <>
            {Array.from(deposits.keys())
              .map(txHash => {
                const depositDetails = deposits.get(txHash)!
                if (depositDetails.type === 'BURN') {
                  const { burn, status, confirmations, targetConfs, renVMStatus } = depositDetails
                  return (
                    <BurnObject
                      key={txHash}
                      txHash={txHash}
                      burn={burn}
                      status={status}
                      confirmations={confirmations}
                      targetConfs={targetConfs}
                      updateTransaction={updateTransaction}
                      renVMStatus={renVMStatus}
                    />
                  )
                }
                return <></>
              })
              .reverse()}
          </>
        )}
      </AppBody>
    </>
  )
}
