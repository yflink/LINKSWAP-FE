import React from 'react'
import { ButtonSecondary } from '../Button'
import { useTranslation } from 'react-i18next'
import { Keplr } from '@keplr-wallet/types'
import { SigningCosmWasmClient } from 'secretjs'
import { useKeplrConnect } from '../../state/keplr/hooks'

export function getKeplrClient(address: string): SigningCosmWasmClient {
  const chainId = 'secret-2'
  const { getOfflineSigner, getEnigmaUtils } = window
  const offlineSigner = getOfflineSigner ? getOfflineSigner(chainId) : undefined
  const enigmaUtils = getEnigmaUtils ? getEnigmaUtils(chainId) : null

  return new SigningCosmWasmClient('https://lcd-secret.keplr.app/rest', address, offlineSigner, enigmaUtils)
}

export async function getKeplr(): Promise<Keplr | undefined> {
  const { keplr } = window
  if (keplr) {
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

  async function keplrWalletConnect() {
    const { keplr, getOfflineSigner } = window
    if (!keplr) {
      alert('Please install keplr extension')
    } else {
      const chainId = 'secret-2'
      await keplr.enable(chainId)
      const offlineSigner = getOfflineSigner ? getOfflineSigner(chainId) : undefined
      const accounts = offlineSigner ? await offlineSigner.getAccounts() : null

      newKeplrConnect(!!accounts, accounts[0].address)
    }
  }

  return <ButtonSecondary onClick={keplrWalletConnect}>{t('connectKeplrWallet')}</ButtonSecondary>
}
