import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useEthers } from '@usedapp/core'
import { FinalBtn, VoteBtnAgainst, VoteBtnFor } from '../Buttons'
import { VoteSubmitButton } from './VoteSubmitButton'
import { VoteChart } from './VoteChart'
import { ViewLink } from '../ViewLink'
import { Modal, Theme } from '@status-waku-voting/react-components'
import { VoteModal } from '../VoteModal'
import { VoteAnimatedModal } from '../VoteAnimatedModal'
import { ProposalVoteMobile } from '../mobile/ProposalVoteMobile'

interface ProposalVoteProps {
  theme: Theme
  vote?: number
  voteWinner?: number
  heading: string
  text: string
  address: string
  hideModalFunction?: (val: boolean) => void
}

export function ProposalVote({
  vote,
  voteWinner,
  address,
  heading,
  text,
  theme,
  hideModalFunction,
}: ProposalVoteProps) {
  const { account } = useEthers()
  const [showVoteModal, setShowVoteModal] = useState(false)
  const [showVoteMobile, setShowVoteMobile] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [proposingAmount, setProposingAmount] = useState(0)
  const [selectedVoted, setSelectedVoted] = useState(0)

  const setNext = (val: boolean) => {
    setShowConfirmModal(val)
    setShowVoteModal(false)
  }

  const hideConfirm = (val: boolean) => {
    if (hideModalFunction) {
      hideModalFunction(false)
    }
    setShowConfirmModal(val)
  }

  const [mobileVersion, setMobileVersion] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setMobileVersion(true)
      } else {
        setMobileVersion(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Card onClick={() => (mobileVersion ? setShowVoteMobile(true) : null)}>
      {showVoteMobile && (
        <ProposalVoteMobile
          votesFor={1865567}
          votesAgainst={1740235}
          timeLeft={4855555577}
          availableAmount={65245346}
          heading={heading}
          text={text}
          address={address}
        />
      )}

      {showVoteModal && (
        <Modal heading={heading} setShowModal={setShowVoteModal} theme={theme}>
          <VoteModal
            votesFor={1865567}
            votesAgainst={1740235}
            timeLeft={4855555577}
            availableAmount={65245346}
            selectedVote={selectedVoted}
            proposingAmount={proposingAmount}
            setShowConfirmModal={setNext}
            setProposingAmount={setProposingAmount}
          />{' '}
        </Modal>
      )}
      {showConfirmModal && (
        <Modal heading={heading} setShowModal={hideConfirm} theme={theme}>
          <VoteAnimatedModal
            votesFor={1865567}
            votesAgainst={1740235}
            timeLeft={4855555577}
            selectedVote={selectedVoted}
            setShowModal={hideConfirm}
            proposingAmount={proposingAmount}
          />
        </Modal>
      )}
      {voteWinner ? <CardHeading>Proposal {voteWinner == 1 ? 'rejected' : 'passed'}</CardHeading> : <CardHeading />}

      <VoteChart
        votesFor={1865567}
        votesAgainst={1740235}
        timeLeft={4855555577}
        voteWinner={voteWinner}
        selectedVote={selectedVoted}
      />

      <CardButtons>
        {voteWinner ? (
          <FinalBtn disabled={!account}>Finalize the vote</FinalBtn>
        ) : (
          <VotesBtns>
            <VoteBtnAgainst
              disabled={!account}
              onClick={() => {
                setSelectedVoted(0)
                setShowVoteModal(true)
              }}
            >
              Vote Against
            </VoteBtnAgainst>
            <VoteBtnFor
              disabled={!account}
              onClick={() => {
                setSelectedVoted(1)
                setShowVoteModal(true)
              }}
            >
              Vote For
            </VoteBtnFor>
          </VotesBtns>
        )}
      </CardButtons>

      <CardVoteBottom>
        <CardViewLink>
          {' '}
          <ViewLink address={address} />
        </CardViewLink>
        {vote && <VoteSubmitButton votes={vote} disabled={!account} />}
      </CardVoteBottom>
    </Card>
  )
}

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
    padding-top: 0;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    padding: 0;
    border-bottom: none;
  }
`

export const CardHeading = styled.h2`
  height: 24px;
  font-weight: bold;
  font-size: 17px;
  line-height: 24px;
  margin: 0;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 15px;
    line-height: 22px;
    margin-bottom: 6px;
  }

  @media (max-width: 600px) {
    display: none;
  }
`

const CardButtons = styled.div`
  width: 100%;

  @media (max-width: 600px) {
    display: none;
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
  width: 100%;
  margin-top: 24px;

  @media (max-width: 768px) {
    justify-content: space-between;
  }

  @media (max-width: 600px) {
    display: none;
  }
`
const CardViewLink = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`
