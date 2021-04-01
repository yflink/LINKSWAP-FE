import styled from 'styled-components'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'

export const ModalInfo = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 1rem 1rem;
  margin: 0.25rem 0.5rem;
  justify-content: center;
  flex: 1;
  user-select: none;
`

export const FadedSpan = styled(RowFixed)`
  color: ${({ theme }) => theme.textHighlight};
  font-size: 14px;
`

export const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
  padding-bottom: 12px;
`

export const MenuItem = styled(RowBetween)`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
  grid-gap: 16px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  align-items: center;
  pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
    background: ${({ theme, disabled }) => !disabled && theme.modalSecondaryBG};
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};
  [dir='rtl'] & {
    direction: rtl;
  }
`

export const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: transparent;
  border: none;
  outline: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  color: ${({ theme }) => theme.textPrimary};
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.modalInputBorder};
  -webkit-appearance: none;

  font-size: 18px;

  ::placeholder {
    color: ${({ theme }) => theme.textTertiary};
  }
  transition: border 100ms;
  :focus {
    border: 1px solid ${({ theme }) => theme.modalInputBorderFocus};
    outline: none;
  }
`
export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.modalLines};
`

export const SeparatorDark = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.buttonBG};
`
