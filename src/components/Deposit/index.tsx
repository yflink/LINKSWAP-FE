import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Text } from 'rebass'
import { LockAndMintDeposit } from '@renproject/ren/build/main/lockAndMint'
import BigNumber from 'bignumber.js'
import { Loading } from '@renproject/react-components'
import { TxStatus } from '@renproject/interfaces'
import { DepositStatus, handleDeposit, submitDeposit } from '../../utils/mint'
import { BurnDetails, DepositDetails } from '../../utils/useTransactionStorage'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { useTranslation } from 'react-i18next'
import styled, { ThemeContext } from 'styled-components'
import { ButtonPrimary } from '../Button'

const Loader = styled(Loading)`
  display: inline-block;
  &:after {
    border-color: ${({ theme }) => theme.textHighlight} transparent !important;
  }
`

const Link = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.textHighlight};
  max-width: 240px
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;

  &:hover {
    text-decoration: underline;
  }
`

export const ExternalLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({ children, ...props }) => (
  <Link {...props} target="_blank" rel="noopener noreferrer">
    {children}
  </Link>
)

interface DepositProps {
  txHash: string
  deposit: LockAndMintDeposit
  status: DepositStatus
  updateTransaction: (txHash: string, transaction: Partial<BurnDetails> | Partial<DepositDetails>) => void
}

export const DepositObject: React.FC<DepositProps> = ({ txHash, deposit, status, updateTransaction }: DepositProps) => {
  const { asset, from, to } = deposit.params
  const { amount } = deposit.depositDetails

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [amountReadable, setAmountReadable] = useState<string | null>(null)

  const onStatus = useCallback(
    (newStatus: DepositStatus) => {
      updateTransaction(txHash, { status: newStatus })
    },
    [updateTransaction, txHash]
  )

  // Confirmations
  const [confirmations, setConfirmations] = useState<number | null>(null)
  const onConfirmation = useCallback((values_0: number) => {
    setConfirmations(values_0)
  }, [])

  // The RenVM Status - see the TxStatus type.
  const [renVMStatus, setRenVMStatus] = useState<TxStatus | null>(null)

  const [mintTransaction, setMintTransaction] = useState<string | null>(null)

  const step1 = useCallback(() => {
    onStatus(DepositStatus.DETECTED)
    handleDeposit(deposit, onStatus, onConfirmation, setRenVMStatus, setMintTransaction).catch(error => {
      setErrorMessage(String(error.message || error))
      onStatus(DepositStatus.ERROR)
    })
  }, [onConfirmation, setErrorMessage, onStatus, deposit, setRenVMStatus, setMintTransaction])

  const theme = useContext(ThemeContext)
  useEffect(() => {
    ;(async () => {
      step1()
      const decimals = await from.assetDecimals(asset)
      setAmountReadable(new BigNumber(amount).div(new BigNumber(10).exponentiatedBy(decimals)).toFixed())
    })().catch(console.error)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const [submitting, setSubmitting] = useState(false)
  const step2 = useCallback(async () => {
    setSubmitting(true)
    setErrorMessage(null)
    try {
      await submitDeposit(deposit, onStatus, setMintTransaction)
    } catch (error) {
      setErrorMessage(String(error.message || error))
    }
    setSubmitting(false)
  }, [setSubmitting, deposit, onStatus])
  const { t } = useTranslation()

  let targetConfirmations
  switch (asset) {
    case 'FIL':
      targetConfirmations = 200
      break
    case 'BCH':
      targetConfirmations = 16
      break
    case 'ZEC':
      targetConfirmations = 24
      break
    case 'BTC':
      targetConfirmations = 6
      break

    default:
      targetConfirmations = 50
  }

  return (
    <AutoColumn gap="12px">
      <RowBetween>
        <Text fontSize="12px" padding="1rem 0 0">
          {t('received')}:
        </Text>
        <Text fontSize="12px" padding="1rem 0 0">
          {amountReadable ? amountReadable : <Loader />} {asset}
        </Text>
      </RowBetween>
      <RowBetween>
        <Text fontSize="12px">{t('renVMHash')}:</Text>
        <Text fontSize="12px">{txHash}</Text>
      </RowBetween>
      <RowBetween>
        <Text fontSize="12px">{t('status')}:</Text>
        <Text fontSize="12px">
          {status === DepositStatus.CONFIRMED ? (
            <>
              <Loader />
            </>
          ) : (
            status
          )}
        </Text>
      </RowBetween>
      {deposit.depositDetails.transaction ? (
        <RowBetween>
          <Text fontSize="12px">{t('fromTx', { from: from.name })}:</Text>
          <Text fontSize="12px">
            {(from as any).utils.transactionExplorerLink ? (
              <ExternalLink href={(from as any).utils.transactionExplorerLink(deposit.depositDetails.transaction)}>
                {from.transactionID(deposit.depositDetails.transaction)}
              </ExternalLink>
            ) : typeof deposit.depositDetails.transaction === 'string' ? (
              deposit.depositDetails.transaction
            ) : (
              JSON.stringify(deposit.depositDetails.transaction)
            )}
          </Text>
        </RowBetween>
      ) : null}
      {mintTransaction ? (
        <RowBetween>
          <Text fontSize="12px">{t('toTx', { to: to.name })}:</Text>
          <Text fontSize="12px">
            {(to as any).utils.transactionExplorerLink ? (
              <ExternalLink href={(to as any).utils.transactionExplorerLink(mintTransaction)}>
                {mintTransaction}
              </ExternalLink>
            ) : typeof mintTransaction === 'string' ? (
              mintTransaction
            ) : (
              JSON.stringify(mintTransaction)
            )}
          </Text>
        </RowBetween>
      ) : null}
      {status === DepositStatus.CONFIRMED && renVMStatus ? (
        <RowBetween>
          <Text fontSize="12px">{t('renVMStatus')}:</Text>
          <Text fontSize="12px">{renVMStatus}</Text>
        </RowBetween>
      ) : null}

      {status === DepositStatus.DETECTED && confirmations !== null ? (
        <RowBetween>
          <Text fontSize="12px">{t('confirmations')}:</Text>
          <Text fontSize="12px">
            {confirmations}/{targetConfirmations}
          </Text>
        </RowBetween>
      ) : null}

      {status === DepositStatus.SIGNED ? (
        <ButtonPrimary disabled={submitting} onClick={step2}>
          {submitting ? <Loader /> : <>{t('submitTo', { name: to.name })}</>}
        </ButtonPrimary>
      ) : null}

      {status === DepositStatus.ERROR ? (
        <ButtonPrimary disabled={submitting} onClick={step2}>
          {t('retry')}
        </ButtonPrimary>
      ) : null}

      {errorMessage ? (
        <Text padding="1rem 0 0" color={theme.red1}>
          {errorMessage}
        </Text>
      ) : null}
    </AutoColumn>
  )
}
