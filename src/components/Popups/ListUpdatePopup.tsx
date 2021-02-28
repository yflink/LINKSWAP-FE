import { diffTokenLists, TokenList } from '@uniswap/token-lists'
import React, { useCallback, useMemo } from 'react'
import ReactGA from 'react-ga'
import { useDispatch } from 'react-redux'
import { Text } from 'rebass'
import { AppDispatch } from '../../state'
import { useRemovePopup } from '../../state/application/hooks'
import { acceptListUpdate } from '../../state/lists/actions'
import { TYPE } from '../../theme'
import listVersionLabel from '../../utils/listVersionLabel'
import { ButtonSecondary } from '../Button'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'
import { useTranslation } from 'react-i18next'

export default function ListUpdatePopup({
  popKey,
  listUrl,
  oldList,
  newList,
  auto
}: {
  popKey: string
  listUrl: string
  oldList: TokenList
  newList: TokenList
  auto: boolean
}) {
  const removePopup = useRemovePopup()
  const removeThisPopup = useCallback(() => removePopup(popKey), [popKey, removePopup])
  const dispatch = useDispatch<AppDispatch>()

  const handleAcceptUpdate = useCallback(() => {
    if (auto) return
    ReactGA.event({
      category: 'Lists',
      action: 'Update List from Popup',
      label: listUrl
    })
    dispatch(acceptListUpdate(listUrl))
    removeThisPopup()
  }, [auto, dispatch, listUrl, removeThisPopup])

  const { added: tokensAdded, changed: tokensChanged, removed: tokensRemoved } = useMemo(() => {
    return diffTokenLists(oldList.tokens, newList.tokens)
  }, [newList.tokens, oldList.tokens])
  const numTokensChanged = useMemo(
    () =>
      Object.keys(tokensChanged).reduce((memo, chainId: any) => memo + Object.keys(tokensChanged[chainId]).length, 0),
    [tokensChanged]
  )

  const { t } = useTranslation()

  return (
    <AutoRow>
      <AutoColumn style={{ flex: '1' }} gap="8px">
        {auto ? (
          <TYPE.body fontWeight={500}>
            {t('oldListUpdate', { listName: oldList.name, version: listVersionLabel(newList.version) })}
          </TYPE.body>
        ) : (
          <>
            <div>
              <Text>
                {t('listUpdate', {
                  listName: oldList.name,
                  oldListVersion: listVersionLabel(oldList.version),
                  newListVersion: listVersionLabel(newList.version)
                })}
              </Text>
              <ul>
                {tokensAdded.length > 0 ? (
                  <li>
                    {t('tokensAdded')}&nbsp;
                    {tokensAdded.map((token, i) => (
                      <React.Fragment key={`${token.chainId}-${token.address}`}>
                        <strong title={token.address}>{token.symbol}</strong>
                        {i === tokensAdded.length - 1 ? null : ', '}
                      </React.Fragment>
                    ))}
                  </li>
                ) : null}
                {tokensRemoved.length > 0 ? (
                  <li>
                    {t('tokensRemoved')}&nbsp;
                    {tokensRemoved.map((token, i) => (
                      <React.Fragment key={`${token.chainId}-${token.address}`}>
                        <strong title={token.address}>{token.symbol}</strong>
                        {i === tokensRemoved.length - 1 ? null : ', '}
                      </React.Fragment>
                    ))}
                  </li>
                ) : null}
                {numTokensChanged > 0 ? <li>{t('tokensUpdated', { tokenCount: numTokensChanged })}</li> : null}
              </ul>
            </div>
            <AutoRow>
              <div style={{ flexGrow: 1, marginInlineEnd: 12 }}>
                <ButtonSecondary onClick={handleAcceptUpdate}>{t('acceptUpdate')}</ButtonSecondary>
              </div>
              <div style={{ flexGrow: 1 }}>
                <ButtonSecondary onClick={removeThisPopup}>{t('dismiss')}</ButtonSecondary>
              </div>
            </AutoRow>
          </>
        )}
      </AutoColumn>
    </AutoRow>
  )
}
