import { ChainId, JSBI, Percent, Token, WETH } from '@uniswap/sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'

import { injected, walletconnect, walletlink } from '../connectors'

// LINKSWAP
export const ROUTER_ADDRESS = '0xA7eCe0911FE8C60bff9e99f8fAFcDBE56e07afF1'

// SCRT
export const SRCT_BRIDGE = '0xf4B00C937b4ec4Bb5AC051c3c719036c668a31EC'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const LINK = new Token(ChainId.MAINNET, '0x514910771AF9Ca656af840dff83E8264EcF986CA', 18, 'LINK', 'ChainLink')
export const YFL = new Token(ChainId.MAINNET, '0x28cb7e841ee97947a86B06fA4090C8451f64c0be', 18, 'YFL', 'YFLink')
export const YFLUSD = new Token(
  ChainId.MAINNET,
  '0x7b760D06E401f85545F3B50c44bf5B05308b7b62',
  18,
  'YFLUSD',
  'YFLink USD'
)
export const sYFL = new Token(
  ChainId.MAINNET,
  '0x8282df223AC402d04B2097d16f758Af4F70e7Db0',
  18,
  'sYFL',
  'YFLink Synthetic'
)
export const yYFL = new Token(ChainId.MAINNET, '0x75d1aa733920b14fc74c9f6e6fab7ac1ece8482e', 18, 'yYFL', 'Staked YFL')
export const WETHER = new Token(
  ChainId.MAINNET,
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  18,
  'WETH',
  'WrappedEther'
)
export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const COMP = new Token(ChainId.MAINNET, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound')
export const MKR = new Token(ChainId.MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')

export const BUSD = new Token(ChainId.MAINNET, '0x4Fabb145d64652a948d72533023f6E7A623C7C53', 18, 'BUSD', 'Binance USD')
export const DPI = new Token(
  ChainId.MAINNET,
  '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b',
  18,
  'DPI',
  'DefiPulse Index'
)
export const CEL = new Token(ChainId.MAINNET, '0xaaAEBE6Fe48E54f431b0C390CfaF0b017d09D42d', 4, 'CEL', 'Celsius')
export const MASQ = new Token(ChainId.MAINNET, '0x06F3C323f0238c72BF35011071f2b5B7F43A054c', 18, 'MASQ', 'MASQ')
export const YAX = new Token(ChainId.MAINNET, '0xb1dC9124c395c1e97773ab855d66E879f053A289', 18, 'YAX', 'yAxis')
export const SYAX = new Token(ChainId.MAINNET, '0xb1dC9124c395c1e97773ab855d66E879f053A289', 18, 'sYAX', 'staked yAxis')
export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC')
export const GSWAP = new Token(
  ChainId.MAINNET,
  '0xaac41EC512808d64625576EDdd580e7Ea40ef8B2',
  18,
  'GSWAP',
  'gameswap.org'
)
export const DOKI = new Token(
  ChainId.MAINNET,
  '0x9cEB84f92A0561fa3Cc4132aB9c0b76A59787544',
  18,
  'DOKI',
  'DokiDokiFinance'
)
export const SNX = new Token(
  ChainId.MAINNET,
  '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
  18,
  'SNX',
  'Synthetix Network'
)
export const CFI = new Token(ChainId.MAINNET, '0x63b4f3e3fa4e438698CE330e365E831F7cCD1eF4', 18, 'CFI', 'CyberFi Token')
export const AZUKI = new Token(
  ChainId.MAINNET,
  '0x910524678C0B1B23FFB9285a81f99C29C11CBaEd',
  18,
  'AZUKI',
  'DokiDokiAzuki'
)
export const DRC = new Token(ChainId.MAINNET, '0xb78B3320493a4EFaa1028130C5Ba26f0B6085Ef8', 18, 'DRC', 'Dracula Token')
export const BONK = new Token(ChainId.MAINNET, '0x6D6506E6F438edE269877a0A720026559110B7d5', 18, 'BONK', 'BONKTOKEN')
export const MFG = new Token(
  ChainId.MAINNET,
  '0x6710c63432A2De02954fc0f851db07146a6c0312',
  18,
  'MFG',
  'SyncFab Smart Manufacturing Blockchain'
)

export const aLINK = new Token(
  ChainId.MAINNET,
  '0xa64bd6c70cb9051f6a9ba1f163fdc07e0dfb5f84',
  18,
  'aLINK v1',
  'Aave Interest bearing LINK v1'
)

export const MPH = new Token(ChainId.MAINNET, '0x8888801af4d980682e47f1a9036e589479e835c5', 18, 'MPH', '88mph.app')

export const mphYALINKNFT = new Token(
  ChainId.MAINNET,
  '0xf0b7de03134857391d8d43ed48e20edf21461097',
  0,
  '88mph-yaLINK-Deposit',
  '88mph yaLINK Pool Deposit'
)

//renTokens
export const renDOGE = new Token(
  ChainId.MAINNET,
  '0x3832d2F059E55934220881F831bE501D180671A7',
  8,
  'renDOGE',
  'RenVM Dogecoin'
)
export const renFIL = new Token(
  ChainId.MAINNET,
  '0xD5147bc8e386d91Cc5DBE72099DAC6C9b99276F5',
  18,
  'renFIL',
  'RenVM Filecoin'
)
export const renBTC = new Token(
  ChainId.MAINNET,
  '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
  8,
  'renBTC',
  'RenVM Bitcoin'
)
export const renBCH = new Token(
  ChainId.MAINNET,
  '0x459086f2376525bdceba5bdda135e4e9d3fef5bf',
  8,
  'renBCH',
  'RenVM BitcoinCash'
)

export const renZEC = new Token(
  ChainId.MAINNET,
  '0x1c5db575e2ff833e46a2e9864c22f4b22e0b37c2',
  8,
  'renZEC',
  'RenVM Zcash'
)

export const renDGB = new Token(
  ChainId.MAINNET,
  '0xe3cb486f3f5c639e98ccbaf57d95369375687f80',
  8,
  'renDGB',
  'RenVM DigiByte'
)

export const renLUNA = new Token(
  ChainId.MAINNET,
  '0x52d87F22192131636F93c5AB18d0127Ea52CB641',
  6,
  'renLUNA',
  'RenVM Terra'
)

//secretTokens
export const secretETH = {
  address: 'secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw',
  decimals: 18,
  symbol: 'secretETH',
  name: 'Secret Ethereum',
  proxy: false
}

export const secretLINK = {
  address: 'secret1xcrf2vvxcz8dhtgzgsd0zmzlf9g320ea2rhdjw',
  decimals: 18,
  symbol: 'secretLINK',
  name: 'Secret ChainLink Token',
  proxy: false
}

export const secretYFL = {
  address: 'secret1jk0tw00vs23n8jwqdzrxtln6ww2a3k6em7s0p2',
  decimals: 18,
  symbol: 'secretYFL',
  name: 'Secret YFLink',
  proxy: false
}

export const secretSCRT = {
  address: 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek',
  decimals: 18,
  symbol: 'secretSCRT',
  name: 'Secret Secret Token',
  proxy: true
}

export const stETH = new Token(ChainId.MAINNET, '0xDFe66B14D37C77F4E9b180cEb433d1b164f0281D', 18, 'stETH', 'Staked ETH')

export const ibETH = new Token(
  ChainId.MAINNET,
  '0x67B66C99D3Eb37Fa76Aa3Ed1ff33E8e39F0b9c7A',
  18,
  'ibETH',
  'Interest Bearing ETH'
)

export const vUSDC = new Token(
  ChainId.MAINNET,
  '0x0C49066C0808Ee8c673553B7cbd99BCC9ABf113d',
  18,
  'vUSDC',
  'Vesper Finance USDC'
)

export const vETH = new Token(
  ChainId.MAINNET,
  '0x103cc17C2B1586e5Cd9BaD308690bCd0BBe54D5e',
  18,
  'vETH',
  'Vesper Finance ETH'
)

export const vBTC = new Token(
  ChainId.MAINNET,
  '0x4B2e76EbBc9f2923d83F5FBDe695D8733db1a17B',
  18,
  'vBTC',
  'Vesper Finance BTC'
)

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.GOERLI]: [WETH[ChainId.GOERLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET], LINK, YFLUSD, YFL]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [WETH[ChainId.MAINNET], LINK, YFLUSD]
  }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET], LINK, YFLUSD]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET], LINK, YFLUSD, vETH, vUSDC, stETH, ibETH, YFL]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [YFLUSD, WETHER],
    [YFLUSD, LINK],
    [sYFL, WETHER],
    [sYFL, LINK],
    [sYFL, YFLUSD],
    [YFL, WETHER],
    [YFL, YFLUSD],
    [LINK, WETHER],
    [LINK, YFL],
    [LINK, USDC],
    [DPI, LINK],
    [CEL, LINK],
    [MASQ, WETHER],
    [MASQ, LINK],
    [LINK, YAX],
    [YAX, WETHER],
    [LINK, GSWAP],
    [LINK, DOKI],
    [LINK, AZUKI],
    [DRC, WETHER],
    [renDOGE, WETHER],
    [renDOGE, LINK],
    [MPH, LINK],
    [renDGB, WETHER]
  ]
}

