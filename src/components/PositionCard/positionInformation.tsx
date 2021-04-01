import { unwrappedToken } from '../../utils/wrappedCurrency'
import { getNetworkLibrary } from '../../connectors'
import hexStringToNumber from '../../utils/hexStringToNumber'
import { governancePool, LINKSWAPLPToken, mphPool, StakingRewards, syflPool, singlePool } from '../ABI'
import { getContract } from '../../utils'
import { BigNumber } from '@ethersproject/bignumber'
import { sYFL, WETHER, YFLUSD } from '../../constants'
import moment from 'moment'
import { ETHER } from '@uniswap/sdk'

async function getTokenPriceFromCoingecko(tokenAddress: string): Promise<any> {
  const url = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      method: 'GET'
    })

    if (response.ok) {
      const content = await response.json()
      return content[tokenAddress].usd
    } else {
      return false
    }
  } catch (e) {
    return false
  } finally {
    //console.log('fetched price')
  }
}

export default async function positionInformation(
  position: any,
  account: any,
  chainId: any,
  library: any,
  tokenPrices: any,
  positionInput: any
): Promise<any> {
  const positionOutput = positionInput
  const currency0 = unwrappedToken(position.tokens[0])
  const currency1 = unwrappedToken(position.tokens[1])
  const liquidityToken = position.liquidityToken ? position.liquidityToken : WETHER
  const unwrappedLiquidityToken = position.liquidityToken ? unwrappedToken(position.liquidityToken) : ETHER
  const fakeAccount = '0x0000000000000000000000000000000000000000'
  const fakeLibrary = getNetworkLibrary()
  let abi
  switch (position.abi) {
    case 'syflPool':
      abi = syflPool
      break
    case 'singlePool':
      abi = singlePool
      break
    case 'governancePool':
      abi = governancePool
      break
    case 'mphPool':
      abi = mphPool
      break
    default:
      abi = StakingRewards
  }
  const isGov = position.type === 'gov'
  positionOutput.abi = abi
  positionOutput.poolType = position.type
  positionOutput.infinitePeriod = position.type === 'mph88' || isGov
  const rewardsContract =
    !chainId || !library || !account
      ? getContract(position.rewardsAddress, abi, fakeLibrary, fakeAccount)
      : getContract(position.rewardsAddress, abi, library, account)
  const lpContract =
    !chainId || !library || !account
      ? getContract(liquidityToken.address, LINKSWAPLPToken, fakeLibrary, fakeAccount)
      : getContract(liquidityToken.address, LINKSWAPLPToken, library, account)
  const isDefault = position.abi === 'StakingRewards'

  try {
    if (positionOutput.poolType === 'mph88' || isGov) {
      positionOutput.isInactive = false
      positionOutput.updated = true
    } else if (positionOutput.poolType === 'syflPool') {
      positionOutput.periodFinish = 1643587200
      const thenYFL: any = moment.unix(1643587200)
      const nowYFL: any = moment()
      const remainingYFL = moment(thenYFL - nowYFL).unix()
      positionOutput.isInactive = remainingYFL < 1
      positionOutput.updated = true
      positionOutput.notStarted = remainingYFL === 1
    } else {
      const getPeriodFinishMethod: (...args: any) => Promise<BigNumber> = rewardsContract.periodFinish
      getPeriodFinishMethod().then(response => {
        positionOutput.periodFinish = hexStringToNumber(response.toHexString(), 0)
        const then: any = positionOutput.periodFinish > 0 ? moment.unix(positionOutput.periodFinish) : 0
        const now: any = moment()
        const remaining = positionOutput.periodFinish > 0 ? moment(then - now).unix() : 1
        positionOutput.isInactive = remaining < 1
        positionOutput.updated = true
        positionOutput.notStarted = remaining === 1
      })
    }
  } catch (e) {
    console.log('getPeriodFinishMethod', e)
  }

  try {
    if (positionOutput.poolType === 'mph88') {
      positionOutput.totalSupply = 50
    } else {
      const getTotalSupplyMethod: (...args: any) => Promise<BigNumber> = rewardsContract.totalSupply
      getTotalSupplyMethod().then(response => {
        positionOutput.totalSupply = hexStringToNumber(response.toHexString(), unwrappedLiquidityToken.decimals)
      })
    }
  } catch (e) {
    console.log('getTotalSupplyMethod', e)
  }

  try {
    if (positionOutput.poolType === 'mph88' || isGov) {
    } else {
      if (isDefault) {
        const getRewardTokensMethod: (...args: any) => Promise<string> = rewardsContract.rewardTokens
        const args = [0, 1]
        getRewardTokensMethod(args[0]).then(response => {
          positionOutput.rewardTokens[0] = response
        })
        getRewardTokensMethod(args[1]).then(response => {
          positionOutput.rewardTokens[1] = response
        })
      } else {
        if (position.type === 'single') {
          if (position.abi === 'singlePool') {
            if (typeof position.rewardsToken !== 'undefined') {
              positionOutput.rewardTokens[0] = position.rewardsToken.address
            } else {
              positionOutput.rewardTokens[0] = YFLUSD.address
            }
          } else {
            positionOutput.rewardTokens[0] = position.tokens[0].address
          }
        } else {
          positionOutput.rewardTokens[0] = sYFL.address
        }
        positionOutput.rewardTokens[1] = '0x0000000000000000000000000000000000000000'
      }
    }
  } catch (e) {
    console.log('getRewardTokensMethod', e)
  }

  try {
    if (positionOutput.poolType === 'mph88' || isGov) {
    } else {
      const getRewardTokenRatesMethod: (...args: any) => Promise<BigNumber> = rewardsContract.rewardRate
      if (isDefault) {
        const args = [0, 1]
        getRewardTokenRatesMethod(args[0]).then(response => {
          positionOutput.rewardTokenRates[0] = response.toHexString()
        })
        getRewardTokenRatesMethod(args[1]).then(response => {
          positionOutput.rewardTokenRates[1] = response.toHexString()
        })
      } else {
        getRewardTokenRatesMethod([]).then(response => {
          positionOutput.rewardTokenRates[0] = response.toHexString()
        })
        positionOutput.rewardTokenRates[1] = '0'
      }
    }
  } catch (e) {
    console.log('getRewardTokenRatesMethod', e)
  }

  try {
    if (positionOutput.poolType === 'mph88' || isGov) {
    } else {
      const getTotalLPSupplyMethod: (...args: any) => Promise<BigNumber> = lpContract.totalSupply
      getTotalLPSupplyMethod().then(response => {
        positionOutput.totalLPSupply = hexStringToNumber(response.toHexString(), unwrappedLiquidityToken.decimals)
      })
    }
  } catch (e) {
    console.log('getTotalLPSupplyMethod', e)
  }

  if (unwrappedLiquidityToken.symbol === 'UNI-V2') {
    try {
      const getUniswapPoolLiquidityMethod: (...args: any) => Promise<any> = lpContract.getReserves
      getUniswapPoolLiquidityMethod().then(response => {
        positionOutput.poolReserves = [
          hexStringToNumber(response[0]?.toString(), currency0.decimals),
          hexStringToNumber(response[1]?.toString(), currency1.decimals)
        ]
      })
    } catch (e) {
      console.log('getUniswapPoolLiquidityMethod', e)
    }

    try {
      const tokenAddress0 = position.tokens[0].address.toLowerCase()
      const tokenAddress1 = position.tokens[1].address.toLowerCase()
      const tokenPrice0 = tokenPrices[tokenAddress0]
        ? Number(tokenPrices[tokenAddress0].price)
        : await getTokenPriceFromCoingecko(tokenAddress0)
      const tokenPrice1 = tokenPrices[tokenAddress1]
        ? Number(tokenPrices[tokenAddress1].price)
        : await getTokenPriceFromCoingecko(tokenAddress1)
      positionOutput.poolTokenPrices = [tokenPrice0, tokenPrice1]
    } catch (e) {
      console.log('getTokenPriceFromCoingecko', e)
    }
  }

  if (account) {
    try {
      if (positionOutput.poolType === 'mph88') {
      } else {
        const getUserBalanceMethod: (...args: any) => Promise<BigNumber> = rewardsContract.balanceOf
        const args: Array<string> = [account]
        getUserBalanceMethod(...args).then(response => {
          positionOutput.userBalanceRaw = response.toHexString()
          positionOutput.userBalance = hexStringToNumber(response.toHexString(), unwrappedLiquidityToken.decimals, 6)
        })
      }
    } catch (e) {
      console.log('getUserBalanceMethod', e)
    }

    try {
      if (positionOutput.poolType === 'mph88' || isGov) {
      } else {
        const getUserRewardsMethod: (...args: any) => Promise<any> = rewardsContract.earned
        if (isDefault) {
          const args = [
            [account, '0x00'],
            [account, '0x01']
          ]
          getUserRewardsMethod(...args[0]).then(response => {
            positionOutput.userRewards[0] = response.toHexString()
          })
          getUserRewardsMethod(...args[1]).then(response => {
            positionOutput.userRewards[1] = response.toHexString()
          })
        } else {
          getUserRewardsMethod(account).then(response => {
            positionOutput.userRewards[0] = response.toHexString()
          })
        }
      }
    } catch (e) {
      console.log('getUserRewardsMethod', e)
    }
  }

  return positionOutput
}
