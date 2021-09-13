import React, {useEffect, useState} from 'react'
import { useTest } from '@status-waku-voting/proposal-hooks'
import { Proposal } from '@status-waku-voting/proposal-components'
import { TopBar, GlobalStyle } from '@status-waku-voting/react-components'
import votingIcon from './assets/images/voting.svg'
import styled from 'styled-components'
import { blueTheme } from '@status-waku-voting/react-components/dist/esm/src/style/themes'
import { DAppProvider, ChainId, useEthers } from '@usedapp/core'
import { DEFAULT_CONFIG } from '@usedapp/core/dist/cjs/src/model/config/default'
import {WakuVoting} from '@status-waku-voting/core'
import { Provider } from '@ethersproject/providers'

const config = {
  readOnlyChainId: ChainId.Ropsten,
  readOnlyUrls: {
    [ChainId.Ropsten]: 'https://ropsten.infura.io/v3/b4451d780cc64a078ccf2181e872cfcf',
  },
  multicallAddresses: {
    ...DEFAULT_CONFIG.multicallAddresses,
    1337: process.env.GANACHE_MULTICALL_CONTRACT ?? '0x0000000000000000000000000000000000000000',
  },
  supportedChains: [...DEFAULT_CONFIG.supportedChains, 1337],
  notifications: {
    checkInterval: 500,
    expirationPeriod: 50000,
  },
}

function Proposals() {
  const { account, library, activateBrowserWallet, deactivate } = useEthers()
  const [ waku , setWaku ] = useState<WakuVoting | undefined>(undefined)
  
  useEffect(() =>{

    const a = async() => {
      const wak = await WakuVoting.create('test', '0x5795A64A70cde4073DBa9EEBC5C6b675B15C815a', library as unknown as Provider, '0x53c43764255c17bd724f74c4ef150724ac50a3ed')
      setWaku(wak)
    }
    a()
  },[library])
  
  return (
    <Wrapper>
      <TopBar
        logo={votingIcon}
        title={'Proposals Dapp'}
        theme={blueTheme}
        activate={activateBrowserWallet}
        account={account}
        deactivate={deactivate}
      />
      {waku && <Proposal wakuVoting={waku}/>}
    </Wrapper>
  )
}

export function ProposalPage() {
  return (
    <Wrapper>
      <GlobalStyle />
      <DAppProvider config={config}>
        <Proposals />
      </DAppProvider>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`
