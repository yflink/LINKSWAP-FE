import React from 'react'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { getNetworkLibrary } from '../../connectors'
import hexStringToNumber from '../../utils/hexStringToNumber'
import { Contract } from '@ethersproject/contracts'
import { LINKSWAPLPToken, StakingRewards, syflPool } from '../../pages/Stake/stakingAbi'
import { getContract } from '../../utils'
import { BigNumber } from '@ethersproject/bignumber'
import { Currency, Token } from '@uniswap/sdk'
import { sYFL } from '../../constants'
import moment from 'moment'

async function getUserBalance(account: string, rewardsContract: Contract): Promise<any> {
  const method: (...args: any) => Promise<BigNumber> = rewardsContract.balanceOf
  const args: Array<string> = [account]
  method(...args).then(response => {
    return response.toHexString()
  })
}

async function getUserRewards(
  account: string,
  index: number,
  indexString: string,
  rewardsContract: Contract,
  poolType: string
): Promise<any> {
  const isDefault = poolType !== 'syflPool'
  const method: (...args: any) => Promise<any> = rewardsContract.earned
  const args: Array<string | number> = isDefault ? [account, indexString] : [account]
  method(...args).then(response => {
    return !isDefault && index === 1 ? '0' : response.toHexString()
  })
}

async function getPeriodFinish(rewardsContract: Contract): Promise<any> {
  const method: (...args: any) => Promise<BigNumber> = rewardsContract.periodFinish
  method().then(response => {
    return hexStringToNumber(response.toHexString(), 0)
  })
}

async function getTotalLPSupply(lpContract: Contract, liquidityToken: Currency): Promise<any> {
  const method: (...args: any) => Promise<BigNumber> = lpContract.totalSupply
  method().then(response => {
    return hexStringToNumber(response.toHexString(), liquidityToken.decimals)
  })
}

async function getRewardTokens(index: number, rewardsContract: Contract, poolType: string): Promise<any> {
  const isDefault = poolType !== 'syflPool'
  if (isDefault) {
    const method: (...args: any) => Promise<string> = rewardsContract.rewardTokens
    const args = index
    method(args).then(response => {
      return response
    })
  } else {
    if (index === 0) {
      return sYFL.address
    } else {
      return '0x0000000000000000000000000000000000000000'
    }
  }
}
async function getRewardTokenRates(index: number, rewardsContract: Contract, poolType: string): Promise<any> {
  const isDefault = poolType !== 'syflPool'
  const method: (...args: any) => Promise<BigNumber> = rewardsContract.rewardRate
  const args = isDefault ? index : []
  method(args).then(response => {
    return !isDefault && index === 1 ? '0' : response.toHexString()
  })
}

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

async function getUniswapPoolLiquidity(lpContract: Contract, currency0: Currency, currency1: Currency): Promise<any> {
  const method: (...args: any) => Promise<any> = lpContract.getReserves
  method().then(response => {
    return [
      hexStringToNumber(response[0]?.toString(), currency0.decimals),
      hexStringToNumber(response[1]?.toString(), currency1.decimals)
    ]
  })
}

async function getUniswapPoolTokenPrices(tokenPrices: any, token0: Token, token1: Token): Promise<any> {
  const tokenAddress0 = token0.address.toLowerCase()
  const tokenAddress1 = token1.address.toLowerCase()
  const tokenPrice0 = tokenPrices[tokenAddress0]
    ? Number(tokenPrices[tokenAddress0].price)
    : await getTokenPriceFromCoingecko(tokenAddress0)
  const tokenPrice1 = tokenPrices[tokenAddress1]
    ? Number(tokenPrices[tokenAddress1].price)
    : await getTokenPriceFromCoingecko(tokenAddress1)
  return [tokenPrice0, tokenPrice1]
}

