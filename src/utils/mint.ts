import { Ethereum } from '@renproject/chains-ethereum'
import { Bitcoin, Dogecoin, BitcoinCash, Zcash } from '@renproject/chains-bitcoin'
import { Filecoin } from '@renproject/chains-filecoin'
import { LockChain, LogLevel, MintChain, SimpleLogger, TxStatus } from '@renproject/interfaces'
import RenJS from '@renproject/ren'
import { LockAndMintDeposit } from '@renproject/ren/build/main/lockAndMint'
import { sleep } from '@renproject/utils'
import { BurnAndRelease } from '@renproject/ren/build/main/burnAndRelease'
import BigNumber from 'bignumber.js'

import { NETWORK } from './network'
import { BurnDetails, DepositDetails } from './useTransactionStorage'
import { Asset, Chain } from './assets'

export const logLevel = LogLevel.Log

/*******************************************************************************
 * MINTING
 ******************************************************************************/

// Map a mint chain name and mint parameters to a MintChain object.
export const getMintChainObject = (
  mintChain: Chain,
  mintChainProvider: any,
  recipientAddress?: string,
  amount?: string
): MintChain => {
  switch (mintChain) {
    case Chain.Ethereum:
      let eth = Ethereum(mintChainProvider, NETWORK)
      eth = recipientAddress
        ? eth.Account({
            address: recipientAddress,
            value: amount
          })
        : eth
      return eth as any
    default:
      throw new Error(`Unsupported chain ${mintChain}.`)
  }
}

export const startMint = async (
  renJS: RenJS,
  mintChain: Chain,
  mintChainProvider: any,
  asset: Asset,
  recipientAddress: string,
  showAddress: (address: string | { address: string; params?: string }) => void,
  setMinimumAmount: (amount: string) => void,
  onDeposit: (txHash: string, deposit: LockAndMintDeposit) => void
) => {
  let from: LockChain
  switch (asset) {
    case Asset.BTC:
      from = Bitcoin()
      break
    case Asset.DOGE:
      from = Dogecoin()
      break
    case Asset.BCH:
      from = BitcoinCash()
      break
    case Asset.ZEC:
      from = Zcash()
      break
    case Asset.FIL:
      from = Filecoin()
      break
    default:
      throw new Error(`Unsupported asset ${asset}.`)
  }
  const to: MintChain = getMintChainObject(mintChain, mintChainProvider, recipientAddress)

  switch (asset) {
    case Asset.DOGE:
      const decimals = await from.assetDecimals(asset)
      const fees = await renJS.getFees({ asset, from, to })
      const minimumAmount = new BigNumber(fees.mint).dividedBy(new BigNumber(10).exponentiatedBy(decimals))
      setMinimumAmount(minimumAmount.toFixed())
      break
    case Asset.BTC:
      setMinimumAmount('0.01')
      break
    default:
      setMinimumAmount('0.1')
  }

  const lockAndMint = await renJS.lockAndMint({
    asset,
    from,
    to
  })

  if (lockAndMint.gatewayAddress) {
    showAddress(lockAndMint.gatewayAddress)
  }

  lockAndMint.on('deposit', async deposit => {
    const txHash = await deposit.txHash()
    onDeposit(txHash, (deposit as unknown) as LockAndMintDeposit)
  })
}

export enum DepositStatus {
  DETECTED = 'Detected',
  CONFIRMED = 'Confirmed',
  SIGNED = 'Signed',
  DONE = 'Done',
  ERROR = 'Error'
}

