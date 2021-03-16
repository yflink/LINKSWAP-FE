import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AutoColumn } from '../Column'
import { numberToPercent, numberToUsd } from '../../utils/numberUtils'
import { RowBetween, RowFixed } from '../Row'
import { Text } from 'rebass'
import { ChevronDown, ChevronUp } from 'react-feather'
import { ButtonLight } from '../Button'
import { FixedHeightRow } from './index'
import styled from 'styled-components'
import Card from '../Card'
import { SCRTSVG } from '../SVG'
import { useWalletModalToggle } from '../../state/application/hooks'
const StakingCard = styled(Card)<{ highlight?: boolean; show?: boolean }>`
  font-size: 14px;
  line-height: 18px;
  background: ${({ theme }) => theme.appBoxBG};
  border: 1px solid ${({ theme, highlight }) => (highlight ? theme.textHighlight : theme.appBoxBG)};
  :hover {
    border: 1px solid
      ${({ theme, highlight, show }) => (highlight ? theme.textHighlight : show ? theme.appBoxBG : theme.textTertiary)};
  }
  position: relative;
`

const PlatformIcon = styled.div`
  position: absolute;
  opacity: 0.1;
  height: 40px;
  width: 40px;
  left: 230px;
  top: 12px;

  & svg {
    height: 40px;
    width: 40px;
    fill: ${({ theme }) => theme.textPrimary};
  }
`

const ExternalLink = styled.a`
  color: ${({ theme }) => theme.textPrimary};
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`

const ScrtTokenLogo = styled.img`
  width: 24px;
  height: 24px;
  margin-inline-end: 8px;
  display: inline-block;
`

export default function ScrtStakingCard({
  values,
  show,
  showOwn,
  showExpired
}: {
  values: any
  show?: boolean | false
  showOwn?: boolean | false
  showExpired?: boolean | true
  index: number
}) {
  const [showMore, setShowMore] = useState(show)
  const { t } = useTranslation()
  const headerRowStyles = show ? 'default' : 'pointer'
  const toggleWalletModal = useWalletModalToggle()

  return (
    <StakingCard highlight={false} show={show}>
      <PlatformIcon>
        <SCRTSVG />
      </PlatformIcon>
      <AutoColumn gap="12px">
        <FixedHeightRow
          onClick={() => {
            if (!show) {
              setShowMore(!showMore)
            }
          }}
          style={{ cursor: headerRowStyles, position: 'relative' }}
        >
          <div style={{ position: 'absolute', right: '-13px', top: '-16px', fontSize: '12px' }}>
            <p style={{ margin: 0 }}>{t('apy', { apy: numberToPercent(33) })}</p>
          </div>
          <RowFixed>
            <ScrtTokenLogo src="//logos.linkswap.app/scrt.png" />
            <div style={{ display: 'flex', position: 'relative' }}>
              <p style={{ fontWeight: 500, fontSize: 18, margin: '0 4px' }}>secretLINK</p>
            </div>
          </RowFixed>
          {!show && (
            <RowFixed>
              {showMore ? (
                <ChevronUp size="20" style={{ marginInlineStart: '10px' }} />
              ) : (
                <ChevronDown size="20" style={{ marginInlineStart: '10px' }} />
              )}
            </RowFixed>
          )}
        </FixedHeightRow>
        {showMore && (
          <AutoColumn gap="8px">
            <RowBetween marginTop="10px">
              <ButtonLight onClick={toggleWalletModal}>{t('connectKeplrWallet')}</ButtonLight>
            </RowBetween>
            <RowBetween>
              <Text style={{ margin: '12px 0 0' }} fontSize="16px" fontWeight={600}>
                {t('stakePoolStats')}
              </Text>
            </RowBetween>

            <RowBetween style={{ alignItems: 'flex-start' }}>
              <Text>{t('stakePoolTotalLiq')}</Text>
              <Text>{numberToUsd(9197829.42)}</Text>
            </RowBetween>
            <RowBetween style={{ alignItems: 'flex-start' }}>
              <Text>{t('stakePoolRewards')}</Text>
              <Text style={{ textAlign: 'end' }}>
                <div>
                  {t('stakeRewardPerDay', {
                    rate: 100,
                    currencySymbol: 'sSCRT'
                  })}
                </div>

                <div style={{ textAlign: 'end', marginTop: '8px' }}>{t('apy', { apy: numberToPercent(33) })}</div>
              </Text>
            </RowBetween>
          </AutoColumn>
        )}
      </AutoColumn>
    </StakingCard>
  )
}
