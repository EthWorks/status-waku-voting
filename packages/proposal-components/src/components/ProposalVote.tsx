import React from 'react'
import styled from 'styled-components'

export function ProposalVote() {
  return <Card></Card>
}

export const Card = styled.div`
  display: flex;
  align-items: stretch;
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
