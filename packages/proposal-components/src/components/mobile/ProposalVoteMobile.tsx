import React, { useState } from 'react'
import styled from 'styled-components'
import { useEthers } from '@usedapp/core'
import { FinalBtn, VoteBtnAgainst, VoteBtnFor } from '../Buttons'
import { VoteSubmitButton } from '../ProposalVoteCard/VoteSubmitButton'
import { VoteChart } from '../ProposalVoteCard/VoteChart'
import { ProposalInfo } from '../ProposalInfo'
import { VotePropose } from '../VotePropose'

interface ProposalVoteMobileProps {
  vote?: number
  voteWinner?: number
  votesFor: number
  votesAgainst: number
  timeLeft: number
  availableAmount: number
  heading: string
  text: string
  address: string
}

export function ProposalVoteMobile({
  votesFor,
  votesAgainst,
  timeLeft,
  vote,
  voteWinner,
  address,
  heading,
  text,
  availableAmount,
}: ProposalVoteMobileProps) {
  const { account } = useEthers()
  const [proposingAmount, setProposingAmount] = useState(0)
  const [selectedVoted, setSelectedVoted] = useState(0)

  return (
    <Card>
      <ProposalInfo heading={heading} text={text} address={address} />

      <VoteChart
        votesFor={votesFor}
        votesAgainst={votesAgainst}
        timeLeft={timeLeft}
        voteWinner={voteWinner}
        selectedVote={selectedVoted}
      />

      {!voteWinner && (
        <VotePropose
          availableAmount={availableAmount}
          setProposingAmount={setProposingAmount}
          proposingAmount={proposingAmount}
        />
      )}

      <CardButtons>
        {voteWinner ? (
          <FinalBtn disabled={!account}>Finalize the vote</FinalBtn>
        ) : (
          <VotesBtns>
            <VoteBtnAgainst
              disabled={!account}
              onClick={() => {
                setSelectedVoted(0)
              }}
            >
              Vote Against
            </VoteBtnAgainst>
            <VoteBtnFor
              disabled={!account}
              onClick={() => {
                setSelectedVoted(1)
              }}
            >
              Vote For
            </VoteBtnFor>
          </VotesBtns>
        )}
      </CardButtons>

      <CardVoteBottom>{vote && <VoteSubmitButton votes={vote} disabled={!account} />}</CardVoteBottom>
    </Card>
  )
}

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  // @media (max-width: 768px) {
  //   width: 100%;
  //   box-shadow: none;
  //   border-radius: unset;
  //   background-color: unset;
  //   padding-top: 0;
  // }

  // @media (max-width: 600px) {
  //   flex-direction: column;
  //   padding: 0;
  //   border-bottom: none;
  // }
`

const CardButtons = styled.div`
  width: 100%;
`

const VotesBtns = styled.div`
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
  width: 100%;
  margin-top: 24px;
`
