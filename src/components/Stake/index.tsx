import React from 'react'
import FullStakingCard from '../PositionCard/stakingCard'

interface PoolArrayProps {
  poolArray: any[]
  my: boolean
  showOwn?: boolean | false
  showExpired?: boolean | false
}

export function StakePools({ poolArray, my, showOwn, showExpired }: PoolArrayProps) {
  const values: any[] = []

  poolArray.forEach((pool, index) => {
    values[index] = pool
  })
  return (
    <>
      {poolArray.map((stakingPool, index) => (
        <FullStakingCard values={values[index]} my={my} showOwn={showOwn} showExpired={showExpired} key={index} />
      ))}
    </>
  )
}
