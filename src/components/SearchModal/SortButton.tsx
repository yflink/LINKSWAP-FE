import React from 'react'
import { Text } from 'rebass'
import styled from 'styled-components'
import { RowFixed } from '../Row'

export const FilterWrapper = styled(RowFixed)`
  padding: 8px;
  background: ${({ theme }) => theme.modalSecondaryBG};
  color: ${({ theme }) => theme.textPrimary};
  border-radius: ${({ theme }) => theme.borderRadius};
  user-select: none;
  & > * {
    user-select: none;
  }
  :hover {
    cursor: pointer;
  }
`

export default function SortButton({
  toggleSortOrder,
  ascending
}: {
  toggleSortOrder: () => void
  ascending: boolean
}) {
  return (
    <FilterWrapper onClick={toggleSortOrder}>
      <Text fontSize={14} fontWeight={500}>
        {ascending ? '↑' : '↓'}
      </Text>
    </FilterWrapper>
  )
}
