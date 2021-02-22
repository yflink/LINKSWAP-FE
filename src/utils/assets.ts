export enum Chain {
  Ethereum = 'Ethereum',
  Bitcoin = 'Bitcoin',
  Filecoin = 'Filecoin'
}

export const Chains = new Map<Chain, { symbol: Chain; name: string }>()
  .set(Chain.Ethereum, {
    symbol: Chain.Ethereum,
    name: 'Ethereum'
  })
  .set(Chain.Bitcoin, {
    symbol: Chain.Bitcoin,
    name: 'Bitcoin'
  })
  .set(Chain.Filecoin, {
    symbol: Chain.Filecoin,
    name: 'Filecoin'
  })
export const defaultMintChain = Chain.Ethereum

export enum Asset {
  FIL = 'FIL',
  BTC = 'BTC',
  BCH = 'BCH',
  ZEC = 'ZEC',
  DOGE = 'DOGE'
}

export const Assets = new Map<Asset, { symbol: Asset; name: string }>()
  .set(Asset.FIL, {
    symbol: Asset.FIL,
    name: 'Filecoin'
  })
  .set(Asset.BTC, {
    symbol: Asset.BTC,
    name: 'Bitcoin'
  })
  .set(Asset.BCH, {
    symbol: Asset.BCH,
    name: 'BitcoinCash'
  })
  .set(Asset.ZEC, {
    symbol: Asset.ZEC,
    name: 'ZCash'
  })
  .set(Asset.DOGE, {
    symbol: Asset.DOGE,
    name: 'Dogecoin'
  })

export const defaultAsset = Asset.DOGE
