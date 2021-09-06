import React from 'react'
import { VoteSendingBtn } from '../Buttons'

interface VoteSubmitButtonProps {
  votes: number
  disabled: boolean
}

export function VoteSubmitButton({ votes, disabled }: VoteSubmitButtonProps) {
  if (votes > 0) {
    return <VoteSendingBtn disabled={disabled}> {votes} votes need saving</VoteSendingBtn>
  }
  return null
}
