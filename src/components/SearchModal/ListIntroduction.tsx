import React from 'react'
import { ButtonPrimary } from '../Button'
import Column, { AutoColumn } from '../Column'
import { PaddedColumn } from './styleds'
import { useTranslation } from 'react-i18next'

import listDark from '../../assets/images/token-list/lists-dark.png'

export default function ListIntroduction({ onSelectList }: { onSelectList: () => void }) {
  const { t } = useTranslation()

  return (
    <Column style={{ width: '100%', flex: '1 1' }}>
      <PaddedColumn>
        <AutoColumn gap="14px">
          <img style={{ width: '120px', margin: '0 auto' }} src={listDark} alt="token-list-preview" />
          <img
            style={{ width: '100%', borderRadius: '12px' }}
            src="https://cloudflare-ipfs.com/ipfs/QmRf1rAJcZjV3pwKTHfPdJh4RxR8yvRHkdLjZCsmp7T6hA"
            alt="token-list-preview"
          />
          <ButtonPrimary onClick={onSelectList} id="list-introduction-choose-a-list">
            {t('selectList')}
          </ButtonPrimary>
        </AutoColumn>
      </PaddedColumn>
    </Column>
  )
}
