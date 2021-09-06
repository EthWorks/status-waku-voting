import React, { useState } from 'react'
import styled from 'styled-components'
import { useEthers } from '@usedapp/core'
import { VoteBtnAgainst, VoteBtnFor } from '../Buttons'
import { VoteSubmitButton } from './VoteSubmitButton'

interface ProposalVoteProps {
  vote: number
  hideModalFunction?: (val: boolean) => void
}

export function ProposalVote({ vote, hideModalFunction }: ProposalVoteProps) {
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

      <CardVoteBottom>{vote && <VoteSubmitButton votes={vote} disabled={!account} />}</CardVoteBottom>
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

const CardVoteBottom = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`
