import React, { useCallback, useContext, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import Card from '../../components/Card'

import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import AppBody from '../AppBody'
import { useTranslation } from 'react-i18next'
import Row, { RowBetween } from '../../components/Row'
import { Text } from 'rebass'
import Question from '../../components/QuestionHelper'
import { Form } from '../../components/Form'
import { Field } from '../../components/Field'
import { ButtonPrimary } from '../../components/Button'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { TYPE } from '../../theme'

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

export default function Buy() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const [amount, setAmount] = useState('0.0')
  const { t } = useTranslation()

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
            action="http://localhost:4351/api/contactus"
            render={() => (
              <React.Fragment>
                <Row>
                  <Field id="fistName" style={{ paddingInlineEnd: 6 }} label={t('firstName')} />
                  <Field id="lastName" style={{ paddingInlineStart: 6 }} label={t('lastName')} />
                </Row>
                <Row>
                  <Field id="email" editor="email" label={t('email')} />
                </Row>
                <InputPanel id="amount">
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
                <Row>
                  <ButtonPrimary id="submit" style={{ padding: 16 }}>
                    <Text fontWeight={500} fontSize={20}>
                      {t('buyEthereum')}
                    </Text>
                  </ButtonPrimary>
                </Row>
              </React.Fragment>
            )}
          />
        </AutoColumn>
      </AppBody>
    </>
  )
}
