import { Token } from '@uniswap/sdk'
import { transparentize } from 'polished'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useAllTokens } from '../../hooks/Tokens'
import { ExternalLink, TYPE } from '../../theme'
import { getEtherscanLink, shortenAddress } from '../../utils'
import CurrencyLogo from '../CurrencyLogo'
import Modal from '../Modal'
import { AutoRow, RowBetween } from '../Row'
import { AutoColumn } from '../Column'
import { AlertTriangle } from 'react-feather'
import { ButtonError } from '../Button'
import { useTranslation } from 'react-i18next'

const Wrapper = styled.div<{ error: boolean }>`
  background: ${({ theme }) => transparentize(0.6, theme.buttonBG)};
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius};
`

const WarningContainer = styled.div`
  max-width: 420px;
  width: 100%;
  padding: 1rem;
  background: rgba(242, 150, 2, 0.05);
  border: 1px solid #f3841e;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: auto;
`

const StyledWarningIcon = styled(AlertTriangle)`
  stroke: ${({ theme }) => theme.red2};
`

interface TokenWarningCardProps {
  token?: Token
}

function TokenWarningCard({ token }: TokenWarningCardProps) {
  const { chainId } = useActiveWeb3React()

  const tokenSymbol = token?.symbol?.toLowerCase() ?? ''
  const tokenName = token?.name?.toLowerCase() ?? ''

  const allTokens = useAllTokens()

  const duplicateNameOrSymbol = useMemo(() => {
    if (!token || !chainId) return false

    return Object.keys(allTokens).some(tokenAddress => {
      const userToken = allTokens[tokenAddress]
      if (userToken.equals(token)) {
        return false
      }
      return userToken.symbol?.toLowerCase() === tokenSymbol || userToken.name?.toLowerCase() === tokenName
    })
  }, [token, chainId, allTokens, tokenSymbol, tokenName])

  const { t } = useTranslation()

  if (!token) return null

  return (
    <Wrapper error={duplicateNameOrSymbol}>
      <AutoRow gap="6px">
        <AutoColumn gap="24px">
          <CurrencyLogo currency={token} size={'16px'} />
          <div> </div>
        </AutoColumn>
        <AutoColumn gap="10px" justify="flex-start">
          <TYPE.main>
            {token && token.name && token.symbol && token.name !== token.symbol
              ? `${token.name} (${token.symbol})`
              : token.name || token.symbol}{' '}
          </TYPE.main>
          {chainId && (
            <ExternalLink style={{ fontWeight: 400 }} href={getEtherscanLink(chainId, token.address, 'token')}>
              <TYPE.blue title={token.address}>
                {shortenAddress(token.address)} ({t('viewOnEtherscan')})
              </TYPE.blue>
            </ExternalLink>
          )}
        </AutoColumn>
      </AutoRow>
    </Wrapper>
  )
}

export default function TokenWarningModal({
  isOpen,
  tokens,
  onConfirm
}: {
  isOpen: boolean
  tokens: Token[]
  onConfirm: () => void
}) {
  const [understandChecked, setUnderstandChecked] = useState(false)
  const toggleUnderstand = useCallback(() => setUnderstandChecked(uc => !uc), [])
  const handleDismiss = useCallback(() => null, [])
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)

  return (
    <Modal isOpen={isOpen} onDismiss={handleDismiss} maxHeight={90}>
      <WarningContainer className="token-warning-container">
        <AutoColumn gap="lg">
          <AutoRow gap="6px">
            <StyledWarningIcon />
            <TYPE.main color={'red2'}>{t('tokenImported')}</TYPE.main>
          </AutoRow>
          <TYPE.body color={'red2'}>{t('anyoneCanCreateAToken')}</TYPE.body>
          <TYPE.body color={'red2'}>{t('loadingArbitraryToken')}</TYPE.body>
          <TYPE.body color={'red2'}>
            <strong>{t('tokenWarning')}</strong>
          </TYPE.body>
          {tokens.map(token => {
            return <TokenWarningCard key={token.address} token={token} />
          })}
          <RowBetween>
            <div>
              <label style={{ cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  className="understand-checkbox"
                  checked={understandChecked}
                  onChange={toggleUnderstand}
                />
                &nbsp;{t('iUnderstand')}
              </label>
            </div>
            <ButtonError
              disabled={!understandChecked}
              error={true}
              width={'140px'}
              padding="0.5rem 1rem"
              className="token-dismiss-button"
              style={{
                borderRadius: theme.borderRadius
              }}
              onClick={() => {
                onConfirm()
              }}
            >
              <TYPE.body color="white">{t('continue')}</TYPE.body>
            </ButtonError>
          </RowBetween>
        </AutoColumn>
      </WarningContainer>
    </Modal>
  )
}
