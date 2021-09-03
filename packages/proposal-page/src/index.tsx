import React from 'react'
import { useTest } from '@status-waku-voting/proposal-hooks'
import { Proposal } from '@status-waku-voting/proposal-components'
import { TopBar, GlobalStyle } from '@status-waku-voting/react-components'
import votingIcon from './assets/images/voting.svg'
import styled from 'styled-components'
import { blueTheme } from '@status-waku-voting/react-components/dist/esm/src/style/themes'

export function ProposalPage() {
  useTest()
  return (
    <Wrapper>
      <GlobalStyle />
      <TopBarProposal logo={votingIcon} title={'Proposals Dapp'} theme={blueTheme} />
      <Proposal />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`
const TopBarProposal = styled(TopBar)`
  @media (max-width: 425px) {
    background-color: #f8faff;
  }
`
