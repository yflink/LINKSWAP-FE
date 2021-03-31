import React from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'react-feather'
import styled from 'styled-components'
import { transparentize } from 'polished'

export const FormErrorInner = styled.div`
  background: ${({ theme }) => transparentize(0.9, theme.red1)};
  border-radius: 1rem;
  display: flex;
  align-items: center;
  font-size: 0.825rem;
  width: 100%;
  padding: 1rem 1.25rem 1rem 1rem;
  color: ${({ theme }) => theme.red1};
  p {
    padding: 0;
    margin: 0;
    font-weight: 500;
  }
`

export const FormErrorInnerAlertTriangle = styled.div`
  background: ${({ theme }) => transparentize(0.9, theme.red1)};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-inline-end: 12px;
  border-radius: ${({ theme }) => theme.borderRadius};
  min-width: 48px;
  height: 48px;
`

function ErrorBody({ error }: { error: string }) {
  return (
    <FormErrorInner>
      <FormErrorInnerAlertTriangle>
        <AlertTriangle size={24} />
      </FormErrorInnerAlertTriangle>
      <p>{error}</p>
    </FormErrorInner>
  )
}

export function FormError({ error }: { error: string }) {
  const { t } = useTranslation()
  return <ErrorBody error={t(error)} />
}
