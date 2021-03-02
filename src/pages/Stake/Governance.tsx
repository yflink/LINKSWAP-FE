import React, { useContext, useState } from 'react'
import { Text } from 'rebass'
import Card, { BlueCard } from '../../components/Card'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import AppBody from '../AppBody'
import styled, { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import Question from '../../components/QuestionHelper'
import { useNavigationActiveItemManager } from '../../state/navigation/hooks'
import {numberToSignificant, numberToUsd} from '../../utils/numberUtils'
import { ButtonSecondary } from '../../components/Button'
import { Link } from 'react-router-dom'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { YFL, yYFL } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import Loader from '../../components/Loader'
import {getContract} from "../../utils";
import {governancePool} from "../../components/ABI";
import {getNetworkLibrary} from "../../connectors";
import hexStringToNumber from "../../utils/hexStringToNumber";
import {BigNumber} from "ethers";

const GovernanceBalance = styled.div`
  display: flex;
  flex: 0 0 100%;
  margin: 0 0 24px;
`

const UserBalance = styled.div`
  display: flex;
  flex: 0 0 100%;
  margin: 0 0 12px;
`

const Title = styled.p`
  font-size: 18px;
  margin: 12px 0 0;
  font-weight: 700;
`

async function getGovBalance() {
  try {
    const response = await fetch('https://api.thegraph.com/subgraphs/name/yflink/linkswap-v1', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `{
          user(id: "0x0389d755c1833c9b350d4e8b619eae16defc1cba") {
          liquidityPositions {
            id
            liquidityTokenBalance
            pair {
              id
              totalSupply
              reserveUSD
            }
          }
        }
      }`,
        variables: null
      }),
      method: 'POST'
    })

    if (response.ok) {
      const { data } = await response.json()
      return data.user.liquidityPositions
    } else {
      return []
    }
  } catch (e) {
    console.log(e)
    return []
  }
}

