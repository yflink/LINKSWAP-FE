import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { parse } from 'qs'
import { AppDispatch } from '../state'
import { updateUserTheme } from '../state/user/actions'

export default function ThemeQueryParamReader({ location: { search } }: RouteComponentProps): null {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (!search) return
    if (search.length < 2) return

    const parsed = parse(search, {
      parseArrays: false,
      ignoreQueryPrefix: true
    })

    const theme = parsed.theme

    if (typeof theme !== 'string') return

    dispatch(updateUserTheme({ userTheme: theme.toLowerCase() }))
  }, [dispatch, search])

  return null
}
