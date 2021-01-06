import { useWyreObjectManager } from '../state/price/hooks'
import { WYRE_API_KEY, WYRE_ID, WYRE_SK, WYRE_URL } from '../connectors'
import CryptoJS from 'crypto-js'

export function useWyreObject(amount: string, account: any, currencySymbol: string): void {
  const newPriceResponse = useWyreObjectManager()

  const getWyreObject = async () => {
    let returnValue: any

    try {
      if (!account || Number(amount) <= 0 || amount === '') {
        return false
      }
      const sk = WYRE_SK
      const details = {
        amount: amount,
        sourceCurrency: 'USD',
        destCurrency: currencySymbol,
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
      headers['X-Api-Signature'] = signature(url, JSON.stringify(details))
      const response = await fetch(url, {
        method: 'post',
        headers: headers,
        body: JSON.stringify(details)
      })
      const responseBody: any = await response.json()
      const priceObject: any = {}

      Object.keys(responseBody).forEach(function(key: string) {
        const fieldName = key.charAt(0).toLowerCase() + key.substring(1)
        priceObject[fieldName] = responseBody[key]
      })
      if (response.status !== 200) {
        returnValue = false
      } else {
        returnValue = priceObject
      }
      return returnValue
    } catch (error) {
      return false
    } finally {
      //console.log('fetch complete')
    }
  }

  getWyreObject().then(priceResponse => {
    newPriceResponse(priceResponse)
  })
}
