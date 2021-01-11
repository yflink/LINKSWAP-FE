import { ChainId, JSBI, Percent, Token, WETH } from '@uniswap/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'

import { injected, walletconnect, walletlink } from '../connectors'

// LINKSWAP
export const ROUTER_ADDRESS = '0xA7eCe0911FE8C60bff9e99f8fAFcDBE56e07afF1'
// UNISWAP
// export const ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const LINK = new Token(ChainId.MAINNET, '0x514910771af9ca656af840dff83e8264ecf986ca', 18, 'LINK', 'ChainLink')
export const YFL = new Token(ChainId.MAINNET, '0x28cb7e841ee97947a86b06fa4090c8451f64c0be', 18, 'YFL', 'YFLink')
export const WETHER = new Token(
  ChainId.MAINNET,
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  18,
  'WETH',
  'WrappedEther'
)
export const DAI = new Token(ChainId.MAINNET, '0x6b175474e89094c44da98b954eedeac495271d0f', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 6, 'USDC', 'USD//C')
export const USDT = new Token(ChainId.MAINNET, '0xdac17f958d2ee523a2206206994597c13d831ec7', 6, 'USDT', 'Tether USD')
export const COMP = new Token(ChainId.MAINNET, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound')
export const MKR = new Token(ChainId.MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')

export const BUSD = new Token(ChainId.MAINNET, '0x4fabb145d64652a948d72533023f6e7a623c7c53', 18, 'BUSD', 'Binance USD')
export const DPI = new Token(
  ChainId.MAINNET,
  '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b',
  18,
  'DPI',
  'DefiPulse Index'
)
export const CEL = new Token(ChainId.MAINNET, '0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d', 4, 'CEL', 'Celsius')
export const MASQ = new Token(ChainId.MAINNET, '0x06f3c323f0238c72bf35011071f2b5b7f43a054c', 18, 'MASQ', 'MASQ')
export const YAX = new Token(ChainId.MAINNET, '0xb1dc9124c395c1e97773ab855d66e879f053a289', 18, 'YAX', 'yAxis')
export const WBTC = new Token(ChainId.MAINNET, '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', 8, 'WBTC', 'Wrapped BTC')
export const GSWAP = new Token(
  ChainId.MAINNET,
  '0xaac41ec512808d64625576eddd580e7ea40ef8b2',
  18,
  'GSWAP',
  'gameswap.org'
)
export const DOKI = new Token(
  ChainId.MAINNET,
  '0x9ceb84f92a0561fa3cc4132ab9c0b76a59787544',
  18,
  'DOKI',
  'DokiDokiFinance'
)
export const SNX = new Token(
  ChainId.MAINNET,
  '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
  18,
  'SNX',
  'Synthetix Network'
)
export const CFI = new Token(ChainId.MAINNET, '0x63b4f3e3fa4e438698ce330e365e831f7ccd1ef4', 18, 'CFI', 'CyberFi Token')
export const AZUKI = new Token(
  ChainId.MAINNET,
  '0x910524678c0b1b23ffb9285a81f99c29c11cbaed',
  18,
  'AZUKI',
  'DokiDokiAzuki'
)
export const DRC = new Token(ChainId.MAINNET, '0xb78b3320493a4efaa1028130c5ba26f0b6085ef8', 18, 'DRC', 'Dracula Token')
export const BONK = new Token(ChainId.MAINNET, '0x6d6506e6f438ede269877a0a720026559110b7d5', 18, 'BONK', 'BONKTOKEN')

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, COMP, MKR]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
  }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], LINK]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [YFL, WETHER],
    [LINK, YFL],
    [LINK, USDC],
    [USDC, WETHER],
    [BUSD, LINK],
    [DPI, LINK],
    [CEL, LINK],
    [MASQ, WETHER],
    [LINK, YAX],
    [WBTC, LINK],
    [LINK, GSWAP],
    [LINK, DOKI],
    [LINK, SNX],
    [LINK, CFI],
    [LINK, AZUKI],
    [DRC, WETHER],
    [BONK, WETHER]
  ]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  }
  // COINBASE_LINK: {
  //   name: 'Open in Coinbase Wallet',
  //   iconName: 'coinbaseWalletIcon.svg',
  //   description: 'Open in Coinbase Wallet app.',
  //   href: 'https://go.cb-w.com/mtUDhEZPy1',
  //   color: '#315CF5',
  //   mobile: true,
  //   mobileOnly: true
  // },
  // FORTMATIC: {
  //   connector: fortmatic,
  //   name: 'Fortmatic',
  //   iconName: 'fortmaticIcon.png',
  //   description: 'Login using Fortmatic hosted wallet',
  //   href: null,
  //   color: '#6748FF',
  //   mobile: true
  // },
  // Portis: {
  //   connector: portis,
  //   name: 'Portis',
  //   iconName: 'portisIcon.png',
  //   description: 'Login using Portis hosted wallet',
  //   href: null,
  //   color: '#4A6C9B',
  //   mobile: true
  // }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))
