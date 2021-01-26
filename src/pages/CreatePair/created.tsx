import React, { useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled, { ThemeContext } from 'styled-components'
import Card, { BlueCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import { SwapPoolTabs, CreateTabs } from '../../components/NavigationTabs'
import { useTranslation } from 'react-i18next'
import { PairState } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { useDerivedMintInfo } from '../../state/mint/hooks'
import AppBody from '../AppBody'
import { ExternalLinkIcon, Wrapper } from '../Pool/styleds'
import { useTokenUsdPrices } from '../../hooks/useTokenUsdPrice'
import { useLPTokenUsdPrices } from '../../hooks/useLPTokenUsdPrice'
import { ButtonLight } from '../../components/Button'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Text } from 'rebass'
import { TYPE } from '../../theme'
import { Dots } from '../../components/swap/styleds'
import { RowBetween } from '../../components/Row'

const AnalyticsWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 8px 0 0;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 14px;
  line-height: 14px;
  border: 1px solid ${({ theme }) => theme.textSecondary};

  a {
    color: ${({ theme }) => theme.textPrimary};
    text-decoration: none;
    font-weight: 600;
    :hover,
    :focus {
      text-decoration: underline;
    }
  }
`

export default function CreatedPair({
  match: {
    params: { currencyIdA, currencyIdB }
  }
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const { account } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const toggleWalletModal = useWalletModalToggle()
  let currencyA = useCurrency(currencyIdA)
  let currencyB = useCurrency(currencyIdB)
  let newCurrencyA = currencyA
  let newCurrencyB = currencyB

  switch (currencyB?.symbol) {
    case 'LINK':
      if (currencyA?.symbol !== 'ETH') {
        newCurrencyA = currencyB
        newCurrencyB = currencyA
      }
      break

    case 'ETH':
      if (currencyA?.symbol !== 'LINK') {
        newCurrencyA = currencyB
        newCurrencyB = currencyA
      }
      break
  }

  currencyA = newCurrencyA
  currencyB = newCurrencyB
  const { pair, pairState, noLiquidity } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  // get formatted amounts
  const { t } = useTranslation()
  const tokenPairAddress = pair ? 'https://info.linkswap.app/pair/' + pair?.liquidityToken.address : false

  useTokenUsdPrices()
  useLPTokenUsdPrices()
  return (
    <>
      <Card style={{ maxWidth: '420px', padding: '12px', backgroundColor: theme.appBGColor, marginBottom: '16px' }}>
        <SwapPoolTabs active={'create'} />
      </Card>
      <AppBody>
        <CreateTabs />
        {!account ? (
          <ButtonLight onClick={toggleWalletModal}>{t('connectWallet')}</ButtonLight>
        ) : (
          <>
            <Text style={{ marginBottom: 18 }}>
              {t('pairCreation', { currencyA: currencyA?.symbol, currencyB: currencyB?.symbol })}
            </Text>

            {pair && !noLiquidity && pairState !== PairState.INVALID ? (
              <Wrapper>
                <BlueCard style={{ padding: 14, marginBottom: 18 }}>
                  <TYPE.body color={theme.appInfoBoxTextColor} textAlign="center">
                    {t('pairCreationSuccess')}
                  </TYPE.body>
                </BlueCard>
                {tokenPairAddress && (
                  <RowBetween>
                    <AnalyticsWrapper>
                      <a target="_blank" rel="noopener noreferrer" href={tokenPairAddress}>
                        {t('viewPairAnalytics')} <ExternalLinkIcon />
                      </a>
                    </AnalyticsWrapper>
                  </RowBetween>
                )}
              </Wrapper>
            ) : (
              <Wrapper>
                <BlueCard style={{ padding: 14, marginBottom: 18 }}>
                  <TYPE.body color={theme.appInfoBoxTextColor} textAlign="center">
                    {t('pairCreationDisclaimer')}
                  </TYPE.body>
                </BlueCard>
                <AutoColumn style={{ marginTop: '1rem', maxWidth: '420px', width: '100%' }}>
                  <Text fontWeight={500} fontSize={20}>
                    <Dots>{t('loading')}</Dots>
                  </Text>
                </AutoColumn>
              </Wrapper>
            )}
          </>
        )}
      </AppBody>
    </>
  )
}
