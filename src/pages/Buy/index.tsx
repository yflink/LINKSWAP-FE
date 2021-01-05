import React, { useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import Card from '../../components/Card'

import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import AppBody from '../AppBody'
import { useTranslation } from 'react-i18next'
import Row, { RowBetween, RowFixed } from '../../components/Row'
import { Text } from 'rebass'
import Question from '../../components/QuestionHelper'
import { Form, Fields, required, isEmail } from '../../components/Form'
import { Field } from '../../components/Field'
import { ButtonLight, ButtonPrimary } from '../../components/Button'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { TYPE } from '../../theme'
import QuestionHelper from '../../components/QuestionHelper'
import { useGetPriceBase } from '../../state/price/hooks'
import { useCurrencyUsdPrice } from '../../hooks/useCurrencyUsdPrice'
import { useWalletModalToggle } from '../../state/application/hooks'
import { WYRE_API_KEY } from '../../connectors'

const InputPanel = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  width: 100%;
  z-index: 1;
`
const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.textTertiary};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
  }
`

const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: '0.75rem 0.5rem 0.75rem 1rem';
`
const Container = styled.div`
  border: 1px solid ${({ theme }) => theme.appCurrencyInputBG};
  background-color: ${({ theme }) => theme.appCurrencyInputBG};
  overflow: hidden;
  border-radius: 6px;
  width: 100%;
  margin: 0 0 12px;
`

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  padding-top: calc(16px + 2rem);
  padding-bottom: 20px;
  margin-top: -2rem;
  width: 100%;
  max-width: 400px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  color: ${({ theme }) => theme.textSecondary};
  background-color: ${({ theme }) => theme.modalFooterBG};
  z-index: -1;

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
`

export default function Buy() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const [amount, setAmount] = useState('0.0')
  const { t } = useTranslation()
  const showFootermodal = amount !== '' && amount !== '0.0'
  const priceObject = useGetPriceBase()
  const formatedUsdPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    priceObject['ethPriceBase']
  )
  const feeFactor = 0.039
  const transactionFee = feeFactor * 100
  const calculatedFees = showFootermodal ? Number(amount) * priceObject['ethPriceBase'] * feeFactor + 0.3 : 0
  const calculatedTotal = showFootermodal ? Number(amount) * priceObject['ethPriceBase'] + calculatedFees : 0
  const formatedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(calculatedTotal)
  const formatedTransactionFee = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    calculatedFees
  )
  const minFee = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(5)
  const toggleWalletModal = useWalletModalToggle()
  const disableBuy = amount === '' || amount === '0.0'

  const ethDestination = account ? 'ethereum:' + account : ''
  useCurrencyUsdPrice()

  const fields: Fields = {
    firstName: {
      id: 'firstName',
      label: t('firstName'),
      style: { paddingInlineEnd: 6 },
      autocomplete: 'given-name',
      validation: { rule: required }
    },
    lastName: {
      id: 'lastName',
      label: t('lastName'),
      style: { paddingInlineStart: 6 },
      autocomplete: 'family-name',
      validation: { rule: required }
    },
    email: {
      id: 'email',
      label: t('email'),
      editor: 'email',
      autocomplete: 'email',
      validation: { rule: isEmail }
    },
    destAmount: {
      id: 'destAmount',
      editor: 'hidden'
    },
    sourceCurrency: {
      id: 'sourceCurrency',
      editor: 'hidden'
    },
    destCurrency: {
      id: 'destCurrency',
      editor: 'hidden'
    },
    dest: {
      id: 'dest',
      editor: 'hidden'
    },
    referrerAccountId: {
      id: 'referrerAccountId',
      editor: 'hidden'
    },
    hideTrackBtn: {
      id: 'hideTrackBtn',
      editor: 'hidden'
    }
  }

  return (
    <>
      <Card style={{ maxWidth: '420px', padding: '12px', backgroundColor: theme.appBGColor, marginBottom: '16px' }}>
        <SwapPoolTabs active={'buy'} />
      </Card>
      <AppBody>
        <AutoColumn gap="lg" justify="center">
          <RowBetween padding={'0 8px'}>
            <Text color={theme.textPrimary} fontWeight={500}>
              {t('buyEthereum')}
            </Text>
            <Question text={t('buyEthereumDescription')} />
          </RowBetween>
          <Form
            action="https://api.testwyre.com"
            apiKey={WYRE_API_KEY}
            fields={fields}
            render={() => (
              <React.Fragment>
                <Row>
                  <Field {...fields.firstName} />
                  <Field {...fields.lastName} />
                </Row>
                <Row>
                  <Field {...fields.email} />
                </Row>
                <InputPanel id="amountInput">
                  <Container>
                    <LabelRow>
                      <RowBetween>
                        <TYPE.body color={theme.textTertiary} fontWeight={500} fontSize={14}>
                          {t('amountOfEth')}
                        </TYPE.body>
                      </RowBetween>
                    </LabelRow>
                    <InputRow>
                      <>
                        <NumericalInput
                          style={{ backgroundColor: theme.appBoxBG, padding: '16px' }}
                          className="token-amount-input"
                          value={amount}
                          onUserInput={val => setAmount(val)}
                        />
                      </>
                    </InputRow>
                  </Container>
                </InputPanel>
                <Field {...fields.destAmount} value={amount} />
                <Field {...fields.sourceCurrency} value="USD" />
                <Field {...fields.destCurrency} value="ETH" />
                <Field {...fields.dest} value={ethDestination} />
                <Field {...fields.referrerAccountId} value="AC_9HZAUCRJH7T" />
                <Field {...fields.hideTrackBtn} value={true} />
                <Row>
                  {!account ? (
                    <ButtonLight onClick={toggleWalletModal}>{t('connectWallet')}</ButtonLight>
                  ) : (
                    <ButtonPrimary disabled={Boolean(disableBuy)} id="submit" style={{ padding: 16 }}>
                      <Text fontWeight={500} fontSize={20}>
                        {t('buyEthereum')}
                      </Text>
                    </ButtonPrimary>
                  )}
                </Row>
                {!account && (
                  <TYPE.body
                    color={theme.appInfoBoxTextColor}
                    style={{ padding: '12px', fontSize: '12px' }}
                    textAlign="center"
                  >
                    {t('walletConnectDisclaimer')}
                  </TYPE.body>
                )}
              </React.Fragment>
            )}
          />
        </AutoColumn>
      </AppBody>
      <AdvancedDetailsFooter show={showFootermodal}>
        <AutoColumn gap="md" style={{ padding: '0 24px' }}>
          <RowBetween>
            <RowFixed>
              <TYPE.black fontSize={16} fontWeight={600}>
                {t('buyTotal')}
              </TYPE.black>
              <QuestionHelper text={t('buyTotalDescription')} />
            </RowFixed>
            <TYPE.black fontSize={16} fontWeight={600}>
              ~{formatedTotal}
            </TYPE.black>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <TYPE.black fontSize={14} fontWeight={400}>
                {t('currentEthPrice')}
              </TYPE.black>
              <QuestionHelper text={t('priceDescription')} />
            </RowFixed>
            {formatedUsdPrice}
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <TYPE.black fontSize={14} fontWeight={400}>
                {t('buyFees')}
              </TYPE.black>
              <QuestionHelper text={t('buyFeesDescription')} />
            </RowFixed>
            {calculatedFees < 5 ? (
              <>{minFee}</>
            ) : (
              <>
                {formatedTransactionFee} ({transactionFee}%)
              </>
            )}
          </RowBetween>
        </AutoColumn>
      </AdvancedDetailsFooter>
    </>
  )
}
