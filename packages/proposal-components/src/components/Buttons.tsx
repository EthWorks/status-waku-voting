import { Button } from '@status-waku-voting/react-components'
import styled from 'styled-components'

export const Btn = styled(Button)`
  padding: 11px 0;
  font-weight: 500;
  line-height: 22px;
  text-align: center;
`

export const VoteBtn = styled(Btn)`
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
