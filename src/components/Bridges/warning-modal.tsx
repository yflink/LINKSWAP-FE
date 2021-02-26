import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '../Modal'
import { AutoColumn } from '../Column'
import { AutoRow, RowBetween } from '../Row'
import { TYPE } from '../../theme'
import { ButtonError } from '../Button'
import { AlertTriangle } from 'react-feather'
import styled from 'styled-components'

const WarningContainer = styled.div`
  max-width: 420px;
  width: 100%;
  padding: 1rem;
  background: rgba(242, 150, 2, 0.05);
  border: 1px solid #f3841e;
  border-radius: 6px;
  overflow: auto;
`

const StyledWarningIcon = styled(AlertTriangle)`
  stroke: ${({ theme }) => theme.red2};
`

export default function BridgeWarningModal({ isOpen, onConfirm }: { isOpen: boolean; onConfirm: () => void }) {
  const [understandChecked, setUnderstandChecked] = useState(false)
  const toggleUnderstand = useCallback(() => setUnderstandChecked(uc => !uc), [])
  const handleDismiss = useCallback(() => null, [])
  const { t } = useTranslation()

  return (
    <Modal isOpen={isOpen} onDismiss={handleDismiss} maxHeight={90}>
      <WarningContainer className="token-warning-container">
        <AutoColumn gap="lg">
          <AutoRow gap="6px">
            <StyledWarningIcon />
            <TYPE.main color={'red2'}>{t('bridgeWarning')}</TYPE.main>
          </AutoRow>
          <TYPE.body color={'red2'}>{t('bridgeDisclaimer')}</TYPE.body>
          <TYPE.body color={'red2'}>{t('bridgeAbout')}</TYPE.body>
          <TYPE.body color={'red2'}>
            <strong>{t('bridgeConclusion')}</strong>
          </TYPE.body>
          <RowBetween>
            <div>
              <label style={{ cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  className="understand-checkbox"
                  checked={understandChecked}
                  onChange={toggleUnderstand}
                />
                &nbsp;{t('iUnderstand')}
              </label>
            </div>
            <ButtonError
              disabled={!understandChecked}
              error={true}
              width={'140px'}
              padding="0.5rem 1rem"
              className="token-dismiss-button"
              style={{
                borderRadius: '10px'
              }}
              onClick={() => {
                onConfirm()
              }}
            >
              <TYPE.body color="white">{t('continue')}</TYPE.body>
            </ButtonError>
          </RowBetween>
        </AutoColumn>
      </WarningContainer>
    </Modal>
  )
}
