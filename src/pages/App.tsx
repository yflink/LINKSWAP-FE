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
import { RedirectDuplicateTokenIds, RedirectOldAddLiquidityPathStructure } from './AddLiquidity/redirects'

import Pool from './Pool'
import PoolFinder from './PoolFinder'

import RemoveLiquidity from './RemoveLiquidity'
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'

import CreatePair from './CreatePair'
import { CreatePairRedirectOldPathStructure, CreatePairRedirectDuplicateTokenIds } from './CreatePair/redirects'

import PreviewListing from './PreviewListing'

import Analyze from './Analyze'

import { ExternalLink } from 'react-feather'

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
  z-index: 1;
  padding: 5px 0;
  background-color: ${({ theme }) => theme.bg8};
  a {
    text-decoration:none;
    color: ${({ theme }) => theme.text1};
    :hover,
    :focus {
      text-decoration: underline;
    }
  }
`

const NewWindowIcon = styled.div`
  position: absolute;
  top: 6px;
  display: inline-block;
  margin-left: 5px;
`

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
                <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
                <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
                <Route exact strict path="/create" component={CreatePair} />
                <Route exact path="/create/:currencyIdA" component={CreatePairRedirectOldPathStructure} />
                <Route exact path="/create/:currencyIdA/:currencyIdB" component={CreatePairRedirectDuplicateTokenIds} />
                <Route exact strict path="/previewlisting" component={PreviewListing} />{' '}
                <Route exact strict path="/analyze" component={Analyze} />
                <Route component={RedirectPathToSwapOnly} />
              </Switch>
            </Web3ReactManager>
            <Marginer />
          </BodyWrapper>
          <FooterWrapper>
            <a target="_blank" rel="noopener noreferrer" href="https://certificate.quantstamp.com/full/linkswap">
              Quantstamp Audit Report - LINKSWAP <NewWindowIcon><ExternalLink size='15' color='white' /></NewWindowIcon>
            </a>
          </FooterWrapper>
        </AppWrapper>
      </HashRouter>
    </Suspense>
  )
}
