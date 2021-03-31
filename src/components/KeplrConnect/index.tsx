import React from 'react'
import { ButtonSecondary } from '../Button'
import { useTranslation } from 'react-i18next'
import { Keplr } from '@keplr-wallet/types'
import { SigningCosmWasmClient } from 'secretjs'
import { useKeplrConnect } from '../../state/keplr/hooks'
import { sleep } from '../../utils/sleep'

const chainId = 'secret-2'

export function getKeplrClient(address: string): SigningCosmWasmClient {
  const { getOfflineSigner, getEnigmaUtils } = window
  const offlineSigner = getOfflineSigner ? getOfflineSigner(chainId) : undefined
  const enigmaUtils = getEnigmaUtils ? getEnigmaUtils(chainId) : null

  return new SigningCosmWasmClient('https://secret-lcd.azurefd.net', address, offlineSigner, enigmaUtils, {
    init: {
      amount: [{ amount: '300000', denom: 'uscrt' }],
      gas: '300000'
    },
    exec: {
      amount: [{ amount: '350000', denom: 'uscrt' }],
      gas: '350000'
    }
  })
}

export function getKeplrObject(): Keplr | undefined {
  const { keplr } = window
  if (keplr) {
    return keplr
  }

  if (document.readyState === 'complete') {
    return keplr
  }

  return undefined
}

export async function getKeplr(): Promise<Keplr | undefined> {
  const { keplr } = window

  if (keplr) {
    await keplr.enable(chainId)
    return keplr
  }

  if (document.readyState === 'complete') {
    return keplr
  }

  return new Promise(resolve => {
    const documentStateChange = (event: Event) => {
      if (event.target && (event.target as Document).readyState === 'complete') {
        resolve(keplr)
        document.removeEventListener('readystatechange', documentStateChange)
      }
    }

    document.addEventListener('readystatechange', documentStateChange)
  })
}

export default function KeplrConnect() {
  const { t } = useTranslation()
  const newKeplrConnect = useKeplrConnect()
  const { keplr, getOfflineSigner } = window
  let keplerInstalled = !!keplr

  async function keplrWalletConnect() {
    if (!keplr) {
      keplerInstalled = false
      alert('Please install keplr extension')
    } else {
      keplerInstalled = true
      const chainId = 'secret-2'
      await keplr.enable(chainId)
      const offlineSigner = getOfflineSigner ? getOfflineSigner(chainId) : undefined
      const accounts = offlineSigner ? await offlineSigner.getAccounts() : null

      newKeplrConnect(!!accounts, accounts[0].address)
    }
  }

  function installKeplr(e: any) {
    e.preventDefault()
    window.open('https://wallet.keplr.app/')
  }

  return (
    <>
      {keplerInstalled ? (
        <ButtonSecondary onClick={keplrWalletConnect}>{t('connectKeplrWallet')}</ButtonSecondary>
      ) : (
        <ButtonSecondary
          onClick={e => {
            installKeplr(e)
          }}
        >
          {t('installKeplr')}
        </ButtonSecondary>
      )}
    </>
  )
}

export async function getViewingKey(params: { keplr: any; chainId: string; address: string; currentBalance?: string }) {
  const { keplr, chainId, address, currentBalance } = params

  if (typeof currentBalance === 'string' && currentBalance.includes('Viewing Key Error')) {
    await sleep(1000)
  }

  let viewingKey = ''

  let tries = 0
  while (true) {
    tries += 1
    try {
      viewingKey = await keplr.getSecret20ViewingKey(chainId, address)
    } catch (error) {}
    if (viewingKey || tries === 3) {
      break
    }
    await sleep(100)
  }

  return viewingKey
}
