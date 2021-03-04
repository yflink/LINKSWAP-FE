import React from 'react'
import moment from 'moment'
import 'moment-duration-format'
import { useCountdown } from '../../hooks/useCountdown'
import { useTranslation } from 'react-i18next'

interface CountdownProps {
  ends: number
  format: string
  string: string
  endedString?: string
}
export default function Countdown({ ends, format, string, endedString }: CountdownProps) {
  const remaining = useCountdown(ends)
  const { t } = useTranslation()
  const duration = moment.duration(remaining, 'seconds')
  const options: moment.DurationFormatSettings = {
    forceLength: false,
    precision: 0,
    template: format,
    trim: false
  }

  let display = ends === 0 ? t('notStarted') : t(string, { time: duration.format(format, 0, options) })
  display = !!remaining && remaining >= 0 ? display : endedString ? t(endedString) : t('expired')
  return <span>{display}</span>
}
