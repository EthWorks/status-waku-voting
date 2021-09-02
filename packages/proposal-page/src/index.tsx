import React from 'react'
import { useTest } from '@status-waku-voting/proposal-hooks'
import { Proposal } from '@status-waku-voting/proposal-components'
import { TopBar } from '@status-waku-voting/react-components'
import votingIcon from './assets/images/voting.svg'
import styled from 'styled-components'

export function ProposalPage() {
  useTest()
  return (
    <Wrapper>
      <TopBar logo={votingIcon} title={'Proposals Dapp'} color={'#5D7BE2'} />
      <Proposal />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`
