import React, { useContext, useState } from 'react'
import { X } from 'react-feather'
import styled from 'styled-components'
import {
  useUserSlippageTolerance,
  useExpertModeManager,
  useUserDeadline,
  useRouteManager
} from '../../state/user/hooks'
import TransactionSettings from '../TransactionSettings'
import { RowFixed, RowBetween } from '../Row'
import { TYPE } from '../../theme'
import QuestionHelper from '../QuestionHelper'
import Toggle from '../Toggle'
import { ThemeContext } from 'styled-components'
import { AutoColumn } from '../Column'
import { ButtonError } from '../Button'
import { useToggleSettingsMenu } from '../../state/application/hooks'
import { Text } from 'rebass'
import Modal from '../Modal'
import { useTranslation } from 'react-i18next'

const StyledCloseIcon = styled(X)`
  height: 20px;
  width: 20px;
  :hover {
    cursor: pointer;
  }

  > * {
    stroke: ${({ theme }) => theme.textPrimary};
  }
`

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: start;
`

const Break = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.modalLines};
`

const ModalContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  background: ${({ theme }) => theme.modalSecondaryBG};
  border-radius: ${({ theme }) => theme.borderRadius};
`

export default function SettingsTab() {
  const toggle = useToggleSettingsMenu()

  const theme = useContext(ThemeContext)
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()

  const [deadline, setDeadline] = useUserDeadline()

  const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [route, toggleRoute] = useRouteManager()
  const [showConfirmation, setShowConfirmation] = useState(false)

  const { t } = useTranslation()

  return (
    <StyledMenu>
      <Modal isOpen={showConfirmation} onDismiss={() => setShowConfirmation(false)} maxHeight={100}>
        <ModalContentWrapper>
          <AutoColumn gap="8px">
            <RowBetween style={{ padding: '0 2rem' }}>
              <div />
              <Text fontWeight={500} fontSize={16}>
                {t('areYouSure')}
              </Text>
              <StyledCloseIcon onClick={() => setShowConfirmation(false)} />
            </RowBetween>
            <Break />
            <AutoColumn gap="lg" style={{ padding: '0 2rem' }}>
              <Text fontWeight={500} fontSize={16}>
                {t('expertModeDisclaimer')}
              </Text>
              <Text fontWeight={600} fontSize={16}>
                {t('useOnOwnBehalf')}
              </Text>
              <ButtonError
                error={true}
                padding={'12px'}
                onClick={() => {
                  if (window.prompt(`Please type the word "confirm" to enable expert mode.`) === 'confirm') {
                    toggleExpertMode()
                    setShowConfirmation(false)
                  }
                }}
              >
                <Text fontSize={16} fontWeight={500} id="confirm-expert-mode">
                  {t('expertModeOn')}
                </Text>
              </ButtonError>
            </AutoColumn>
          </AutoColumn>
        </ModalContentWrapper>
      </Modal>
      <AutoColumn gap="md">
        <Text fontWeight={600} fontSize={14}>
          {t('transactionSettings')}
        </Text>
        <TransactionSettings
          rawSlippage={userSlippageTolerance}
          setRawSlippage={setUserslippageTolerance}
          deadline={deadline}
          setDeadline={setDeadline}
        />
        <Text fontWeight={600} fontSize={14}>
          {t('interfaceSettings')}
        </Text>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontWeight={400} fontSize={14} color={theme.textSecondary}>
              {t('expertModeToggle')}
            </TYPE.black>
            <QuestionHelper text={t('expertModeAbout')} />
          </RowFixed>
          <Toggle
            id="toggle-expert-mode-button"
            isActive={expertMode}
            toggle={
              expertMode
                ? () => {
                    toggleExpertMode()
                    setShowConfirmation(false)
                  }
                : () => {
                    toggle()
                    setShowConfirmation(true)
                  }
            }
          />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontWeight={400} fontSize={14} color={theme.textSecondary}>
              {t('routeToggle')}
            </TYPE.black>
            <QuestionHelper text={t('routeAbout')} />
          </RowFixed>
          <Toggle id="toggle-route-button" isActive={route} toggle={() => toggleRoute()} />
        </RowBetween>
      </AutoColumn>
    </StyledMenu>
  )
}