export const MARKETCAPS = {
  YFL: 47173
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
}

export const ACTIVE_REWARD_POOLS = [
  {
    address: '0xCac7092dE2D6aF9DFad327dc0EBEF4e099b2777e',
    rewardsAddress: '0xB74071fBdc9574981bf85f5abd7967e3d3C20387',
    abi: 'StakingRewards',
    type: 'default'
  },
  {
    address: '0x21dee38170F1e1F26baFf2C30C0fc8F8362b6961',
    rewardsAddress: '0x05C75D74197F44425059d71C4679E8Ae1D8F83f9',
    abi: 'StakingRewards',
    type: 'default'
  },
  {
    address: '0x195734d862DFb5380eeDa0ACD8acf697eA95D370',
    rewardsAddress: '0x6DddCc7F963C65b18FdDD842e6553528f014aDeA',
    abi: 'syflPool',
    type: 'syflPool'
  },
  {
    address: '0x6cD7817e6f3f52123df529E1eDF5830240Ce48c1',
    rewardsAddress: '0x61401c19200B2420f93Bb2EECF4BAA2C193d76e1',
    abi: 'syflPool',
    type: 'syflPool'
  },
  {
    address: '0x3315351F0B20595777a28054EF3d514bdC37463d',
    rewardsAddress: '0x81C76925E7F41f0306E1147c4659784d4402bD51',
    abi: 'syflPool',
    type: 'syflPool'
  },
  {
    address: '0x74C89f297b1dC87F927d9432a4eeea697E6f89a5',
    rewardsAddress: '0x1b650B522b864f6BF61705A05cc89b2b0e23f9C6',
    abi: 'syflPool',
    type: 'syflPool'
  },
  {
    address: '0x7e5A536F3d79791E283940ec379CEE10C9C40e86',
    rewardsAddress: '0x3bE07ed0239d46ca8435D4fb0bE96E43cD1c1796',
    abi: 'StakingRewards',
    type: 'default'
  },
  {
    address: '0x189A730921550314934019d184EC05726881D481',
    rewardsAddress: '0x35FC734948B36370c15387342F048aC87210bC22',
    abi: 'StakingRewards',
    type: 'default'
  },
  {
    address: '0xf36c9fc3c2aBE4132019444AfF914Fc8DC9785a9',
    rewardsAddress: '0x603065B7e2F69c897F154Ca429a2B96Cf4703f56',
    abi: 'StakingRewards',
    type: 'default'
  },
  {
    address: '0x639916bB4B29859FADF7A272185a3212157F8CE1',
    rewardsAddress: '0xfa9712cCc86c6BD52187125dCA4c2B9C7bAa3Ef8',
    abi: 'StakingRewards',
    type: 'default'
  },
  {
    address: '0xdef0CEF53E0D4c6A5E568c53EdCf45CeB33DBE46',
    rewardsAddress: '0x4e33D27CBCCe9Fe1c4a21A0f7C8b31C9CF5c0B75',
    abi: 'StakingRewards',
    type: 'default'
  },
  {
    address: '0x37CeE65899dA4B1738412814155540C98DFd752C',
    rewardsAddress: '0x790aDfE75706cf70191b2bD729048e42d8Ed9f60',
    abi: 'StakingRewards',
    type: 'default'
  },
  {
    address: '0xFe04c284a9725c141CF6de85D7E8452af1B48ab7',
    rewardsAddress: '0x017FAD4b7a54C1ACe95Ca614954e4D0d12CDb27E',
    abi: 'StakingRewards',
    type: 'default'
  },
  {
    address: '0xB7Cd446a2a80d4770C6bECde661B659cFC55acf5',
    rewardsAddress: '0xa74Ef3faB9E94578c79e0077f6Bd572C9efc8733',
    abi: 'StakingRewards',
    type: 'default'
  },
  {
    address: '0xbe755C548D585dbc4e3Fe4bcD712a32Fd81e5Ba0',
    rewardsAddress: '0x795BD26b99082E59478cfe8d9Cd207bb196808E4',
    abi: 'StakingRewards',
    type: 'default'
  },
  {
    address: '0x40F1068495Ba9921d6C18cF1aC25f718dF8cE69D',
    rewardsAddress: '0x0E6FA9f95a428F185752b60D38c62184854bB9e1',
    abi: 'StakingRewards',
    type: 'default'
  }
]

