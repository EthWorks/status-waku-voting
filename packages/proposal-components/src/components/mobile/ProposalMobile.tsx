import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import styled from 'styled-components'
import { ProposalVoteMobile } from './ProposalVoteMobile'
import { ProposeMobile } from './ProposeMobile'
import { ProposalMainMobile } from './ProposalMainMobile'

export function ProposalMobile() {
  return (
    <BrowserRouter>
      <ProposalWrapper>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/proposal" />} />
          <Route exact path="/votingRoom/:id" component={ProposalVoteMobile} />
          <Route exact path="/creation" component={ProposeMobile} />
          <Route exact path="/proposal" component={ProposalMainMobile} />
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
  width: 100%;
  min-height: 100vh;
`
