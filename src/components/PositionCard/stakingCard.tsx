import React from 'react'
import FullStakingCard from '../PositionCard/fullStakingCard'
import SingleStakingCard from './singleStakingCard'

interface IStakingCard {
  type: string
  values: any[]
  showOwn?: boolean | false
  showExpired?: boolean | false
  index: number
}

export default function StakingCard({ type, values, showOwn, showExpired, index }: IStakingCard) {
  return (
    <>
      {type === 'mph88' || type === 'single' || type === 'gov' ? (
        <SingleStakingCard values={values} showOwn={showOwn} showExpired={showExpired} index={index} />
      ) : (
        <FullStakingCard values={values} showOwn={showOwn} showExpired={showExpired} index={index} />
      )}
    </>
  )
}
