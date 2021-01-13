import { useState, useEffect } from 'react'
import moment from 'moment'

export const useCountdown = (to: number): any => {
  const [val, setVal] = useState<any | null>(false)

  let then: any = null

  const calc = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    setVal(moment(then - moment()).unix())
  }

  useEffect(() => {
    // eslint-disable-next-line
    then = moment.unix(to)
    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [to])

  return val
}