export const INACTIVE_REWARD_POOLS = [
  {
    address: '0x7e5A536F3d79791E283940ec379CEE10C9C40e86',
    rewardsAddress: '0x72368fB97dab2B94A5664EbeEbF504EF482fF149',
    abi: 'StakingRewards',
    type: 'default'
  },
  {
    address: '0x21dee38170F1e1F26baFf2C30C0fc8F8362b6961',
    rewardsAddress: '0xBfe0D843D3DA0953EcEf08Fc231033D4B140a085',
    abi: 'StakingRewards',
    type: 'default'
  }
]

export const MFGWETH_POOL = new Token(
  ChainId.MAINNET,
  '0x527d5f10d70cA41e1e0EEE8d30b553bB5271ee48',
  18,
  'UNI-V2',
  'Uniswap Liquidity Token'
)

export const UNI_POOLS = {
  MFGWETH: {
    liquidityToken: MFGWETH_POOL,
    rewardsAddress: '0xecAFcbe4Be14718890707133A4F928EB2871796D',
    tokens: [MFG, WETHER],
    balance: 0,
    liquidityUrl: 'https://app.uniswap.org/#/add/ETH/0x6710c63432A2De02954fc0f851db07146a6c0312',
    abi: 'StakingRewards',
    type: 'uni'
  }
}

