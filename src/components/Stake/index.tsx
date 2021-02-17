import React from 'react'
import StakingCard from '../PositionCard/stakingCard'

interface StakePools {
  poolArray: any[]
  showOwn?: boolean | false
  showExpired?: boolean | false
}

export function StakePools({ poolArray, showOwn, showExpired }: StakePools) {
  const values: any[] = []

  poolArray.forEach((pool, index) => {
    values[index] = pool
  })
  return (
    <>
      {poolArray.map((stakingPool, index) => (
        <StakingCard
          type={values[index].type}
          values={values[index]}
          showOwn={showOwn}
          showExpired={showExpired}
          index={index}
          key={index}
        />
      ))}
    </>
  )
}
