import React from 'react'
import { useTranslation } from 'react-i18next'
import { AutoColumn, ColumnCenter } from '../Column'
import { TYPE } from '../../theme'
import { BlueCard } from '../Card'
import Row, { RowBetween } from '../Row'
import { ButtonPrimary } from '../Button'
import { Link } from 'react-router-dom'

export function FormSuccess() {
  const { t } = useTranslation()
  return (
    <AutoColumn gap="20px">
      <Row>
        <ColumnCenter>
          <BlueCard>
            <AutoColumn gap="10px">
              <TYPE.link fontWeight={600}>{t('thankYou')}</TYPE.link>
              <TYPE.link fontWeight={400}>{t('purchesProcessByWyre')}</TYPE.link>
            </AutoColumn>
          </BlueCard>
        </ColumnCenter>
      </Row>
      <RowBetween>
        <ButtonPrimary as={Link} style={{ padding: 16 }} to="/swap">
          {t('startSwapping')}
        </ButtonPrimary>
      </RowBetween>
    </AutoColumn>
  )
}