export const SINGLE_POOLS: Record<string, any> = {
  GOV: {
    rewardsAddress: '0x75D1aA733920b14fC74c9F6e6faB7ac1EcE8482E',
    tokens: [YFL, WETHER],
    stakedToken: yYFL,
    balance: 0,
    abi: 'governancePool',
    type: 'gov'
  },
  MASQMASQ: {
    rewardsAddress: '0x75A43cFA0C104B021D4359B01a6dd611795e55c0',
    tokens: [MASQ, WETHER],
    stakedToken: MASQ,
    rewardsToken: MASQ,
    balance: 0,
    abi: 'singlePool',
    type: 'single'
  },
  ALINKV1: {
    rewardsAddress: '0x904f81eff3c35877865810cca9a63f2d9cb7d4dd',
    poolAddress: '0x904f81eff3c35877865810cca9a63f2d9cb7d4dd',
    tokens: [aLINK, WETHER],
    stakedToken: mphYALINKNFT,
    balance: 0,
    liquidityUrl:
      'https://app-v1.aave.com/deposit/LINK-0x514910771af9ca656af840dff83e8264ecf986ca0x24a42fd28c976a61df5d00d0599c34c4f90748c8',
    abi: 'mphPool',
    type: 'mph88'
  },
  YFLYFLUSD: {
    rewardsAddress: '0x5f35334ef7E38EBE1f94d31E6fC3d78b477f4f91',
    tokens: [YFL, WETHER],
    stakedToken: YFL,
    rewardsToken: YFLUSD,
    balance: 0,
    abi: 'singlePool',
    type: 'single'
  },
  LINKYFLUSD: {
    rewardsAddress: '0x4043D9BF3bC91893604c0281Dac857e6F24824a1',
    tokens: [LINK, WETHER],
    stakedToken: LINK,
    rewardsToken: YFLUSD,
    balance: 0,
    abi: 'singlePool',
    type: 'single'
  },
  BONKYFLUSD: {
    rewardsAddress: '0xA54550653b6F5D55CB8D258a3Ed7c653eb186cC0',
    tokens: [BONK, WETHER],
    stakedToken: BONK,
    rewardsToken: YFLUSD,
    balance: 0,
    abi: 'singlePool',
    type: 'single'
  },
  DOKIYFLUSD: {
    rewardsAddress: '0xFa60fFae050Edda279399209f3BBc0AC59327c88',
    tokens: [DOKI, WETHER],
    stakedToken: DOKI,
    rewardsToken: YFLUSD,
    balance: 0,
    abi: 'singlePool',
    type: 'single'
  },
  SYAXYFLUSD: {
    rewardsAddress: '0xEB94b4a6700F5b5DaDB9ecb2973bEACB71A17bCD',
    tokens: [SYAX, WETHER],
    stakedToken: SYAX,
    rewardsToken: YFLUSD,
    balance: 0,
    abi: 'singlePool',
    type: 'single'
  },
  SCRTLINK: {
    rewardsAddress: 'secret1wuzzjsdhthpvuyeeyhfq2ftsn3mvwf9rxy6ykw',
    tokens: [secretLINK, WETHER],
    stakedToken: secretLINK,
    rewardsToken: secretSCRT,
    balance: 0,
    abi: 'scrtPool',
    type: 'scrt'
  },
  SCRTYFL: {
    rewardsAddress: 'secret1ra9l5p04sc4pu8vc5djr3c9ds7npmwmzvsee32',
    tokens: [secretYFL, WETHER],
    stakedToken: secretYFL,
    rewardsToken: secretSCRT,
    balance: 0,
    abi: 'scrtPool',
    type: 'scrt'
  },
  SCRTETH: {
    rewardsAddress: 'secret1q6y7wz6pev80aadyjsejk5xr2yj4mkrj40zrvn',
    tokens: [secretETH, WETHER],
    stakedToken: secretETH,
    rewardsToken: secretSCRT,
    balance: 0,
    abi: 'scrtPool',
    type: 'scrt'
  }
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
