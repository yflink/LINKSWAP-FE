import React from 'react'
import StakingCard from '../PositionCard/stakingCard'

interface IStakePools {
  poolArray: any[]
  my: boolean
  showOwn?: boolean | false
  showExpired?: boolean | false
}

export function StakePools({ poolArray, my, showOwn, showExpired }: IStakePools) {
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
          my={my}
          showOwn={showOwn}
          showExpired={showExpired}
          index={index}
          key={index}
        />
      ))}
    </>
  )
}
