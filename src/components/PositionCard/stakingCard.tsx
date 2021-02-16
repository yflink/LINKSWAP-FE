import React from 'react'
import FullStakingCard from '../PositionCard/fullStakingCard'
import SingleStakingCard from './singleStakingCard'

interface IStakingCard {
  type: string
  values: any[]
  my: boolean
  showOwn?: boolean | false
  showExpired?: boolean | false
  index: number
}

export default function StakingCard({ type, values, my, showOwn, showExpired, index }: IStakingCard) {
  return (
    <>
      {type === 'mph88' ? (
        <SingleStakingCard values={values} my={my} showOwn={showOwn} showExpired={showExpired} index={index} />
      ) : (
        <FullStakingCard values={values} my={my} showOwn={showOwn} showExpired={showExpired} index={index} />
      )}
    </>
  )
}
