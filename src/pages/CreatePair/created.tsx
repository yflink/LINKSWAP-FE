import { currencyEquals, WETH } from '@uniswap/sdk'
import React, { useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { ThemeContext } from 'styled-components'
import Card, { BlueCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import { SwapPoolTabs, CreateTabs } from '../../components/NavigationTabs'
import { MinimalPositionCard } from '../../components/PositionCard'
import { useTranslation } from 'react-i18next'
import { PairState } from '../../data/Reserves'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { useDerivedMintInfo } from '../../state/mint/hooks'
import AppBody from '../AppBody'
import { Wrapper } from '../Pool/styleds'
import { useTokenUsdPrices } from '../../hooks/useTokenUsdPrice'
import { useLPTokenUsdPrices } from '../../hooks/useLPTokenUsdPrice'
import { ButtonLight } from '../../components/Button'
import { useWalletModalToggle } from '../../state/application/hooks'
import { Text } from 'rebass'
import { TYPE } from '../../theme'
import { Dots } from '../../components/swap/styleds'

export default function CreatedPair({
  match: {
    params: { currencyIdA, currencyIdB }
  }
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const { account, chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const toggleWalletModal = useWalletModalToggle()
  let currencyA = useCurrency(currencyIdA)
  let currencyB = useCurrency(currencyIdB)

  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, WETH[chainId])) ||
        (currencyB && currencyEquals(currencyB, WETH[chainId])))
  )

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
            <Wrapper>
              {pair && !noLiquidity && pairState !== PairState.INVALID ? (
                <AutoColumn style={{ marginTop: '1rem', maxWidth: '420px', width: '100%' }}>
                  <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
                </AutoColumn>
              ) : (
                <>
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
                </>
              )}
            </Wrapper>
          </>
        )}
      </AppBody>
    </>
  )
}
