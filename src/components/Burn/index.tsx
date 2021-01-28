import * as React from 'react'

import { BurnAndRelease } from '@renproject/ren/build/main/burnAndRelease'
import BigNumber from 'bignumber.js'
import { Loading } from '@renproject/react-components'
import { TxStatus } from '@renproject/interfaces'

import { BurnStatus } from '../../utils/mint'
import { BurnDetails, DepositDetails } from '../../utils/useTransactionStorage'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'
import { Text } from 'rebass'
import styled, { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'

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

interface Props {
  txHash: string
  burn: BurnAndRelease
  status: BurnStatus
  confirmations: number
  targetConfs: number | undefined
  renVMStatus: TxStatus | undefined
  updateTransaction: (txHash: string, transaction: Partial<BurnDetails> | Partial<DepositDetails>) => void
}

export const BurnObject: React.FC<Props> = ({ txHash, burn, status, confirmations, targetConfs, renVMStatus }) => {
  const {
    params: { asset, from },
    burnDetails
  } = burn

  const [errorMessage] = React.useState<string | null>(null)

  const [amountReadable, setAmountReadable] = React.useState<string | null>(null)

  React.useEffect(() => {
    ;(async () => {
      const newValue: string | null =
        (burn.burnDetails &&
          new BigNumber(burn.burnDetails.amount)
            .div(new BigNumber(10).exponentiatedBy(await burn.params.to.assetDecimals(burn.params.asset)))
            .toFixed()) ||
        null
      setAmountReadable(newValue)
    })().catch(console.error)
  })

  const theme = useContext(ThemeContext)
  const { t } = useTranslation()

  return (
    <AutoColumn gap="12px">
      <RowBetween>
        <Text fontSize="12px" padding="1rem 0 0">
          {t('burnt')}:
        </Text>
        <Text fontSize="12px" padding="1rem 0 0">
          {amountReadable ? amountReadable : <Loader />} {asset}
        </Text>
      </RowBetween>
      {burnDetails && burnDetails.to ? (
        <RowBetween>
          <Text fontSize="12px">{t('to')}:</Text>
          <Text fontSize="12px">{burnDetails.to}</Text>
        </RowBetween>
      ) : null}
      <RowBetween>
        <Text fontSize="12px">{t('renVMHash')}:</Text>
        <Text fontSize="12px">{txHash}</Text>
      </RowBetween>
      <RowBetween>
        <Text fontSize="12px">{t('status')}:</Text>
        <Text fontSize="12px">
          {status === BurnStatus.BURNT ? (
            <>
              <Loader />
            </>
          ) : (
            { status }
          )}
        </Text>
      </RowBetween>
      <RowBetween>
        <Text fontSize="12px">{t('renVMStatus')}:</Text>
        <Text fontSize="12px">{renVMStatus}</Text>
      </RowBetween>
      {status === BurnStatus.BURNT && confirmations !== null ? (
        <RowBetween>
          <Text fontSize="12px">{t('confirmations')}:</Text>
          <Text fontSize="12px">
            {confirmations}
            {targetConfs ? <>/{targetConfs}</> : <></>}
          </Text>
        </RowBetween>
      ) : null}

      {burnDetails && burnDetails.transaction ? (
        <RowBetween>
          <Text fontSize="12px">{t('fromTx', { from: from.name })}:</Text>
          <Text fontSize="12px">
            {from.utils.transactionExplorerLink ? (
              <ExternalLink href={from.utils.transactionExplorerLink(burnDetails.transaction)}>
                {from.transactionID(burnDetails.transaction)}
              </ExternalLink>
            ) : (
              burnDetails.transaction
            )}
          </Text>
        </RowBetween>
      ) : null}

      {errorMessage ? (
        <Text padding="1rem 0 0" color={theme.red1}>
          {errorMessage}
        </Text>
      ) : null}
    </AutoColumn>
  )
}
