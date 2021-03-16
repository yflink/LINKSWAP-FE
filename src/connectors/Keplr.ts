import { SigningCosmWasmClient } from 'secretjs'
import { IWallet, WalletConnector } from './WalletConnector'
import { sleep } from '../utils/sleep'

export class KeplrConnector extends WalletConnector {
  public declare wallet: IWallet
  public keplrWallet: any
  public keplrOfflineSigner: any
  public secretjs: SigningCosmWasmClient
  public isKeplrWallet = false
  public error: string
  public sessionType: 'mathwallet' | 'ledger' | 'wallet'
  public address: string
  public balanceSCRT: string
  public balanceToken: { [key: string]: string } = {}
  public balanceTokenMin: { [key: string]: string } = {}
  public balanceRewards: { [key: string]: string } = {}
  public scrtRate = 0
  public ethRate = 0
  public snip20Address = ''
  public snip20Balance = ''
  public snip20BalanceMin = ''
  public isInfoReading = false
  public isInfoEarnReading = false
  public chainId: string

  constructor() {
    super()

    const keplrCheckPromise = new Promise<void>((accept, _reject) => {
      // 1. Every one second, check if Keplr was injected to the page
      const keplrCheckInterval = setInterval(async () => {
        this.isKeplrWallet =
          // @ts-ignore
          !!window.keplr &&
          // @ts-ignore
          !!window.getOfflineSigner &&
          // @ts-ignore
          !!window.getEnigmaUtils
        // @ts-ignore
        this.keplrWallet = window.keplr

        if (this.isKeplrWallet) {
          // Keplr is present, stop checking
          clearInterval(keplrCheckInterval)
          accept()
        }
      }, 1000)
    })

    const session = localStorage.getItem('keplr_session')

    const sessionObj = JSON.parse(session)

    if (sessionObj) {
      this.address = sessionObj.address
      this.isInfoReading = sessionObj.isInfoReading
      this.isInfoEarnReading = sessionObj.isInfoEarnReading
      keplrCheckPromise.then(async () => {
        await this.signIn()
      })
    }
  }

  public setInfoReading() {
    this.isInfoReading = true
    this.syncLocalStorage()
  }

  public setInfoEarnReading() {
    this.isInfoEarnReading = true
    this.syncLocalStorage()
  }

  public async signIn(wait?: boolean) {
    this.error = ''

    console.log('Waiting for Keplr...')
    while (wait && !this.keplrWallet) {
      await sleep(100)
    }
    console.log('Found Keplr')

    this.chainId = 'secret-2'
    try {
      // Setup Secret Testnet (not needed on mainnet)
      if (process.env.ENV !== 'MAINNET') {
        await this.keplrWallet.experimentalSuggestChain({
          chainId: this.chainId,
          chainName: 'Secret Network',
          rpc: 'http://rpc.enigma.co:26657',
          rest: 'https://secret-lcd.azurefd.net',
          bip44: {
            coinType: 529
          },
          coinType: 529,
          stakeCurrency: {
            coinDenom: 'SCRT',
            coinMinimalDenom: 'uscrt',
            coinDecimals: 6
          },
          bech32Config: {
            bech32PrefixAccAddr: 'secret',
            bech32PrefixAccPub: 'secretpub',
            bech32PrefixValAddr: 'secretvaloper',
            bech32PrefixValPub: 'secretvaloperpub',
            bech32PrefixConsAddr: 'secretvalcons',
            bech32PrefixConsPub: 'secretvalconspub'
          },
          currencies: [
            {
              coinDenom: 'SCRT',
              coinMinimalDenom: 'uscrt',
              coinDecimals: 6
            }
          ],
          feeCurrencies: [
            {
              coinDenom: 'SCRT',
              coinMinimalDenom: 'uscrt',
              coinDecimals: 6
            }
          ],
          gasPriceStep: {
            low: 0.1,
            average: 0.25,
            high: 0.4
          },
          features: ['secretwasm']
        })
      }

      // Ask the user for permission
      await this.keplrWallet.enable(this.chainId)

      // @ts-ignore
      this.keplrOfflineSigner = window.getOfflineSigner(this.chainId)
      const accounts = await this.keplrOfflineSigner.getAccounts()
      this.address = accounts[0].address
      this.isAuthorized = true

      this.secretjs = new SigningCosmWasmClient(
        process.env.SECRET_LCD,
        this.address,
        this.keplrOfflineSigner,
        // @ts-ignore
        window.getEnigmaUtils(this.chainId),
        {
          init: {
            amount: [{ amount: '300000', denom: 'uscrt' }],
            gas: '300000'
          },
          exec: {
            amount: [{ amount: '350000', denom: 'uscrt' }],
            gas: '350000'
          }
        }
      )

      this.syncLocalStorage()
    } catch (error) {
      this.error = error.message
      this.isAuthorized = false
      console.error('keplr login error', error)
    }
  }

