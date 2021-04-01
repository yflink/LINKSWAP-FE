import React from 'react'
import FullStakingCard from './fullStakingCard'
import SingleStakingCard from './singleStakingCard'
import ScrtStakingCard from './scrtStakingCard'

interface StakingCardInterface {
  type: string
  values: any[]
  showOwn?: boolean | false
  showExpired?: boolean | false
  index: number
}

export default function StakingCard({ type, values, showOwn, showExpired, index }: StakingCardInterface) {
  return (
    <>
      {type === 'mph88' || type === 'single' || type === 'gov' ? (
        <SingleStakingCard values={values} showOwn={showOwn} showExpired={showExpired} index={index} />
      ) : (
        <>
          {type === 'scrt' ? (
            <ScrtStakingCard values={values} index={index} />
          ) : (
            <FullStakingCard values={values} showOwn={showOwn} showExpired={showExpired} index={index} />
          )}
        </>
      )}
    </>
  )
}
