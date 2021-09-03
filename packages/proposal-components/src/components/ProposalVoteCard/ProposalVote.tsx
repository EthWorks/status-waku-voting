import React, { useState } from 'react'
import styled from 'styled-components'
import { useEthers } from '@usedapp/core'
import { Button } from '@status-waku-voting/react-components'

// interface ProposalVoteProps {
//     room: DetailedVotingRoom
//     hideModalFunction?: (val: boolean) => void
//   }

export function ProposalVote() {
  const { account } = useEthers()
  const [showVoteModal, setShowVoteModal] = useState(false)
  // const [showConfirmModal, setShowConfirmModal] = useState(false)
  // const [proposingAmount, setProposingAmount] = useState(0)
  // const [selectedVoted, setSelectedVoted] = useState(voteTypes['Add'].for)

  return (
    <Card>
      {/* <VoteChart /> */}
      {/* 
      {winner ? (
        <VoteBtnFinal disabled={!account}>
          Finalize the vote
        </VoteBtnFinal>
      ) : (
        <VotesBtns>
          <VoteBtn
            disabled={!account}
            onClick={() => {
              setSelectedVoted(voteConstants.against)
              setShowVoteModal(true)
            }}
          >
            Vote Against
          </VoteBtn>
          <VoteBtn
            disabled={!account}
            onClick={() => {
              setSelectedVoted(voteConstants.for)
              setShowVoteModal(true)
            }}
          >
           Vote For
          </VoteBtn>
        </VotesBtns>
      )} */}

      <VotesBtns>
        <VoteBtnAgainst disabled={!account}>Vote Against</VoteBtnAgainst>
        <VoteBtnFor disabled={!account}>Vote For</VoteBtnFor>
      </VotesBtns>

      {/* <VoteSubmitButton vote={vote} /> */}
    </Card>
  )
}

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  padding: 24px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px 0px 0px 6px;
  background-color: #fbfcfe;

  @media (max-width: 768px) {
    width: 100%;
    box-shadow: none;
    border-radius: unset;
    background-color: unset;
    padding-bottom: 0;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    padding: 16px 0 0;
    border-bottom: none;
  }
`
export const VotesBtns = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 600px) {
    margin-top: 24px;
  }
`
export const VoteBtn = styled(Button)`
  width: 44%;
  padding: 11px 0;
  font-weight: 500;
  line-height: 22px;
  text-align: center;

  @media (max-width: 768px) {
    width: 48%;
  }
`

export const VoteBtnAgainst = styled(VoteBtn)`
  background-color: #ffeded;
  color: #c90a0a;
`
export const VoteBtnFor = styled(VoteBtn)`
  background-color: #edfff4;
  color: #1d920a;
`
