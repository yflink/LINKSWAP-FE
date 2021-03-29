import React, { useContext } from 'react'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import Card from '../../components/Card'
import { ThemeContext } from 'styled-components'
import AppBody from '../AppBody'
import { AutoColumn } from '../../components/Column'
import { Text } from 'rebass'
import { PreviewListingTabs } from '../../components/NavigationTabs'
import { ButtonPrimary } from '../../components/Button'
import { useTranslation } from 'react-i18next'

export default function PreviewListing() {
  const theme = useContext(ThemeContext)

  type DisplayFlexProps = {
    title: string
    content: string
  }

  const DisplayFlex = ({ title, content }: DisplayFlexProps) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
        <Text style={{ color: 'white' }}>{title}</Text>
        <Text style={{ color: '#AFBCC9' }}>{content}</Text>
      </div>
    )
  }

  const { t } = useTranslation()

  return (
    <>
      <Card style={{ maxWidth: '420px', padding: '12px', backgroundColor: theme.appBGColor, marginBottom: '32px' }}>
        <SwapPoolTabs active={'swap'} />
      </Card>
      <AppBody>
        <AutoColumn>
          <PreviewListingTabs />
        </AutoColumn>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', marginTop: '24px' }}>
          <Text style={{ color: 'white' }}>Rate</Text>
          <div style={{ textAlign: 'end' }}>
            <Text style={{ color: '#AFBCC9', marginBottom: '6px' }}>1 LINK = 500 SPID</Text>
            <Text style={{ color: '#AFBCC9' }}>1 SPID = 0.002 SPID</Text>
          </div>
        </div>
        <DisplayFlex title="Depositing LINK" content="10 LINK" />
        <DisplayFlex title="Depositing SPID" content="5,000 SPID" />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
          <Text style={{ color: 'white' }}>Listing Fee</Text>
          <div style={{ textAlign: 'end' }}>
            <Text style={{ color: '#AFBCC9', marginBottom: '6px' }}>10.0239 YFL</Text>
            <Text fontSize={12} style={{ color: '#AFBCC9' }}>
              $1000 (USD)
            </Text>
          </div>
        </div>
        <DisplayFlex title="RugLock" content="20% Discount" />
      </AppBody>
      <div
        style={{
          backgroundColor: theme.modalFooterBG,
          padding: '24px',
          marginTop: '-6px',
          zIndex: 2,
          borderRadius: `0px 0px ${theme.borderRadius} ${theme.borderRadius}`
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
          <Text style={{ color: 'white' }}>Total</Text>
          <div style={{ textAlign: 'end' }}>
            <Text style={{ color: '#AFBCC9', marginBottom: '6px' }}>8.01912 YFL</Text>
            <Text fontSize={12} style={{ color: '#AFBCC9' }}>
              $800 (USD)
            </Text>
          </div>
        </div>
        <ButtonPrimary>{t('createPool')}</ButtonPrimary>
      </div>
    </>
  )
}