  @action public getSnip20Balance = async (snip20Address: string, decimals?: string | number): Promise<string> => {
    if (!this.secretjs) {
      return '0'
    }

    const viewingKey = await getViewingKey({
      keplr: this.keplrWallet,
      chainId: this.chainId,
      address: snip20Address
    })

    if (!viewingKey) {
      return unlockToken
    }

    const rawBalance = await Snip20GetBalance({
      secretjs: this.secretjs,
      token: snip20Address,
      address: this.address,
      key: viewingKey
    })

    if (isNaN(Number(rawBalance))) {
      return fixUnlockToken
    }

    if (decimals) {
      const decimalsNum = Number(decimals)
      return divDecimals(rawBalance, decimalsNum)
    }

    return rawBalance
  }

  @action public getBridgeRewardsBalance = async (snip20Address: string): Promise<string> => {
    if (!this.secretjs) {
      return '0'
    }

    const height = await this.secretjs.getHeight()

    const viewingKey = await getViewingKey({
      keplr: this.keplrWallet,
      chainId: this.chainId,
      address: snip20Address
    })

    return await QueryRewards({
      cosmJS: this.secretjs,
      contract: snip20Address,
      address: this.address,
      key: viewingKey,
      height: String(height)
    })
  }

  @action public getBridgeDepositBalance = async (snip20Address: string): Promise<string> => {
    if (!this.secretjs) {
      return '0'
    }

    const viewingKey = await getViewingKey({
      keplr: this.keplrWallet,
      chainId: this.chainId,
      address: snip20Address
    })

    return await QueryDeposit({
      cosmJS: this.secretjs,
      contract: snip20Address,
      address: this.address,
      key: viewingKey
    })
  }

  @action public getBalances = async () => {
    await Promise.all([this.updateBalanceForSymbol('SCRT'), this.updateBalanceForSymbol('sSCRT')])
  }

  @action public updateScrtBalance = async () => {
    this.secretjs.getAccount(this.address).then(account => {
      try {
        this.balanceSCRT = formatWithSixDecimals(divDecimals(account.balance[0].amount, 6))
      } catch (e) {
        this.balanceSCRT = '0'
      }
    })
    return
  }

  @action public updateSScrtBalance = async () => {
    try {
      const balance = await this.getSnip20Balance(process.env.SSCRT_CONTRACT, 6)
      this.balanceToken['sSCRT'] = balance
    } catch (err) {
      this.balanceToken['sSCRT'] = unlockToken
    }

    const token = this.stores.tokens.allData.find(t => t.display_props.symbol === 'SSCRT')

    if (!token) {
      return
    }

    try {
      this.balanceTokenMin['sSCRT'] = token.display_props.min_from_scrt
    } catch (e) {
      console.log(`unknown error: ${e}`)
    }
    return
  }

  @action public updateBalanceForRewardsToken = async (tokenAddress: string) => {
    while (!this.address && !this.secretjs && this.stores.tokens.isPending) {
      await sleep(100)
    }
  }

  @action public updateBalanceForSymbol = async (symbol: string) => {
    while (!this.address && !this.secretjs && this.stores.tokens.allData.length === 0) {
      await sleep(100)
    }

    if (!symbol) {
      return
    } else if (symbol === 'SCRT') {
      await this.updateScrtBalance()
    } else if (symbol === 'sSCRT') {
      await this.updateSScrtBalance()
    }

    await this.refreshTokenBalance(symbol)

    //await this.refreshRewardsBalances(symbol);
  }

