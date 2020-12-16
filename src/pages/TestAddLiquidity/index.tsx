import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'

import { ChainId, JSBI, Percent, Token, CurrencyAmount, Currency, ETHER } from '@uniswap/sdk'
// import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'

import { ROUTER_ADDRESS } from '../../constants'
import { Field } from '../../state/mint/actions'

import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'

import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { abi as IUniswapV2Router02ABI } from './contract.json'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

// account is optional
export function getRouterContract(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(ROUTER_ADDRESS, IUniswapV2Router02ABI, library, account)
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000))
  ]
}

export default function TestAddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB }
  },
  history
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const { account, chainId, library } = useActiveWeb3React()
  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const addTransaction = useTransactionAdder()

  const allowedSlippage = 10000

  console.log(account)
  console.log(chainId)
  console.log(library)

  async function onAdd() {
    if (!chainId || !library || !account) return
    const router = getRouterContract(chainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    console.log(parsedAmounts)

    // if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB) {
    //   console.log('z')
    //   return
    // }

    // const amountsMin = {
    //   [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
    //   [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0]
    // }

    const deadlineFromNow = Math.ceil(Date.now() / 1000) + 600

    let estimate,
      method: (...args: any) => Promise<TransactionResponse>,
      args: Array<string | string[] | number>,
      value: BigNumber | null
    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER
      estimate = router.estimateGas.addLiquidityETH
      method = router.addLiquidityETH
      args = [
        '0xca3dd754c07847C0164948b15D20F8b610D85e4b',
        '1000000000000000000000',
        '1000000000000000000000',
        '1000000000000000',
        '0x8C3113DEA58442be18eEfc8ACe51d2FEA1f0dDae',
        deadlineFromNow
      ]
      value = BigNumber.from('1000000000000000')
    } else {
      estimate = router.estimateGas.addLiquidity
      method = router.addLiquidity
      args = [
        // wrappedCurrency(currencyA, chainId)?.address ?? '',
        // wrappedCurrency(currencyB, chainId)?.address ?? '',
        // parsedAmountA.raw.toString(),
        // parsedAmountB.raw.toString(),
        // amountsMin[Field.CURRENCY_A].toString(),
        // amountsMin[Field.CURRENCY_B].toString(),
        // account,
        // deadlineFromNow
      ]
      value = null
    }

    console.log(method)
    console.log(args)
    console.log(value)

    method(...args, {
      ...(value ? { value } : {})
    }).then(response => {
      addTransaction(response, {
        summary:
          'Add ' +
          parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
          ' ' +
          currencies[Field.CURRENCY_A]?.symbol +
          ' and ' +
          parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
          ' ' +
          currencies[Field.CURRENCY_B]?.symbol
      })

      console.log(response.hash)
    })

    // await estimate(...args, value ? { value } : {})
    //   .then(estimatedGasLimit =>
    //     method(...args, {
    //       ...(value ? { value } : {}),
    //       gasLimit: calculateGasMargin(estimatedGasLimit)
    //     }).then(response => {
    //       addTransaction(response, {
    //         summary:
    //           'Add ' +
    //           parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) +
    //           ' ' +
    //           currencies[Field.CURRENCY_A]?.symbol +
    //           ' and ' +
    //           parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) +
    //           ' ' +
    //           currencies[Field.CURRENCY_B]?.symbol
    //       })

    //       console.log(response.hash)
    //     })
    //   )
    //   .catch(error => {
    //     // we only care if the error is something _other_ than the user rejected the tx
    //     if (error?.code !== 4001) {
    //       console.error(error)
    //     }
    //   })
  }

  return (
    <div>
      Test
      <button onClick={onAdd}>Add</button>
    </div>
  )
}
