import React, { useContext, useEffect } from 'react'
import { Text } from 'rebass'
import { BlueCard, NavigationCard } from '../../components/Card'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import AppBody from '../AppBody'
import { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import Question from '../../components/QuestionHelper'
import { TYPE } from '../../theme'
import { renBCH, renBTC, renDGB, renDOGE, renFIL, renLUNA, renZEC } from '../../constants'
import BridgeCurrencyLogo from '../../components/BridgeLogo'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useNavigationActiveItemManager } from '../../state/navigation/hooks'

export default function Ren() {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  const bridges = [
    {
      url: 'bridges/ren/bch',
      currency0: { symbol: 'BCH', decimals: renBCH.decimals },
      currency1: unwrappedToken(renBCH),
      inverse: false,
      type: 'ren'
    },
    {
      url: 'bridges/ren/btc',
      currency0: { symbol: 'BTC', decimals: renBTC.decimals },
      currency1: unwrappedToken(renBTC),
      inverse: false,
      type: 'ren'
    },
    {
      url: 'bridges/ren/dgb',
      currency0: { symbol: 'DGB', decimals: renDGB.decimals },
      currency1: unwrappedToken(renDGB),
      inverse: false,
      type: 'ren'
    },
    {
      url: 'bridges/ren/doge',
      currency0: { symbol: 'DOGE', decimals: renDOGE.decimals },
      currency1: unwrappedToken(renDOGE),
      inverse: false,
      type: 'ren'
    },
    {
      url: 'bridges/ren/fil',
      currency0: { symbol: 'FIL', decimals: renFIL.decimals },
      currency1: unwrappedToken(renFIL),
      inverse: false,
      type: 'ren'
    },
    {
      url: 'bridges/ren/luna',
      currency0: { symbol: 'LUNA', decimals: renLUNA.decimals },
      currency1: unwrappedToken(renLUNA),
      inverse: false,
      type: 'ren'
    },
    {
      url: 'bridges/ren/luna',
      currency0: { symbol: 'LUNA', decimals: renLUNA.decimals },
      currency1: unwrappedToken(renLUNA),
      type: 'ren'
    },
    {
      url: 'bridges/ren/zec',
      currency0: { symbol: 'ZEC', decimals: renZEC.decimals },
      currency1: unwrappedToken(renZEC),
      inverse: false,
      type: 'ren'
    }
  ]
  const newActive = useNavigationActiveItemManager()
  useEffect(() => {
    newActive('bridges-ren')
  })
  return (
    <>
      <NavigationCard>
        <SwapPoolTabs active={'none'} />
      </NavigationCard>
      <AppBody>
        <AutoColumn gap={'12px'}>
          <RowBetween>
            <Text color={theme.textPrimary} fontWeight={500}>
              {t('bridgesRen')}
            </Text>
            <Question text={t('bridgesRenDescription')} />
          </RowBetween>
        </AutoColumn>
        <BlueCard style={{ margin: '12px 0 12px' }}>
          <TYPE.link textAlign="center" fontWeight={400}>
            {t('renDescription')}
          </TYPE.link>
        </BlueCard>
        <AutoColumn gap={'12px'}>
          {bridges.map((bridge, i) => {
            return (
              <RowBetween key={i}>
                <BridgeCurrencyLogo bridge={bridge} size={36} />
              </RowBetween>
            )
          })}
        </AutoColumn>
      </AppBody>
    </>
  )
}
