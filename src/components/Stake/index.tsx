import React from 'react'
import { FullStakingCard } from '../PositionCard'

interface PoolArrayProps {
  poolArray: any[]
  my: boolean
}

export function StakePools({ poolArray, my }: PoolArrayProps) {
  const values: any[] = []

  poolArray.forEach((pool, index) => {
    values[index] = pool
  })
  return (
    <>
      {poolArray.map((stakingPool, index) => (
        <FullStakingCard values={values[index]} my={my} key={index} />
      ))}
    </>
  )
}