  private async refreshTokenBalance(symbol: string) {
    const token = this.stores.tokens.allData.find(t => t.display_props.symbol === symbol)

    if (!token) {
      return
    }

    try {
      const balance = await this.getSnip20Balance(token.dst_address, token.decimals)
      this.balanceToken[token.src_coin] = balance
    } catch (err) {
      this.balanceToken[token.src_coin] = unlockToken
    }

    try {
      this.balanceTokenMin[token.src_coin] = token.display_props.min_from_scrt
    } catch (e) {
      console.log(`unknown error: ${e}`)
    }
  }

  async refreshRewardsBalances(symbol: string) {
    const rewardsToken = this.stores.rewards.allData.find(t => t.inc_token.symbol === `s${symbol}`)
    if (!rewardsToken) {
      console.log('No rewards token for', symbol)
      return
    }

    try {
      const balance = await this.getBridgeRewardsBalance(rewardsToken.pool_address)

      if (balance.includes(unlockToken)) {
        this.balanceRewards[rewardsKey(rewardsToken.inc_token.symbol)] = balance
      } else {
        // rewards are in the rewards_token decimals
        this.balanceRewards[rewardsKey(rewardsToken.inc_token.symbol)] = divDecimals(
          balance,
          rewardsToken.rewards_token.decimals
        ) //divDecimals(balance, token.inc_token.decimals);
      }
    } catch (err) {
      this.balanceRewards[rewardsKey(rewardsToken.inc_token.symbol)] = unlockToken
    }

    try {
      const balance = await this.getBridgeDepositBalance(rewardsToken.pool_address)

      if (balance.includes(unlockToken)) {
        this.balanceRewards[rewardsDepositKey(rewardsToken.inc_token.symbol)] = balance
      } else {
        this.balanceRewards[rewardsDepositKey(rewardsToken.inc_token.symbol)] = divDecimals(
          balance,
          rewardsToken.inc_token.decimals
        )
      }
    } catch (err) {
      this.balanceRewards[rewardsDepositKey(rewardsToken.inc_token.symbol)] = unlockToken
    }

    try {
      const balance = await this.getSnip20Balance(
        rewardsToken.rewards_token.address,
        rewardsToken.rewards_token.decimals
      )

      if (balance.includes(unlockToken)) {
        this.balanceRewards[rewardsToken.rewards_token.symbol] = balance
      } else {
        this.balanceRewards[rewardsToken.rewards_token.symbol] = divDecimals(
          balance,
          rewardsToken.rewards_token.decimals
        )
      }
    } catch (err) {
      this.balanceRewards[rewardsToken.rewards_token.symbol] = unlockToken
    }
  }

  @action public signOut() {
    this.isAuthorized = false
    this.address = null
    this.syncLocalStorage()
  }

  private syncLocalStorage() {
    localStorage.setItem(
      'keplr_session',
      JSON.stringify({
        address: this.address,
        isInfoReading: this.isInfoReading,
        isInfoEarnReading: this.isInfoEarnReading
      })
    )
  }

  @action public signTransaction(txn: any) {
    /*  if (this.sessionType === 'mathwallet' && this.isKeplrWallet) {
      return this.keplrWallet.signTransaction(txn);
    } */
  }

  public saveRedirectUrl(url: string) {
    if (!this.isAuthorized && url) {
      this.redirectUrl = url
    }
  }

  @action public async getRates() {
    const scrtbtc = await agent.get<{ body: IOperation }>('https://api.binance.com/api/v1/ticker/24hr?symbol=SCRTBTC')
    const btcusdt = await agent.get<{ body: IOperation }>('https://api.binance.com/api/v1/ticker/24hr?symbol=BTCUSDT')

    this.scrtRate = scrtbtc.body.lastPrice * btcusdt.body.lastPrice

    const ethusdt = await agent.get<{ body: IOperation }>('https://api.binance.com/api/v1/ticker/24hr?symbol=ETHUSDT')

    this.ethRate = ethusdt.body.lastPrice
  }
}
