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
import { ButtonLight, ButtonPrimary } from '../../components/Button'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useTranslation } from 'react-i18next'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import Question from '../../components/QuestionHelper'
import { Asset, defaultAsset, defaultMintChain } from '../../utils/assets'
import { useTokenBalances } from '../../state/wallet/hooks'
import { renDOGE } from '../../constants'
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
  background-color: ${({ theme }) => theme.appCurrencyInputBG};
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

export default function Ren() {
  const { account } = useWeb3React()
  const theme = useContext(ThemeContext)
  const [action, setAction] = useState('mint')
  const [generatingAddress, setGeneratingAddress] = useState(false)
  const [depositAddress, setDepositAddress] = useState<
    string | { address: string; params?: string; memo?: string } | null
  >(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [minimumAmount, setMinimumAmount] = useState<string | null>(null)
  const [recipientAddress, setRecipientAddress] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const toggleWalletModal = useWalletModalToggle()
  const { t } = useTranslation()
  const renJS = useMemo(() => new RenJS(RenNetwork.Mainnet, {}), [RenNetwork])
  const balance = useTokenBalances(account ?? undefined, [renDOGE])
  const userBalance = balance[renDOGE.address]
  const web3 = new Web3(Web3.givenProvider)
  const provider = web3.currentProvider
  const { independentField, typedValue } = useMintState()
  const { dependentField, currencies, parsedAmounts, noLiquidity, currencyBalances } = useDerivedMintInfo(
    renDOGE ?? undefined,
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
      if (assetIn && assetIn !== defaultAsset) {
        return
      }
      return userBalance
    },
    [userBalance, defaultAsset]
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
      await startMint(
        renJS,
        defaultMintChain,
        provider,
        defaultAsset,
        account,
        setDepositAddress,
        setMinimumAmount,
        addDeposit
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
      setErrorMessage('Please enter a valid amount.')
      setSubmitting(false)
      return
    }
    if (new BigNumber(formattedAmounts[Field.CURRENCY_A]).lte(0.00005)) {
      setErrorMessage('Amount must be greater than 0.00005')
      setSubmitting(false)
      return
    }
    setErrorMessage(null)
    try {
      const burn = await startBurn(
        renJS,
        defaultMintChain,
        provider,
        defaultAsset,
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
      <Card style={{ maxWidth: '420px', padding: '12px', backgroundColor: theme.appBGColor, marginBottom: '16px' }}>
        <SwapPoolTabs active={'none'} />
      </Card>
      <AppBody>
        <AutoColumn gap={'12px'}>
          <RowBetween>
            <Text color={theme.textPrimary} fontWeight={500}>
              {t('bridgeRenDoge')}
            </Text>
            <Question text={t('bridgeRenDogeDescription')} />
          </RowBetween>
          <RowBetween>
            <Text>{t('yourRenDogeBalance', { currency: 'renDOGE', balance: userBalance?.toSignificant(4) ?? 0 })}</Text>
          </RowBetween>
          <NavigationWrapper>
            <Navigation selected={action === 'mint'} primary={true} left={true} onClick={() => setAction('mint')}>
              {t('mint')}
            </Navigation>
            <Navigation selected={action === 'burn'} primary={true} right={true} onClick={() => setAction('burn')}>
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
                    {t('mintDescription', { inputCurrency: 'DOGE', outputCurrency: 'renDOGE' })}
                  </TYPE.link>
                </BlueCard>
                {depositAddress ? (
                  <AutoColumn gap={'18px'}>
                    <RowBetween>
                      <Text>{t('depositAtLeast')}:</Text>
                      <Text>{t('minimumAmount', { currency: defaultAsset, minimumAmount: minimumAmount ?? 0 })}</Text>
                    </RowBetween>
                    <Text textAlign="center">{t('sendCurrencyTo', { currency: defaultAsset })}:</Text>
                    <BlueCard>
                      <TYPE.link textAlign="center" fontWeight={400}>
                        {depositAddress}
                      </TYPE.link>
                    </BlueCard>
                    <Text textAlign="center">{t('watchingForDeposits')}</Text>
                    <Text textAlign="center">
                      <Loader />
                    </Text>
                  </AutoColumn>
                ) : (
                  <>
                    {generatingAddress ? (
                      <Text textAlign="center">
                        <Dots>{t('loading')}</Dots>
                      </Text>
                    ) : (
                      <ButtonPrimary
                        onClick={() => {
                          generateMintAddress()
                        }}
                      >
                        {t('mint')}
                      </ButtonPrimary>
                    )}
                  </>
                )}
              </AutoColumn>
            ) : (
              <AutoColumn gap={'12px'}>
                <BlueCard style={{ margin: '12px 0 12px' }}>
                  <TYPE.link textAlign="center" fontWeight={400}>
                    {t('burnDescription', { inputCurrency: 'renDOGE', outputCurrency: 'DOGE' })}
                  </TYPE.link>
                </BlueCard>
                <Input
                  type="text"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  placeholder={t('walletAddress', { currency: 'Dogecoin' })}
                  onChange={e => {
                    setErrorMessage(null)
                    setRecipientAddress(e.target.value)
                  }}
                  value={recipientAddress}
                />
                <CurrencyInputPanel
                  label="renDOGE"
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
                <>
                  {submitting ? (
                    <Text textAlign="center">
                      <Loader />
                    </Text>
                  ) : (
                    <ButtonPrimary
                      onClick={() => {
                        burnTokens()
                      }}
                    >
                      {t('burn')}
                    </ButtonPrimary>
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
        {deposits && (
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
      </AppBody>
    </>
  )
}
