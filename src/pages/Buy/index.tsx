import React, { useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import Card from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import { useActiveWeb3React } from '../../hooks'
import AppBody from '../AppBody'
import { useTranslation, Trans } from 'react-i18next'
import Row, { RowBetween } from '../../components/Row'
import { Link, Text } from 'rebass'
import Question from '../../components/QuestionHelper'
import { Form, Fields, required, isEmail } from '../../components/Form'
import { Field } from '../../components/Field'
import { ButtonLight, ButtonPrimary } from '../../components/Button'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { TYPE } from '../../theme'
import { useWalletModalToggle } from '../../state/application/hooks'
import { WYRE_API_KEY, WYRE_ID, WYRE_URL } from '../../connectors'
import { useWyreObject } from '../../hooks/useWyreObject'
import { BuyFooter } from '../../components/Buy/footer'

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

const LimitHint = styled.div`
  width: 100%;
  padding: 0 0 12px;

  a {
    color: ${({ theme }) => theme.textHighlight};
    text-decoration: none;

    :hover,
    :focus {
      text-decoration: underline;
    }
  }
`

export default function Buy() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const [amount, setAmount] = useState('')
  const ethDestination = account ? 'ethereum:' + account : ''
  const { t } = useTranslation()
  useWyreObject(amount, account)
  const toggleWalletModal = useWalletModalToggle()
  const disableBuy = amount === '' || amount === '0.00'
  const showLimitHint = amount !== '' && amount !== '0.00' && Number(amount) > 500

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
    amount: {
      id: 'amount',
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
    },
    country: {
      id: 'country',
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
            action={WYRE_URL}
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
                          {t('amountOfUSD')}
                        </TYPE.body>
                      </RowBetween>
                    </LabelRow>
                    <InputRow>
                      <>
                        <NumericalInput
                          style={{ backgroundColor: theme.appBoxBG, padding: '16px' }}
                          className="token-amount-input"
                          placeholder="0.00"
                          value={amount}
                          onUserInput={val => setAmount(val)}
                        />
                      </>
                    </InputRow>
                  </Container>
                </InputPanel>
                {showLimitHint && (
                  <LimitHint>
                    <TYPE.body color={theme.textSecondary} fontWeight={400} fontSize={14}>
                      <Trans i18nKey="limitHint">
                        Your purchase might exceed the
                        <Link
                          href="https://support.sendwyre.com/en/articles/4457158-card-processing-faqs"
                          target="_blank"
                        >
                          weekly purchase limit
                        </Link>
                        of Wyre
                      </Trans>
                    </TYPE.body>
                  </LimitHint>
                )}
                <Field {...fields.amount} value={amount} />
                <Field {...fields.sourceCurrency} value="USD" />
                <Field {...fields.destCurrency} value="ETH" />
                <Field {...fields.dest} value={ethDestination} />
                <Field {...fields.referrerAccountId} value={WYRE_ID} />
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
                    style={{ padding: '12px 0', fontSize: '12px' }}
                    textAlign="center"
                  >
                    {t('walletConnectDisclaimer')}
                  </TYPE.body>
                )}
                <RowBetween>
                  <TYPE.body color={theme.appInfoBoxTextColor} style={{ padding: '12px 0 0', fontSize: '12px' }}>
                    {t('gdprDisclaimer')}
                  </TYPE.body>
                </RowBetween>
              </React.Fragment>
            )}
          />
        </AutoColumn>
      </AppBody>
      <BuyFooter />
    </>
  )
}
