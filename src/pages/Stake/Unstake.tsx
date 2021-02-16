import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { TokenAmount, WETH } from '@uniswap/sdk'
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
import { ACTIVE_REWARD_POOLS, UNI_POOLS } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency, useToken } from '../../hooks/Tokens'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Field } from '../../state/mint/actions'
import { mphPool, StakingRewards, syflPool } from '../../components/ABI'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'
import { toV2LiquidityToken } from '../../state/user/hooks'
import { calculateGasMargin, getContract } from '../../utils'
import AppBody, { AppBodyDark } from '../AppBody'
import { Dots, Wrapper } from '../Pool/styleds'
import QuestionHelper from '../../components/QuestionHelper'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import ReactGA from 'react-ga'
import FullStakingCard from '../../components/PositionCard/fullStakingCard'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import hexStringToNumber from '../../utils/hexStringToNumber'

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 6px;
  justify-content: space-evenly;
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

export default function Unstake({
  match: {
    params: { currencyIdA, currencyIdB }
  }
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const [balance, setBalance] = useState(0)
  const [userBalance, setUserBalance] = useState(0)
  const [unstaking, setUnstaking] = useState(false)
  const { account, chainId, library } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)
  const [pool, setPool] = useState({
    rewardsAddress: '0x0000000000000000000000000000000000000000',
    abi: 'StakingRewards',
    type: 'default',
    balance: 0,
    tokens: ['', ''],
    liquidityToken: ''
  })
  const [found, setFound] = useState(false)
  let liquidityToken: any
  let wrappedLiquidityToken
  let hasError
  let tokenA = useToken(currencyIdA)
  let tokenB = useToken(currencyIdB)
  const isUni = currencyIdA === 'UNI'

  if (!tokenA) {
    tokenA = chainId ? WETH[chainId] : WETH['1']
  }

  if (!tokenB) {
    tokenB = chainId ? WETH[chainId] : WETH['1']
  }

  let currencyAsymbol = 'ETH'
  let currencyBsymbol = 'ETH'

  if (tokenA && tokenB) {
    let liquidityTokenAddress = ''
    if (isUni) {
      liquidityToken = UNI_POOLS.MFGWETH.liquidityToken
      liquidityTokenAddress = liquidityToken.address
      if (!found) {
        Object.entries(UNI_POOLS).forEach((entry: any) => {
          if (entry[0] === currencyIdB) {
            console.log('entry', entry)
            setFound(true)
            liquidityToken = entry[1].liquidityToken
            liquidityTokenAddress = liquidityToken.address
            setPool(entry[1])
            currencyAsymbol = entry[1].tokens[0].symbol
            currencyBsymbol = entry[1].tokens[1].symbol
            return
          }
        })
      }
    }
    if (!isUni) {
      liquidityToken = toV2LiquidityToken([tokenA, tokenB])
      liquidityTokenAddress = liquidityToken.address
      if (!found) {
        ACTIVE_REWARD_POOLS.forEach((pool: any) => {
          if (pool.address === liquidityTokenAddress) {
            setFound(true)
            currencyAsymbol = tokenA?.symbol ?? 'ETH'
            currencyBsymbol = tokenB?.symbol ?? 'ETH'
            setPool(pool)
            return
          }
        })
      }
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
  const { dependentField, currencies, parsedAmounts, noLiquidity } = useDerivedMintInfo(
    wrappedLiquidityToken ?? undefined,
    undefined
  )
  const { onFieldAInput } = useMintActionHandlers(noLiquidity)
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  const maxAmount = userBalance | 0

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmount === Number(parsedAmounts[field] ?? '0')
    }
  }, {})

  const rewardsContractAddress = pool.rewardsAddress
  let currentAbi: any
  switch (pool.abi) {
    case 'syflPool':
      currentAbi = syflPool
      break
    case 'mphPool':
      currentAbi = mphPool
      break
    default:
      currentAbi = StakingRewards
  }

  const addTransaction = useTransactionAdder()
  const { t } = useTranslation()

  const { [Field.CURRENCY_A]: parsedAmountA } = parsedAmounts
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, liquidityToken ?? undefined)
  let buttonString = parsedAmountA ? t('unstake') : t('enterAmount')

  async function unstakeAndClaimRewards(rewardsContractAddress: string) {
    if (!chainId || !library || !account || !parsedAmountA) return
    const router = getContract(rewardsContractAddress, currentAbi, library, account)
    const isDefault = currentAbi === StakingRewards
    const estimate = isDefault ? router.estimateGas.unstakeAndClaimRewards : router.estimateGas.exit
    const method: (...args: any) => Promise<TransactionResponse> = isDefault
      ? router.unstakeAndClaimRewards
      : router.exit
    const args: Array<string> = isDefault ? [parsedAmountA.raw.toString()] : []

    const value: BigNumber | null = null
    await estimate(...args, value ? { value } : {})
      .then(estimatedGasLimit =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit)
        }).then(response => {
          setUnstaking(true)
          setBalance(userBalance)
          addTransaction(response, {
            summary: t('unstakeAndClaimRewardsOnPool', {
              currencyASymbol: currencyAsymbol,
              currencyBSymbol: currencyBsymbol,
              amount: parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)
            })
          })

          ReactGA.event({
            category: 'Staking',
            action: 'UnstkeAndClaimRewards',
            label: currencyAsymbol + ' | ' + currencyBsymbol
          })
        })
      )
      .catch(error => {
        setUnstaking(false)
        if (error?.code !== 4001) {
          console.error(error)
        }
      })
  }

  if ((parsedAmountA && Number(parsedAmounts[Field.CURRENCY_A]?.toExact()) > userBalance) || userBalance === 0) {
    buttonString = t('insufficientStakedCurrencyBalance', { inputCurrency: currencies[Field.CURRENCY_A]?.symbol })
    hasError = true
  } else {
    hasError = false
  }

  pool.balance = selectedCurrencyBalance ? Number(selectedCurrencyBalance?.toSignificant(6)) : 0
  if (!isUni) {
    const passedCurrencyA = currencyIdA === 'ETH' ? (chainId ? WETH[chainId] : WETH['1']) : currencyA
    const passedCurrencyB = currencyIdB === 'ETH' ? (chainId ? WETH[chainId] : WETH['1']) : currencyB

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    pool.tokens = [passedCurrencyA, passedCurrencyB]
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  pool.liquidityToken = wrappedLiquidityToken

  const stakingValues = pool

  useMemo(() => {
    if (!found || !chainId || !library || !account || !liquidityToken) return
    const rewardsContract = getContract(pool.rewardsAddress, currentAbi, library, account)
    const method: (...args: any) => Promise<BigNumber> = rewardsContract.balanceOf
    const args: Array<string | string[] | number> = [account]
    method(...args).then(response => {
      if (BigNumber.isBigNumber(response)) {
        setUserBalance(hexStringToNumber(response.toHexString(), liquidityToken.decimals))
      }
    })
  }, [account, liquidityToken, chainId, library, currentAbi, pool.rewardsAddress, found])

  useMemo(() => {
    if (balance !== userBalance) {
      setUnstaking(false)
      onFieldAInput('')
    }
  }, [balance, userBalance, setUnstaking, onFieldAInput])

  if (!found) {
    return null
  } else {
    return (
      <>
        <Card style={{ maxWidth: '420px', padding: '12px', backgroundColor: theme.navigationBG, marginBottom: '16px' }}>
          <SwapPoolTabs active={'stake'} />
        </Card>
        <AppBody>
          <Tabs>
            <RowBetween style={{ padding: '1rem 0' }}>
              <ActiveText>
                {t('unStakeLPToken', {
                  currencyASymbol: currencyA?.symbol,
                  currencyBSymbol: currencyB?.symbol
                })}
              </ActiveText>
              <QuestionHelper
                text={t('unStakeLPTokenDescription', {
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
                balanceOveride={true}
                newBalance={userBalance}
                value={formattedAmounts[Field.CURRENCY_A]}
                onUserInput={onFieldAInput}
                onMax={() => {
                  onFieldAInput(String(userBalance) ?? '')
                }}
                showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                currency={currencies[Field.CURRENCY_A]}
                id="unstake-input-tokena"
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
              {unstaking ? (
                <ButtonPrimary style={{ fontSize: '20px' }} disabled={true}>
                  <Dots>{t('unstaking')}</Dots>
                </ButtonPrimary>
              ) : (
                <ButtonPrimary
                  style={{ fontSize: '20px' }}
                  onClick={() => {
                    unstakeAndClaimRewards(rewardsContractAddress)
                  }}
                  disabled={hasError || !parsedAmountA}
                >
                  <Text fontSize={20} fontWeight={500}>
                    {buttonString}
                  </Text>
                </ButtonPrimary>
              )}
            </AutoColumn>
          )}
        </AppBodyDark>
        {account && rewardsContractAddress && wrappedLiquidityToken && (
          <AutoColumn style={{ marginTop: '1rem', maxWidth: '420px', width: '100%' }}>
            <FullStakingCard values={stakingValues} my={true} show={true} index={0} />
          </AutoColumn>
        )}
      </>
    )
  }
}