export const handleDeposit = async (
  deposit: LockAndMintDeposit,
  onStatus: (status: DepositStatus) => void,
  onConfirmation: (values_0: number) => void,
  onRenVMStatus: (status: TxStatus) => void,
  onTransactionHash: (txHash: string) => void
) => {
  console.log(deposit.depositDetails)
  console.log(deposit.mintTransaction)
  console.log(deposit.params)
  console.log(deposit.renVM)
  console.log(deposit.status)

  const hash = await deposit.txHash()

  const findTransaction = await deposit.params.to.findTransaction(deposit.params.asset, {
    out: {
      sighash: Buffer.from('00'.repeat(32), 'hex'),
      nhash: deposit._state.nHash!
    }
  } as any)
  if (findTransaction) {
    onStatus(DepositStatus.DONE)
    return
  }

  deposit._state.logger = new SimpleLogger(logLevel, `[${hash.slice(0, 6)}] `)

  await deposit
    .confirmed()
    .on('target', onConfirmation)
    .on('confirmation', onConfirmation)

  onStatus(DepositStatus.CONFIRMED)

  let retries = 1
  let lastError
  while (retries) {
    try {
      await deposit.signed().on('status', onRenVMStatus)
      break
    } catch (error) {
      console.error(error)
      lastError = error
    }
    retries--
    if (retries) {
      await sleep(10)
    }
  }
  if (retries === 0) {
    throw new Error(lastError)
  }

  const mintTransaction = await deposit.findTransaction()
  if (mintTransaction) {
    onTransactionHash(mintTransaction as string)
    onStatus(DepositStatus.DONE)
    return
  }
  onStatus(DepositStatus.SIGNED)
}

export const submitDeposit = async (
  deposit: LockAndMintDeposit,
  onStatus: (status: DepositStatus) => void,
  onTransactionHash: (txHash: string) => void
) => {
  await deposit.mint().on('transactionHash', onTransactionHash)

  onStatus(DepositStatus.DONE)
}

/*******************************************************************************
 * BURNING
 ******************************************************************************/

export enum BurnStatus {
  BURNT = 'Burnt',
  DONE = 'Done',
  ERROR = 'Error'
}

export const startBurn = async (
  renJS: RenJS,
  mintChain: Chain,
  mintChainProvider: any,
  asset: Asset,
  recipientAddress: string,
  amount: string,
  fromAddress: string,
  updateTransaction: (txHash: string, status: Partial<BurnDetails> | Partial<DepositDetails>) => void
): Promise<BurnAndRelease> => {
  let to: LockChain
  switch (asset) {
    case Asset.BTC:
      to = Bitcoin().Address(recipientAddress)
      break
    case Asset.BCH:
      to = BitcoinCash().Address(recipientAddress)
      break
    case Asset.FIL:
      to = Filecoin().Address(recipientAddress)
      break
    case Asset.ZEC:
      to = Zcash().Address(recipientAddress)
      break
    case Asset.DOGE:
      to = Dogecoin().Address(recipientAddress)
      break
    default:
      throw new Error(`Unsupported asset ${asset}.`)
  }
  if (to.utils.addressIsValid && !to.utils.addressIsValid(recipientAddress)) {
    throw new Error(`Invalid recipient address ${recipientAddress}`)
  }
  const value = new BigNumber(amount).times(new BigNumber(10).exponentiatedBy(await to.assetDecimals(asset))).toFixed()
  const from: MintChain = getMintChainObject(mintChain, mintChainProvider, fromAddress, value)

  const burnAndRelease = await renJS.burnAndRelease({
    asset,
    from: from as any,
    to: ((to as any) as LockChain) as any
  })
  let txHash: string | undefined

  await burnAndRelease.burn().on('confirmation', confs => {
    if (txHash) {
      updateTransaction(txHash, {
        confirmations: confs,
        targetConfs: 15
      })
    }
  })

  txHash = await burnAndRelease.txHash()

  burnAndRelease
    .release()
    .on('status', (renVMStatus: TxStatus) => {
      if (txHash) {
        updateTransaction(txHash, { renVMStatus })
      }
    })
    .then(() => {
      if (txHash) {
        updateTransaction(txHash, { status: BurnStatus.DONE })
      }
    })

  return (burnAndRelease as any) as BurnAndRelease
}
