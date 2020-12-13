import React, { Suspense } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'

import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import Header from '../components/Header'
// import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'

import Swap from './Swap'
import { RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects'

import AddLiquidity from './AddLiquidity'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure
  // RedirectToAddLiquidity
} from './AddLiquidity/redirects'

import Pool from './Pool'
import PoolFinder from './PoolFinder'

import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'

import CreatePair from './CreatePair'
import {
  CreatePairRedirectOldPathStructure,
  CreatePairRedirectDuplicateTokenIds
  // RedirectToAddLiquidity
} from './CreatePair/redirects'

import PreviewListing from './PreviewListing'

import Analyze from './Analyze'

import i18next from 'i18next'

// import MigrateV1 from './MigrateV1'
// import MigrateV1Exchange from './MigrateV1/MigrateV1Exchange'
// import RemoveV1Exchange from './MigrateV1/RemoveV1Exchange'

import TestAddLiquidity from './TestAddLiquidity'
import {
  TestRedirectDuplicateTokenIds,
  TestRedirectOldAddLiquidityPathStructure
  // RedirectToAddLiquidity
} from './TestAddLiquidity/redirects'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`

const BodyWrapper = styled.div`
  min-height: 100wh;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 160px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding: 16px;
  `};

  z-index: 1;
`

const Marginer = styled.div`
  margin-top: 5rem;
`

const FooterWrapper = styled.div`
  position: fixed;
  height: 32px;
  margin-top: -32px;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
  background-color: #2b3a4a;
  z-index: 1;
  padding: 5px 0;
`

document.body.dir = i18next.dir()

export default function App() {
  return (
    <Suspense fallback={null}>
      <HashRouter>
        <Route component={GoogleAnalyticsReporter} />
        <Route component={DarkModeQueryParamReader} />
        <AppWrapper>
          <HeaderWrapper>
            <Header />
          </HeaderWrapper>
          <BodyWrapper>
            {/* <Popups /> */}
            <Web3ReactManager>
              <Switch>
                <Route exact strict path="/swap" component={Swap} />
                <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
                <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
                <Route exact strict path="/find" component={PoolFinder} />
                <Route exact strict path="/pool" component={Pool} />
                <Route exact path="/add" component={AddLiquidity} />
                <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
                <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
                {/* <Route exact strict path="/remove/v1/:address" component={RemoveV1Exchange} /> */}
                <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
                <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
                <Route exact strict path="/create" component={CreatePair} />
                <Route exact path="/create/:currencyIdA" component={CreatePairRedirectOldPathStructure} />
                <Route exact path="/create/:currencyIdA/:currencyIdB" component={CreatePairRedirectDuplicateTokenIds} />
                <Route exact strict path="/previewlisting" component={PreviewListing} />{' '}
                <Route exact strict path="/analyze" component={Analyze} />
                {/* <Route exact strict path="/migrate/v1" component={MigrateV1} />
                <Route exact strict path="/migrate/v1/:address" component={MigrateV1Exchange} /> */}
                {/* <Route exact path="/testAdd" component={TestAddLiquidity} />
                <Route exact path="/testAdd/:currencyIdA" component={TestRedirectOldAddLiquidityPathStructure} />
                <Route exact path="/testAdd/:currencyIdA/:currencyIdB" component={TestRedirectDuplicateTokenIds} /> */}
                <Route component={RedirectPathToSwapOnly} />
              </Switch>
            </Web3ReactManager>
            <Marginer />
          </BodyWrapper>
          <FooterWrapper>
            <a style={{ color: 'white' }} target="_blank" href="https://certificate.quantstamp.com/full/linkswap">
              Quantstamp Audit Report - LINKSWAP
            </a>
          </FooterWrapper>
        </AppWrapper>
      </HashRouter>
    </Suspense>
  )
}