export default function StakeGovernance() {
  const { account } = useActiveWeb3React()
  const fakeAccount = '0x0000000000000000000000000000000000000000'
  const fakeLibrary = getNetworkLibrary()
  const governanceAddress = '0x75D1aA733920b14fC74c9F6e6faB7ac1EcE8482E'
  const theme = useContext(ThemeContext)
  const [govBalanceFetching, setGovBalanceFetching] = useState(false)
  const [govBalance, setGovBalance] = useState(0)
  const [yyflPrice, setYyflPrice] = useState(0)
  const { t } = useTranslation()
  const newActive = useNavigationActiveItemManager()
  newActive('stake-governance')
  const [userBalances, fetchingUserBalances] = useTokenBalancesWithLoadingIndicator(account ?? undefined, [YFL, yYFL])
  const [govBalances, fetchingGovBalances] = useTokenBalancesWithLoadingIndicator(governanceAddress ?? undefined, [YFL])
  const govContract = getContract(governanceAddress, governancePool, fakeLibrary, fakeAccount)




  if (!govBalanceFetching && govBalance === 0) {
    setGovBalanceFetching(true)

      const getPricePerFullShareMethod: (...args: any) => Promise<BigNumber> = govContract.getPricePerFullShare
      getPricePerFullShareMethod().then(response => {
          setYyflPrice(hexStringToNumber(response.toHexString(), yYFL.decimals))
      })

    getGovBalance().then(result => {
      let govLpUsdBalance = 0
      if (result.length > 0) {
        result.forEach(function(pool: Record<string, any>) {
          const totalBalance = pool.liquidityTokenBalance
          const totalSupply = pool.pair.totalSupply
          const totalLiquidity = pool.pair.reserveUSD
          const lpPrice = Number(totalLiquidity) / Number(totalSupply)
          const positionBalance = Number(totalBalance) * lpPrice
          govLpUsdBalance += positionBalance
        })
        setGovBalance(govLpUsdBalance)
      }
    })
  }


  console.log(yyflPrice )

  return (
    <>
      <Card style={{ maxWidth: '420px', padding: '12px', backgroundColor: theme.navigationBG, marginBottom: '16px' }}>
        <SwapPoolTabs active={'stake'} />
      </Card>
      <AppBody>
        <AutoColumn gap={'12px'}>
          <RowBetween>
            <Text color={theme.textPrimary} fontWeight={500}>
              {t('stakeGovernance')}
            </Text>
            <Question text={t('stakeGovernanceDescription')} />
          </RowBetween>
        </AutoColumn>
        <BlueCard style={{ margin: '12px 0' }}>
          <Text textAlign="center" fontSize={12} fontWeight={400}>
            {t('stakeGovernanceBalance')}
          </Text>
          <Text textAlign="center" fontSize={30} fontWeight={700}>
            {numberToUsd(govBalance)}
          </Text>
        </BlueCard>
        <GovernanceBalance>
          <AutoColumn gap={'12px'} style={{ width: '100%' }}>
            <Title>Governance Statistics</Title>
            <RowBetween>
              <Text>Staked YFL:</Text>
              {fetchingGovBalances ? (
                <Loader />
              ) : (
                <Text>{govBalances[YFL.address]?.toSignificant(8) + ' ' + YFL.symbol}</Text>
              )}
            </RowBetween>
            <RowBetween>
              <Text>yYFL Price:</Text>
              {yyflPrice === 0 ? (
                <Loader />
              ) : (
                <Text>{numberToSignificant(yyflPrice, 4) + ' ' + YFL.symbol}</Text>
              )}
            </RowBetween>
          </AutoColumn>
        </GovernanceBalance>
        <UserBalance>
          <AutoColumn gap={'12px'} style={{ width: '100%' }}>
            <Title>Stake into Governance</Title>
            <BlueCard style={{ margin: '0 0 12px' }}>
              <Text fontSize="14px">
                When you stake your YFL into Governance, you'll recieve yYFL for it. The yYFL price increases after each
                reward distribution. Unstaking converts your yYFL back to your original amount of YFL staked plus
                distributed rewards.
              </Text>
            </BlueCard>
            <RowBetween>
              <Text>Your YFLink Balance:</Text>
              {fetchingUserBalances ? (
                <Loader />
              ) : (
                <Text>{userBalances[YFL.address]?.toSignificant(4) + ' ' + YFL.symbol}</Text>
              )}
            </RowBetween>
            <RowBetween>
              <ButtonSecondary as={Link} width="100%" to="stake/single/gov">
                {t('stake')}
              </ButtonSecondary>
            </RowBetween>
          </AutoColumn>
        </UserBalance>
        <UserBalance>
          <AutoColumn gap={'12px'} style={{ width: '100%' }}>
            <Title>Unstake from Governance</Title>
            <BlueCard style={{ margin: '0 0 12px' }}>
              <Text fontSize="14px">
                You can unstake your yYFL at any time. Your yYFL will be converted back to YFL. Note that there is a 1%
                unstaking fee if you unstake before 172800 blocks (approximately 26 days) from your time of staking,
                which will go to the treasury.
              </Text>
            </BlueCard>
            <RowBetween>
              <Text>Your Staked YFLink Balance:</Text>
              {fetchingUserBalances ? (
                <Loader />
              ) : (
                <Text>{userBalances[yYFL.address]?.toSignificant(4) + ' ' + yYFL.symbol}</Text>
              )}
            </RowBetween>
            <RowBetween>
              <Text>Unstake fee:</Text>
              <Text>0%</Text>
            </RowBetween>
            <RowBetween>
              <ButtonSecondary as={Link} width="100%" to="unstake/single/gov">
                {t('unstake')}
              </ButtonSecondary>
            </RowBetween>
          </AutoColumn>
        </UserBalance>
      </AppBody>
    </>
  )
}
