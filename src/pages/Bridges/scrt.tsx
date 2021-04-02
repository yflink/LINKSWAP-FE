import React, { useContext, useEffect } from 'react'
import { Text } from 'rebass'
import Card, { BlueCard } from '../../components/Card'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import AppBody from '../AppBody'
import { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import Question from '../../components/QuestionHelper'
import { TYPE } from '../../theme'
import { LINK, WETHER, YFL } from '../../constants'
import BridgeCurrencyLogo from '../../components/BridgeLogo'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { useNavigationActiveItemManager } from '../../state/navigation/hooks'

export default function Scrt() {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  const bridges = [
    {
      url: 'bridges/scrt/weth',
      currency0: WETHER,
      currency1: { symbol: 'secretETH', decimals: 18 },
      inverse: true,
      type: 'scrt'
    },
    {
      url: 'bridges/scrt/link',
      currency0: unwrappedToken(LINK),
      currency1: { symbol: 'secretLINK', decimals: 18 },
      inverse: true,
      type: 'scrt'
    },
    {
      url: 'bridges/scrt/yfl',
      currency0: unwrappedToken(YFL),
      currency1: { symbol: 'secretYFL', decimals: 18 },
      inverse: true,
      type: 'scrt'
    }
  ]
  const newActive = useNavigationActiveItemManager()
  useEffect(() => {
    newActive('bridges-scrt')
  })
  return (
    <>
      <Card style={{ maxWidth: '420px', padding: '12px', backgroundColor: theme.navigationBG, marginBottom: '16px' }}>
        <SwapPoolTabs active={'none'} />
      </Card>
      <AppBody>
        <AutoColumn gap={'12px'}>
          <RowBetween>
            <Text color={theme.textPrimary} fontWeight={500}>
              {t('bridgesScrt')}
            </Text>
            <Question text={t('bridgesScrtDescription')} />
          </RowBetween>
        </AutoColumn>
        <BlueCard style={{ margin: '12px 0 12px' }}>
          <TYPE.link textAlign="center" fontWeight={400}>
            {t('scrtDescription')}
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
