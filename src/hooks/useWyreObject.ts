import { useWyreObjectManager } from '../state/price/hooks'
import { WYRE_API_KEY, WYRE_ID, WYRE_SK, WYRE_URL } from '../connectors'
import CryptoJS from 'crypto-js'

export function useWyreObject(amount: string, account: any): void {
  const newPriceResponse = useWyreObjectManager()

  const getWyreObject = async () => {
    const fakeObject = {
      sourceCurrency: 'USD',
      sourceAmount: 5.95,
      destCurrency: 'ETH',
      destAmount: 0.009880239520958084,
      exchangeRate: 0.001976047904191616838,
      equivalencies: {
        CAD: 4.95,
        USDC: 0.00992,
        BTC: 0.00040198,
        ETH: 0.009880239520958084,
        GBP: 4.95,
        DAI: 4.154151233875968493,
        AUD: 3.87,
        EUR: 4.95,
        WETH: 0.009880239520958084,
        USD: 4.95,
        MXN: 4.95
      },
      fees: {
        ETH: 0.001,
        USD: 0.45
      }
    }

    let returnValue: any

    try {
      if (!account || Number(amount) <= 0 || amount === '') {
        return false
      }
      const sk = WYRE_SK
      const details = {
        amount: amount,
        sourceCurrency: 'USD',
        destCurrency: 'ETH',
        dest: 'ethereum:' + account,
        accountId: WYRE_ID,
        country: 'US'
      }
      const timestamp = new Date().getTime()
      const url = `${WYRE_URL}/v3/orders/quote/partner?timestamp=${timestamp}`
      const signature = (url: string, data: string) => {
        const dataToBeSigned = url + data
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const token = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(dataToBeSigned.toString(CryptoJS.enc.Utf8), sk))
        return token
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const headers = {}
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      headers['Content-Type'] = 'application/json'
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      headers['X-Api-Key'] = WYRE_API_KEY
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      headers['X-Api-Signature'] = signature(url, details)
      const response = await fetch(url, {
        method: 'post',
        headers: headers,
        body: JSON.stringify(details)
      })
      const responseBody: any = await response.json()
      const priceObject: any = {}
      Object.keys(responseBody).map((key: string) => {
        const fieldName = key.charAt(0).toLowerCase() + key.substring(1)
        priceObject[fieldName] = responseBody[key]
      })
      if (response.status !== 200) {
        console.log('error', priceObject)
        returnValue = fakeObject
      } else {
        returnValue = priceObject
      }
    } catch (error) {
      returnValue = fakeObject
    } finally {
      const finalReturn = returnValue
      return finalReturn
    }
  }

  getWyreObject().then(priceResponse => {
    newPriceResponse(priceResponse)
  })
}
