import React from 'react'
import { VoteSendingBtn } from '../Buttons'

interface VoteSubmitButtonProps {
  votes: number
}

export function VoteSubmitButton({ votes }: VoteSubmitButtonProps) {
  if (votes > 0) {
    return <VoteSendingBtn> {votes} votes need saving</VoteSendingBtn>
  }
  return null
}
