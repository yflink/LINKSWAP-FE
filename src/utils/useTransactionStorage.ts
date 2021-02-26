import { useCallback, useState } from 'react'
import { OrderedMap } from 'immutable'
import { LockAndMintDeposit } from '@renproject/ren/build/main/lockAndMint'
import { BurnAndRelease } from '@renproject/ren/build/main/burnAndRelease'
import { TxStatus } from '@renproject/interfaces'

import { Asset } from './assets'
import { BurnStatus, DepositStatus } from './mint'

export interface DepositDetails {
  type: 'MINT'
  deposit: LockAndMintDeposit
  status: DepositStatus
}

export interface BurnDetails {
  type: 'BURN'
  burn: BurnAndRelease
  status: BurnStatus
  confirmations: number
  targetConfs: number | undefined
  renVMStatus: TxStatus | undefined
}

export const useTransactionStorage = (updateBalance: (asset: Asset) => void) => {
  const [deposits, setDeposits] = useState(OrderedMap<string, DepositDetails | BurnDetails>())

  const addDeposit = useCallback(
    (txHash: string, deposit: LockAndMintDeposit) => {
      setDeposits(deposits =>
        deposits.get(txHash)
          ? deposits
          : deposits.set(txHash, {
              type: 'MINT',
              deposit: deposit,
              status: DepositStatus.DETECTED
            })
      )
    },
    [setDeposits]
  )

  const addBurn = useCallback(
    (txHash: string, burn: BurnAndRelease) => {
      setDeposits(deposits =>
        deposits.get(txHash)
          ? deposits
          : deposits.set(txHash, {
              type: 'BURN',
              burn: burn,
              status: BurnStatus.BURNT,
              confirmations: 0,
              targetConfs: undefined,
              renVMStatus: undefined
            })
      )
    },
    [setDeposits]
  )

  const updateTransaction = useCallback(
    (txHash: string, newDetails: Partial<DepositDetails | BurnDetails>) => {
      setDeposits(deposits => {
        const currentDeposit = deposits.get(txHash)
        if (!currentDeposit) {
          return deposits
        }
        if (currentDeposit.type === 'MINT') {
          if (newDetails.status === DepositStatus.DONE) {
            updateBalance(currentDeposit.deposit.params.asset as Asset)
          }
          return deposits.set(txHash, {
            ...currentDeposit,
            ...newDetails
          } as DepositDetails)
        } else {
          if (newDetails.status === BurnStatus.BURNT) {
            updateBalance(currentDeposit.burn.params.asset as Asset)
          }
          return deposits.set(txHash, {
            ...currentDeposit,
            ...newDetails
          } as BurnDetails)
        }
      })
    },
    [setDeposits, updateBalance]
  )

  const updateMints = useCallback((deposit: any, newRenMints: any, status: string, currentMint: any, index: number) => {
    if (index === 0) {
      const depositDetails = deposit.depositDetails
      if (typeof currentMint.transaction !== 'undefined') {
        if (status === 'Done') {
          newRenMints({})
        } else {
          if (depositDetails.transaction.confirmations !== currentMint.transaction.confirmations) {
            newRenMints(depositDetails)
          }
        }
      } else {
        if (status !== 'Done') {
          newRenMints(depositDetails)
        }
      }
    }
  }, [])

  return { deposits, addDeposit, addBurn, updateTransaction, updateMints }
}
