import React, { useCallback, useContext, useMemo, useState } from 'react'
import { Text } from 'rebass'
import { BlueCard, NavigationCard } from '../../components/Card'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import AppBody from '../AppBody'
import styled, { ThemeContext } from 'styled-components'
import RenJS from '@renproject/ren'
import { Loading } from '@renproject/react-components'
import { RenNetwork } from '@renproject/interfaces'
import { useWeb3React } from '@web3-react/core'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
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
import { TYPE } from '../../theme'
import BigNumber from 'bignumber.js'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { Field } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'
import { TokenAmount } from '@uniswap/sdk'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { BurnObject } from '../../components/Burn'
import { DepositObject } from '../../components/Deposit'
import { Link as HistoryLink, RouteComponentProps } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import {
  useGetRenMintsBCH,
  useGetRenMintsBTC,
  useGetRenMintsDGB,
  useGetRenMintsDOGE,
  useGetRenMintsFIL,
  useGetRenMintsLUNA,
  useGetRenMintsZEC,
  useRenMintsBCH,
  useRenMintsBTC,
  useRenMintsDGB,
  useRenMintsDOGE,
  useRenMintsFIL,
  useRenMintsLUNA,
  useRenMintsZEC
} from '../../state/ren/hooks'
import { useNavigationActiveItemManager } from '../../state/navigation/hooks'

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
  font-size: 16px;
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

export default function RenBridge({
  match: {
    params: { bridgeName }
  }
}: RouteComponentProps<{ bridgeName?: string }>) {
  const inputCurrency = bridgeName ? bridgeName.toUpperCase() : 'DOGE'
  const outputCurrency = 'ren' + inputCurrency
  const { BTC } = useGetRenMintsBTC()
  const { BCH } = useGetRenMintsBCH()
  const { FIL } = useGetRenMintsFIL()
  const { ZEC } = useGetRenMintsZEC()
  const { LUNA } = useGetRenMintsLUNA()
  const { DGB } = useGetRenMintsDGB()
  const { DOGE } = useGetRenMintsDOGE()
  const newRenMintsBTC = useRenMintsBTC()
  const newRenMintsBCH = useRenMintsBCH()
  const newRenMintsFIL = useRenMintsFIL()
  const newRenMintsZEC = useRenMintsZEC()
  const newRenMintsLUNA = useRenMintsLUNA()
  const newRenMintsDGB = useRenMintsDGB()
  const newRenMintsDOGE = useRenMintsDOGE()
  let token
  let tokenAsset: any
  let tokenName: string
  let previousMint: any
  let newRenMints: any
  switch (inputCurrency) {
    case 'BTC':
      token = renBTC
      tokenAsset = Asset.BTC
      tokenName = 'Bitcoin'
      previousMint = BTC
      newRenMints = newRenMintsBTC
      break
    case 'BCH':
      token = renBCH
      tokenAsset = Asset.BCH
      tokenName = 'Bitcoin Cash'
      previousMint = BCH
      newRenMints = newRenMintsBCH
      break
    case 'FIL':
      token = renFIL
      tokenAsset = Asset.FIL
      tokenName = 'Filecoin'
      previousMint = FIL
      newRenMints = newRenMintsFIL
      break
    case 'ZEC':
      token = renZEC
      tokenAsset = Asset.ZEC
      tokenName = 'ZCash'
      previousMint = ZEC
      newRenMints = newRenMintsZEC
      break
    case 'LUNA':
      token = renLUNA
      tokenAsset = Asset.LUNA
      tokenName = 'Terra (LUNA)'
      previousMint = LUNA
      newRenMints = newRenMintsLUNA
      break
    case 'DGB':
      token = renDGB
      tokenAsset = Asset.DGB
      tokenName = 'Digibyte'
      previousMint = DGB
      newRenMints = newRenMintsDGB
      break
    default:
      token = renDOGE
      tokenAsset = Asset.DOGE
      tokenName = 'Dogecoin'
      previousMint = DOGE
      newRenMints = newRenMintsDOGE
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

  const { deposits, addDeposit, addBurn, updateTransaction, updateMints } = useTransactionStorage(updateBalance)

  async function generateMintAddress(previousMint?: Record<string, unknown>) {
    setGeneratingAddress(true)
    setDepositAddress(null)

    if (!provider) {
      return
    }

    if (!account) {
      return
    }
    try {
      await startMint(
        renJS,
        defaultMintChain,
        provider,
        tokenAsset,
        account,
        setDepositAddress,
        addDeposit,
        previousMint
      )
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

  const newActive = useNavigationActiveItemManager()
  const acitveId = token.symbol ? `bridges-${token.symbol.toLowerCase()}` : 'bridges-rendoge'
  newActive(acitveId)
  return (
    <>
      <BridgeWarningModal isOpen={!dismissBridgeWarning} onConfirm={handleConfirmBridgeWarning} />
      <NavigationCard>
        <SwapPoolTabs active={'none'} />
      </NavigationCard>
      <AppBody>
        <AutoColumn gap={'12px'}>
          <BackButton>
            <HistoryLink to="/ren">
              <ArrowLeft /> {t('bridgesRen')}
            </HistoryLink>
          </BackButton>
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
            <ButtonSecondary onClick={toggleWalletModal}>{t('connectWallet')}</ButtonSecondary>
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
                      <ButtonPrimary
                        onClick={() => {
                          generateMintAddress()
                        }}
                      >
                        {t('mint')}
                      </ButtonPrimary>
                    )}

                    {typeof previousMint !== 'undefined' && typeof previousMint.transaction !== 'undefined' && !resume && (
                      <ButtonSecondary
                        padding="18px"
                        onClick={() => {
                          setResume(true)
                          generateMintAddress(previousMint)
                        }}
                      >
                        {t('resume', { action: t(action) })}
                      </ButtonSecondary>
                    )}
                  </>
                )}
              </AutoColumn>
            ) : (
              <AutoColumn gap={'12px'}>
                <BlueCard style={{ margin: '12px 0 24px' }}>
                  <TYPE.link textAlign="center" fontWeight={400}>
                    {t('burnDescription', { inputCurrency: outputCurrency, outputCurrency: inputCurrency })}
                  </TYPE.link>
                </BlueCard>
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
                {submitting && (
                  <Text textAlign="center">
                    <Loader />
                  </Text>
                )}
                {!submitting && (
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
              .map((txHash, index) => {
                const depositDetails = deposits.get(txHash)!
                if (depositDetails.type === 'BURN') {
                  return <></>
                }
                const { deposit, status } = depositDetails
                updateMints(deposit, newRenMints, status, previousMint, index)

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
