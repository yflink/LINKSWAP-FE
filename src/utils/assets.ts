export enum Chain {
  Ethereum = 'Ethereum'
}

export const Chains = new Map<Chain, { symbol: Chain; name: string }>().set(Chain.Ethereum, {
  symbol: Chain.Ethereum,
  name: 'Ethereum'
})
export const defaultMintChain = Chain.Ethereum

export enum Asset {
  BTC = 'BTC',
  DOGE = 'DOGE'
}

export const Assets = new Map<Asset, { symbol: Asset; name: string }>()
  .set(Asset.DOGE, {
    symbol: Asset.BTC,
    name: 'Bitcoin'
  })
  .set(Asset.DOGE, {
    symbol: Asset.DOGE,
    name: 'Dogecoin'
  })

export const defaultAsset = Asset.DOGE
