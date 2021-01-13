import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { TokenAmount } from '@uniswap/sdk'
import React, { useContext, useMemo, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { ButtonLight, ButtonPrimary } from '../../components/Button'
import Card from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { RowBetween } from '../../components/Row'
import { useTranslation } from 'react-i18next'
import { ACTIVE_REWARD_POOLS, WETHER } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency, useToken } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/mint/actions'
import { StakingRewards } from './stakingAbi'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'
import { toV2LiquidityToken, useIsExpertMode, useUserDeadline, useUserSlippageTolerance } from '../../state/user/hooks'
import { calculateGasMargin, getContract } from '../../utils'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import AppBody, { AppBodyDark } from '../AppBody'
import { Dots, Wrapper } from '../Pool/styleds'
import QuestionHelper from '../../components/QuestionHelper'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import ReactGA from 'react-ga'
import { addTransaction } from '../../state/transactions/actions'
import { FullStakingCard, StakingPositionCard } from '../../components/PositionCard'
import { useCurrencyBalance } from '../../state/wallet/hooks'

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
  const { account, chainId, library } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)
  const tokenA = useToken(currencyIdA)
  const tokenB = useToken(currencyIdB)
  const [rewardsContractAddress, setRewardsContractAddress] = useState('')
  let liquidityToken
  let wrappedLiquidityToken
  if (tokenA && tokenB) {
    liquidityToken = toV2LiquidityToken([tokenA, tokenB])

    const liquidityTokenAddress = liquidityToken.address
    if (rewardsContractAddress === '') {
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
  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  const [txHash, setTxHash] = useState<string>('')

  const { independentField, typedValue, otherTypedValue } = useMintState()
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

  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], rewardsContractAddress)
  const { t } = useTranslation()

  useMemo(() => {
    if (rewardsContractAddress === '' || !chainId || !library || !account) return
    const rewardsContract = getContract(rewardsContractAddress, StakingRewards, library, account)
    const method: (...args: any) => Promise<BigNumber> = rewardsContract.balanceOf
    const args: Array<string | string[] | number> = [account]
    method(...args).then(response => {
      if (BigNumber.isBigNumber(response)) {
        setBalance(Number(response.toHexString()) / Math.pow(10, 18))
      }
    })
  }, [account, chainId, library, rewardsContractAddress, StakingRewards])

  async function onAdd(contractAddress: string) {
    if (rewardsContractAddress === '' || !chainId || !library || !account) return
    const router = getContract(contractAddress, StakingRewards, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA } = parsedAmounts

    if (!parsedAmountA || !currencyA) {
      return
    }

    const estimate = router.estimateGas.stake
    const method: (...args: any) => Promise<TransactionResponse> = router.stake
    const args: Array<string | string[] | number> = [parsedAmountA.raw.toString()]

    const value: BigNumber | null = null

    setAttemptingTxn(true)
    await estimate(...args, value ? { value } : {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then(response => {
          setAttemptingTxn(false)

          addTransaction(response)

          setTxHash(response.hash)

          ReactGA.event({
            category: 'Staking',
            action: 'Stake',
            label: currencies[Field.CURRENCY_A]?.symbol
          })
        })
      )
      .catch(error => {
        setAttemptingTxn(false)
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }

  const { [Field.CURRENCY_A]: parsedAmountA } = parsedAmounts
  const buttonSting = parsedAmountA ? t('stake') : t('enterAmount')

  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, liquidityToken ?? undefined)

  const stakingValues = {
    address: liquidityToken?.address,
    liquidityToken: liquidityToken,
    rewardsAddress: rewardsContractAddress,
    tokens: [currencyA, currencyB],
    balance: selectedCurrencyBalance?.toSignificant(6) || 0
  }

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
              id="add-liquidity-input-tokena"
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
            ) : (
              <ButtonPrimary
                onClick={() => {
                  onAdd(rewardsContractAddress)
                }}
                disabled={approvalA !== ApprovalState.APPROVED}
              >
                <Text fontSize={20} fontWeight={500}>
                  {buttonSting}
                </Text>
              </ButtonPrimary>
            )}
          </AutoColumn>
        )}
      </AppBodyDark>
      {account && chainId && library && rewardsContractAddress && (
        <AutoColumn style={{ marginTop: '1rem', maxWidth: '420px', width: '100%' }}>
          <FullStakingCard values={stakingValues} my={true} show={true} />
        </AutoColumn>
      )}
    </>
  )
}
