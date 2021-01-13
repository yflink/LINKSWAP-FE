import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { TokenAmount } from '@uniswap/sdk'
import React, { useContext, useMemo, useState } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { ButtonLight, ButtonPrimary } from '../../components/Button'
import Card from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { RowBetween } from '../../components/Row'
import { useTranslation } from 'react-i18next'
import { ACTIVE_REWARD_POOLS } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency, useToken } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/mint/actions'
import { StakingRewards } from './stakingAbi'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'
import { toV2LiquidityToken } from '../../state/user/hooks'
import { calculateGasMargin, getContract } from '../../utils'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import AppBody, { AppBodyDark } from '../AppBody'
import { Dots, Wrapper } from '../Pool/styleds'
import QuestionHelper from '../../components/QuestionHelper'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import ReactGA from 'react-ga'
import { FullStakingCard } from '../../components/PositionCard'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useTokenUsdPrices } from '../../hooks/useTokenUsdPrice'
import { useLPTokenUsdPrices } from '../../hooks/useLPTokenUsdPrice'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 6px;
  justify-content: space-evenly;
  margin-inline-start: 16px;
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

export default function StakeIntoPool({
  match: {
    params: { currencyIdA, currencyIdB }
  }
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const [balance, setBalance] = useState(0)
  const [staking, setStaking] = useState(false)
  const { account, chainId, library } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)
  const tokenA = useToken(currencyIdA)
  const tokenB = useToken(currencyIdB)
  const fakeContract = '0x0000000000000000000000000000000000000000'
  const [rewardsContractAddress, setRewardsContractAddress] = useState(fakeContract)
  let liquidityToken
  let wrappedLiquidityToken
  let hasError
  if (tokenA && tokenB) {
    liquidityToken = toV2LiquidityToken([tokenA, tokenB])

    const liquidityTokenAddress = liquidityToken.address
    if (rewardsContractAddress === fakeContract) {
      ACTIVE_REWARD_POOLS.forEach((pool: any) => {
        if (pool.address === liquidityTokenAddress) {
          setRewardsContractAddress(pool.rewardsAddress)
        }
      })
    }

    wrappedLiquidityToken = new WrappedTokenInfo(
      {
        address: liquidityTokenAddress,
        chainId: Number(liquidityToken.chainId),
        name: String(liquidityToken.name),
        symbol: String(liquidityToken.symbol),
        decimals: Number(liquidityToken.decimals),
        logoURI: 'https://logos.linkswap.app/lslp.png'
      },
      []
    )
  }
  const toggleWalletModal = useWalletModalToggle()
  const { independentField, typedValue } = useMintState()
  const { dependentField, currencies, currencyBalances, parsedAmounts, noLiquidity } = useDerivedMintInfo(
    wrappedLiquidityToken ?? undefined,
    undefined
  )
  const { onFieldAInput } = useMintActionHandlers(noLiquidity)
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  // get the max amounts user can add
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

  const addTransaction = useTransactionAdder()
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], rewardsContractAddress)
  const { t } = useTranslation()

  const { [Field.CURRENCY_A]: parsedAmountA } = parsedAmounts
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, liquidityToken ?? undefined)
  let buttonString = parsedAmountA ? t('stake') : t('enterAmount')

  async function onAdd(contractAddress: string) {
    if (rewardsContractAddress === fakeContract || !chainId || !library || !account) return
    const router = getContract(contractAddress, StakingRewards, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA } = parsedAmounts

    if (!parsedAmountA || !currencyA) {
      return
    }

    const estimate = router.estimateGas.stake
    const method: (...args: any) => Promise<TransactionResponse> = router.stake
    const args: Array<string | string[] | number> = [parsedAmountA.raw.toString()]

    const value: BigNumber | null = null
    await estimate(...args, value ? { value } : {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then(response => {
          setStaking(true)
          setBalance(Number(selectedCurrencyBalance?.toSignificant(6)))
          addTransaction(response, {
            summary: t('stakeLPTokenAmount', {
              currencyASymbol: currencyA?.symbol,
              currencyBSymbol: currencyB?.symbol,
              amount: parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)
            })
          })

          ReactGA.event({
            category: 'Staking',
            action: 'Stake',
            label: currencies[Field.CURRENCY_A]?.symbol
          })
        })
      )
      .catch(error => {
        setStaking(false)
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }

  const currentBalance = Number(selectedCurrencyBalance?.toSignificant(6))
  if (
    (parsedAmountA &&
      Number(parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)) > Number(maxAmounts[Field.CURRENCY_A]?.toExact())) ||
    currentBalance === 0
  ) {
    buttonString = t('insufficientCurrencyBalance', { inputCurrency: currencies[Field.CURRENCY_A]?.symbol })
    hasError = true
  } else {
    hasError = false
  }

  const stakingValues = {
    address: liquidityToken?.address,
    liquidityToken: wrappedLiquidityToken,
    rewardsAddress: rewardsContractAddress,
    tokens: [currencyA, currencyB],
    balance: currentBalance || 0
  }

  useMemo(() => {
    if (balance !== currentBalance) {
      setStaking(false)
      onFieldAInput('')
    }
  }, [balance, currentBalance, setStaking, onFieldAInput])

  useTokenUsdPrices()
  useLPTokenUsdPrices()
  return (
    <>
      <Card style={{ maxWidth: '420px', padding: '12px', backgroundColor: theme.appBGColor, marginBottom: '16px' }}>
        <SwapPoolTabs active={'stake'} />
      </Card>
      <AppBody>
        <Tabs>
          <RowBetween style={{ padding: '1rem 0' }}>
            <ActiveText>
              {t('stakeLPToken', {
                currencyASymbol: currencyA?.symbol,
                currencyBSymbol: currencyB?.symbol
              })}
            </ActiveText>
            <QuestionHelper
              text={t('stakeLPTokenDescription', {
                currencyASymbol: currencyA?.symbol,
                currencyBSymbol: currencyB?.symbol
              })}
            />
          </RowBetween>
        </Tabs>
        <Wrapper>
          <AutoColumn gap="20px">
            <CurrencyInputPanel
              hideCurrencySelect={true}
              value={formattedAmounts[Field.CURRENCY_A]}
              onUserInput={onFieldAInput}
              onMax={() => {
                onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
              }}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
              currency={currencies[Field.CURRENCY_A]}
              id="stake-input-tokena"
              showCommonBases
            />
          </AutoColumn>
        </Wrapper>
      </AppBody>
      <AppBodyDark>
        {!account ? (
          <ButtonLight onClick={toggleWalletModal}>{t('connectWallet')}</ButtonLight>
        ) : (
          <AutoColumn gap={'md'}>
            {approvalA === ApprovalState.NOT_APPROVED || approvalA === ApprovalState.PENDING ? (
              <RowBetween>
                <ButtonPrimary
                  style={{ fontSize: '20px' }}
                  onClick={approveACallback}
                  disabled={approvalA === ApprovalState.PENDING}
                  width="100%"
                >
                  {approvalA === ApprovalState.PENDING ? <Dots>{t('approving')}</Dots> : t('approve')}
                </ButtonPrimary>
              </RowBetween>
            ) : staking ? (
              <ButtonPrimary style={{ fontSize: '20px' }} disabled={true}>
                <Dots>{t('staking')}</Dots>
              </ButtonPrimary>
            ) : (
              <ButtonPrimary
                style={{ fontSize: '20px' }}
                onClick={() => {
                  onAdd(rewardsContractAddress)
                }}
                disabled={approvalA !== ApprovalState.APPROVED || hasError}
              >
                <Text fontSize={20} fontWeight={500}>
                  {buttonString}
                </Text>
              </ButtonPrimary>
            )}
            {hasError && (
              <ButtonPrimary
                style={{ fontSize: '20px' }}
                as={Link}
                to={`/add/${currencyIdA}/${currencyIdB}`}
                width="100%"
              >
                {t('addLiquidity')}
              </ButtonPrimary>
            )}
          </AutoColumn>
        )}
      </AppBodyDark>
      {account && rewardsContractAddress && wrappedLiquidityToken && (
        <AutoColumn style={{ marginTop: '1rem', maxWidth: '420px', width: '100%' }}>
          <FullStakingCard values={stakingValues} my={true} show={true} />
        </AutoColumn>
      )}
    </>
  )
}
