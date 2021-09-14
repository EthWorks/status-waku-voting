import { blueTheme } from '@status-waku-voting/react-components/dist/esm/src/style/themes'
import React, { useState } from 'react'
import styled from 'styled-components'
import { ProposingBtn } from '../Buttons'
import { CardHeading, CardText } from '../ProposalInfo'
import { InfoText, Label, ProposingData, ProposingInfo, ProposingInput, ProposingTextInput } from '../ProposeModal'

interface ProposeVoteModalProps {
  availableAmount: number
  title: string
  text: string
  setShowModal: (val: boolean) => void
  setTitle: (val: string) => void
  setText: (val: string) => void
}

export function ProposeMobile({
  availableAmount,
  title,
  text,
  setShowModal,
  setTitle,
  setText,
}: ProposeVoteModalProps) {
  const insufficientFunds = availableAmount < 10000
  // const [title, setTitle] = useState('')
  // const [text, setText] = useState('')

  return (
    <ProposingDataMobile>
      {insufficientFunds && (
        <ProposingInfo>
          <span>⚠️</span>
          <InfoText>You need at least 10,000 ABC to create a proposal!</InfoText>
        </ProposingInfo>
      )}
      <Label>
        Title
        <ProposingInput
          cols={2}
          maxLength={90}
          placeholder="E.g. Change the rate of the token issuance"
          value={title}
          onInput={(e) => {
            setTitle(e.currentTarget.value)
          }}
          required
        />
      </Label>

      <Label>
        Description
        <ProposingTextInput
          maxLength={440}
          placeholder="Describe your proposal as detailed as you can in 440 characters."
          value={text}
          onInput={(e) => {
            setText(e.currentTarget.value)
          }}
          required
        />
      </Label>

      <ProposingBtn
        disabled={!text || !title || insufficientFunds}
        theme={blueTheme}
        // onClick={() => setShowProposeVoteModal(true)}
      >
        Continue
      </ProposingBtn>
    </ProposingDataMobile>
  )
}

const ProposingDataMobile = styled(ProposingData)`
  padding-top: 118px;
`
export const VoteProposeWrap = styled.div`
  margin-bottom: 32px;
  width: 100%;
`

const ProposingCardHeading = styled(CardHeading)`
  margin-bottom: 16px;
`
const ProposingCardText = styled(CardText)`
  margin-bottom: 0;
`
