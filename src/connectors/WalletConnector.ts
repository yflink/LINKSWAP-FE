export interface IWallet {
  isInfoReading?: boolean
}

export class WalletConnector {
  public wallet: IWallet

  constructor(wallet: IWallet) {
    this.wallet = wallet
  }
}
