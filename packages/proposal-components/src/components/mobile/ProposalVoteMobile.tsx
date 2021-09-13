import React, { useState } from 'react'
import { useParams } from 'react-router'
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
  const { id } = useParams<{ id: string }>()
  const { account } = useEthers()
  const [proposingAmount, setProposingAmount] = useState(0)
  const [selectedVoted, setSelectedVoted] = useState(0)
  const [mobileVersion, setMobileVersion] = useState(true)

  return (
    <Card>
      <ProposalInfo
        heading={'This is a very long, explainative and sophisticated title for a proposal.'}
        text={
          'This is a longer description of the proposal. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum rutrum sodales. Nullam mattis fermentum libero, non volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum rutrum sodales. Nullam mattis fermentum libero. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque interdum rutrum sodales. Nullam mattis fermentum libero.'
        }
        address={'#'}
        mobileMode={mobileVersion}
      />
      <VoteChartWrap>
        <VoteChart
          votesFor={1865567}
          votesAgainst={1740235}
          timeLeft={4855555577}
          voteWinner={2}
          selectedVote={selectedVoted}
        />
      </VoteChartWrap>
      {!voteWinner && (
        <VotePropose
          availableAmount={65245346}
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

  @media (max-width: 425px) {
    padding-top: 118px;
  }
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

const VoteChartWrap = styled.div`
  width: 100%;
  margin-bottom: 32px;
`