export default async function positionInformation(
  position: any,
  account: any,
  chainId: any,
  library: any,
  tokenPrices: any,
  lpTokenPrices: any
): Promise<any> {
  const positionOutput = {
    poolReserves: [0, 0],
    poolTokenPrices: [0, 0],
    userBalanceRaw: '0',
    userBalance: 0,
    userRewards: ['', ''],
    periodFinish: 0,
    rewardTokens: ['', ''],
    rewardTokenRates: ['0', '0'],
    totalSupply: 0,
    totalLPSupply: 0,
    poolType: 'default',
    apy: 0,
    userShare: 0,
    lpTokenPrice: 0,
    stakePoolTotalDeposited: 0,
    stakePoolTotalLiq: 0,
    userShareUsd: 0,
    isInactive: true,
    rewardInfo: [
      {
        address: '',
        decimals: 18,
        symbol: '',
        rate: 0,
        price: 0,
        userReward: 0
      },
      {
        address: '',
        decimals: 18,
        symbol: '',
        rate: 0,
        price: 0,
        userReward: 0
      }
    ]
  }
  const currency0 = unwrappedToken(position.tokens[0])
  const currency1 = unwrappedToken(position.tokens[1])
  const liquidityToken = unwrappedToken(position.liquidityToken)
  const fakeAccount = '0x0000000000000000000000000000000000000000'
  const fakeLibrary = getNetworkLibrary()
  const abi =
    position.abi === 'StakingRewards' ? StakingRewards : position.abi === 'syflPool' ? syflPool : LINKSWAPLPToken
  positionOutput.poolType = abi === StakingRewards ? 'default' : abi === syflPool ? 'syflPool' : 'other'
  const rewardsContract =
    !chainId || !library || !account
      ? getContract(position.rewardsAddress, abi, fakeLibrary, fakeAccount)
      : getContract(position.rewardsAddress, abi, library, account)
  const lpContract =
    !chainId || !library || !account
      ? getContract(position.liquidityToken.address, LINKSWAPLPToken, fakeLibrary, fakeAccount)
      : getContract(position.liquidityToken.address, LINKSWAPLPToken, library, account)

  try {
    positionOutput.periodFinish = await getPeriodFinish(rewardsContract)
  } catch (e) {
    console.log(e)
  }

  try {
    const getTotalSupplyMethod: (...args: any) => Promise<BigNumber> = rewardsContract.totalSupply
    getTotalSupplyMethod().then(response => {
      positionOutput.totalSupply = hexStringToNumber(response.toHexString(), liquidityToken.decimals)
    })
  } catch (e) {
    console.log(e)
  }

  try {
    positionOutput.rewardTokens[0] = await getRewardTokens(0, rewardsContract, positionOutput.poolType)
    positionOutput.rewardTokens[1] = await getRewardTokens(1, rewardsContract, positionOutput.poolType)
  } catch (e) {
    console.log(e)
  }

  try {
    positionOutput.rewardTokenRates[0] = await getRewardTokenRates(0, rewardsContract, positionOutput.poolType)
    positionOutput.rewardTokenRates[1] = await getRewardTokenRates(1, rewardsContract, positionOutput.poolType)
  } catch (e) {
    console.log(e)
  }

  if (
    typeof positionOutput.rewardTokens[0] !== 'undefined' &&
    typeof positionOutput.rewardTokens[1] !== 'undefined' &&
    tokenPrices
  ) {
    const token0Address = positionOutput.rewardTokens[0].toLowerCase()
    const token1Address = positionOutput.rewardTokens[1].toLowerCase()
    if (tokenPrices[token0Address]) {
      positionOutput.rewardInfo[0].address = token0Address
      positionOutput.rewardInfo[0].decimals = tokenPrices[token0Address].decimals
      positionOutput.rewardInfo[0].symbol = tokenPrices[token0Address].symbol
      positionOutput.rewardInfo[0].price = tokenPrices[token0Address].price
    } else {
      if (token0Address !== fakeAccount) {
        if (position.tokens[0].address.toLowerCase() === token0Address && positionOutput.poolTokenPrices[0] !== 0) {
          positionOutput.rewardInfo[0].address = position.tokens[0].address
          positionOutput.rewardInfo[0].decimals = position.tokens[0].decimals
          positionOutput.rewardInfo[0].symbol = position.tokens[0].symbol
          positionOutput.rewardInfo[0].price = positionOutput.poolTokenPrices[0]
        }
        if (position.tokens[1].address.toLowerCase() === token0Address && positionOutput.poolTokenPrices[1] !== 0) {
          positionOutput.rewardInfo[0].address = position.tokens[1].address
          positionOutput.rewardInfo[0].decimals = position.tokens[1].decimals
          positionOutput.rewardInfo[0].symbol = position.tokens[1].symbol
          positionOutput.rewardInfo[0].price = positionOutput.poolTokenPrices[1]
        }
      }
    }

    if (positionOutput.rewardTokenRates[0] && positionOutput.rewardInfo[0].decimals) {
      positionOutput.rewardInfo[0].rate = hexStringToNumber(
        positionOutput.rewardTokenRates[0],
        positionOutput.rewardInfo[0].decimals,
        2,
        true
      )
    }

    if (tokenPrices[token1Address]) {
      positionOutput.rewardInfo[1].address = token1Address
      positionOutput.rewardInfo[1].decimals = tokenPrices[token1Address].decimals
      positionOutput.rewardInfo[1].symbol = tokenPrices[token1Address].symbol
      positionOutput.rewardInfo[1].price = tokenPrices[token1Address].price
    } else {
      if (token1Address !== fakeAccount) {
        if (position.tokens[0].address.toLowerCase() === token1Address && positionOutput.poolTokenPrices[0] !== 0) {
          positionOutput.rewardInfo[1].address = position.tokens[0].address
          positionOutput.rewardInfo[1].decimals = position.tokens[0].decimals
          positionOutput.rewardInfo[1].symbol = position.tokens[0].symbol
          positionOutput.rewardInfo[1].price = positionOutput.poolTokenPrices[0]
        }
        if (position.tokens[1].address.toLowerCase() === token1Address && positionOutput.poolTokenPrices[1] !== 0) {
          positionOutput.rewardInfo[1].address = position.tokens[1].address
          positionOutput.rewardInfo[1].decimals = position.tokens[1].decimals
          positionOutput.rewardInfo[1].symbol = position.tokens[1].symbol
          positionOutput.rewardInfo[1].price = positionOutput.poolTokenPrices[1]
        }
      }
    }

    if (positionOutput.rewardTokenRates[1] && positionOutput.rewardInfo[1].decimals) {
      positionOutput.rewardInfo[1].rate = hexStringToNumber(
        positionOutput.rewardTokenRates[1],
        positionOutput.rewardInfo[1].decimals,
        2,
        true
      )
    }
  }

  if (account) {
    positionOutput.userBalanceRaw = await getUserBalance(account, rewardsContract)
    positionOutput.userBalance = hexStringToNumber(positionOutput.userBalanceRaw, liquidityToken.decimals, 6)

    if (positionOutput.rewardTokens[0] !== '') {
      positionOutput.userRewards[0] = await getUserRewards(account, 0, '0x00', rewardsContract, positionOutput.poolType)
    }

    if (positionOutput.rewardTokens[1] !== '') {
      positionOutput.userRewards[1] = await getUserRewards(account, 1, '0x01', rewardsContract, positionOutput.poolType)
    }
  }

  positionOutput.totalLPSupply = await getTotalLPSupply(lpContract, liquidityToken)

  if (liquidityToken.symbol !== 'LSLP') {
    positionOutput.poolType = 'uni'
    positionOutput.poolReserves = await getUniswapPoolLiquidity(lpContract, currency0, currency1)
    positionOutput.poolTokenPrices = await getUniswapPoolTokenPrices(
      tokenPrices,
      position.tokens[0],
      position.tokens[1]
    )

    if (typeof positionOutput.poolReserves !== 'undefined' && typeof positionOutput.poolTokenPrices !== 'undefined') {
      positionOutput.stakePoolTotalLiq =
        positionOutput.poolReserves[0] * positionOutput.poolTokenPrices[0] +
        positionOutput.poolReserves[1] * positionOutput.poolTokenPrices[1]
    }
  } else {
    if (lpTokenPrices) {
      if (lpTokenPrices[position.liquidityToken.address.toLowerCase()]) {
        positionOutput.stakePoolTotalLiq = lpTokenPrices[position.liquidityToken.address.toLowerCase()].totalLiq
      }
    }
  }
  if (positionOutput.userRewards[0] !== '' && positionOutput.userRewards[1] !== '') {
    positionOutput.rewardInfo[0].userReward = hexStringToNumber(
      positionOutput.userRewards[0],
      positionOutput.rewardInfo[0].decimals
    )
    positionOutput.rewardInfo[1].userReward = hexStringToNumber(
      positionOutput.userRewards[1],
      positionOutput.rewardInfo[1].decimals
    )
  }

  const then: any = positionOutput.periodFinish > 0 ? moment.unix(positionOutput.periodFinish) : 0
  const now: any = moment()
  const remaining = positionOutput.periodFinish > 0 ? moment(then - now).unix() : 1
  positionOutput.isInactive = remaining < 1

  positionOutput.userShare =
    positionOutput.totalSupply > 0 && positionOutput.userBalance > 0
      ? positionOutput.userBalance / (positionOutput.totalSupply / 100)
      : 0
  positionOutput.lpTokenPrice =
    positionOutput.stakePoolTotalLiq && positionOutput.totalLPSupply > 0
      ? positionOutput.stakePoolTotalLiq / positionOutput.totalLPSupply
      : 0
  positionOutput.stakePoolTotalDeposited = positionOutput.lpTokenPrice
    ? positionOutput.totalSupply * positionOutput.lpTokenPrice
    : 0
  positionOutput.userShareUsd =
    positionOutput.lpTokenPrice && positionOutput.userBalance
      ? positionOutput.userBalance * positionOutput.lpTokenPrice
      : 0

  if (positionOutput.apy === 0 && tokenPrices && positionOutput.stakePoolTotalDeposited) {
    let totalDailyRewardValue = 0
    if (positionOutput.rewardInfo[0].rate > 0) {
      const dailyToken0Value = positionOutput.rewardInfo[0].rate * positionOutput.rewardInfo[0].price
      if (dailyToken0Value > 0) {
        totalDailyRewardValue += dailyToken0Value
      }
    }

    if (positionOutput.rewardInfo[1].rate > 0) {
      const dailyToken1Value = positionOutput.rewardInfo[1].rate * positionOutput.rewardInfo[1].price
      if (dailyToken1Value > 0) {
        totalDailyRewardValue += dailyToken1Value
      }
    }

    if (!!positionOutput.totalSupply) {
      const yearlyRewardsValue = totalDailyRewardValue * 365
      const perDepositedDollarYearlyReward = yearlyRewardsValue / positionOutput.stakePoolTotalDeposited
      positionOutput.apy = perDepositedDollarYearlyReward * 100
    }
  }

  return positionOutput
}
