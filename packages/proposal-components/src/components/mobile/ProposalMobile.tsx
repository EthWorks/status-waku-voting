import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import styled from 'styled-components'
import { blueTheme } from '@status-waku-voting/react-components/dist/esm/src/style/themes'
import { ProposalList } from '../ProposalList'
// import { VotingEmpty } from './VotingEmpty'
// import { NotificationItem } from './NotificationItem'
import { ProposalVoteMobile } from './ProposalVoteMobile'
import { ProposeMobile } from './ProposeMobile'
import { ProposalHeaderMobile } from './ProposalHeaderMobile'

export function ProposalMobile() {
  return (
    <BrowserRouter>
      <ProposalWrapper>
        <ProposalHeaderMobile theme={blueTheme} />
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/proposal" />} />
          <Route exact path="/votingRoom/:id" component={ProposalVoteMobile} />
          <Route exact path="/creation" component={ProposeMobile} />
          <Route exact path="/proposal" component={ProposalList} />
        </Switch>
      </ProposalWrapper>
    </BrowserRouter>
  )
}

const ProposalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
  padding: 132px 16px 32px;
  width: 100%;
  min-height: 100vh;

  @media (max-width: 425px) {
    padding: 64px 16px 84px;
  }
`
