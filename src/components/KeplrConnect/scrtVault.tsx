import { ExecuteResult, SigningCosmWasmClient } from 'secretjs'
import { JsonObject } from 'secretjs/types/types'
import { Snip20Send } from './snip20'

interface QueryRewards {
  rewards: {
    rewards: string
  }
}

interface QueryDeposit {
  deposit: {
    deposit: string
  }
}

interface QueryRewardPoolBalance {
  reward_pool_balance: {
    balance: string
  }
}

export const QueryRewards = async (params: {
  cosmJS: SigningCosmWasmClient
  contract: string
  address: string
  height: string
  key: string
}): Promise<JsonObject> => {
  const { cosmJS, contract, address, height, key } = params

  const result: QueryRewards = await cosmJS.queryContractSmart(contract, {
    rewards: {
      address,
      height: Number(height),
      key
    }
  })

  return result.rewards.rewards
}

export const QueryDeposit = async (params: {
  cosmJS: SigningCosmWasmClient
  contract: string
  address: string
  key: string
}): Promise<JsonObject> => {
  const { cosmJS, contract, address, key } = params

  const result: QueryDeposit = await cosmJS.queryContractSmart(contract, {
    deposit: {
      address,
      key
    }
  })

  return result.deposit.deposit
}

export const QueryRewardPoolBalance = async (params: {
  cosmJS: SigningCosmWasmClient
  contract: string
}): Promise<JsonObject> => {
  const { cosmJS, contract } = params

  const result: QueryRewardPoolBalance = await cosmJS.queryContractSmart(contract, {
    // eslint-disable-next-line @typescript-eslint/camelcase
    reward_pool_balance: {}
  })

  return result.reward_pool_balance.balance
}

export const DepositRewards = async (params: {
  secretjs: SigningCosmWasmClient
  recipient: string
  address: string
  amount: string
}): Promise<string> => {
  await Snip20Send({
    msg: 'eyJkZXBvc2l0Ijp7fX0K', // '{"lock_tokens":{}}' -> base64
    ...params
  })

  return 'done'
}

export const Redeem = async (params: {
  secretjs: SigningCosmWasmClient
  address: string
  amount: string
}): Promise<ExecuteResult> => {
  const { secretjs, address, amount } = params

  const result = await secretjs.execute(address, {
    redeem: {
      amount
    }
  })

  return result
}

export const Claim = async (params: { secretjs: SigningCosmWasmClient; address: string }): Promise<ExecuteResult> => {
  const { secretjs, address } = params

  const result = await secretjs.execute(address, {
    claimRewardPool: {}
  })

  return result
}
