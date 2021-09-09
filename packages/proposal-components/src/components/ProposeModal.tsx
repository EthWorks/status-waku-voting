import React, { useState } from 'react'
import styled from 'styled-components'
import { ProposingBtn } from './Buttons'
import { Input } from './Input'
import { blueTheme } from '@status-waku-voting/react-components/dist/esm/src/style/themes'

interface ProposeModalProps {
  availableAmount: number
  title: string
  text: string
  setShowProposeVoteModal: (val: boolean) => void
  setTitle: (val: string) => void
  setText: (val: string) => void
}

export function ProposeModal({
  availableAmount,
  title,
  text,
  setShowProposeVoteModal,
  setTitle,
  setText,
}: ProposeModalProps) {
  return (
    <ProposingData>
      {availableAmount < 10000 && (
        <ProposingInfo>
          <span>⚠️</span>
          <InfoText>You need at least 10,000 ABC to create a proposal!</InfoText>
        </ProposingInfo>
      )}
      <Label>
        Title
        <ProposingInput
          type="text"
          placeholder="E.g. Change the rate of the token issuance"
          value={title}
          onInput={(e) => {
            setTitle(e.currentTarget.value)
          }}
        />
      </Label>

      <Label>
        Description
        <ProposingTextInput
          type="text"
          placeholder="Describe your proposal as detailed as you can in 440 characters."
          value={text}
          onInput={(e) => {
            setText(e.currentTarget.value)
          }}
        />
      </Label>

      <ProposingBtn disabled={!text || !title} theme={blueTheme} onClick={() => setShowProposeVoteModal(true)}>
        Continue
      </ProposingBtn>
    </ProposingData>
  )
}

export const VoteProposeWrap = styled.div`
  margin-top: 32px;

  @media (max-width: 600px) {
    margin-top: 0;
  }
`

export const ProposingData = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;
`

export const ProposingInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 600px) {
    max-width: 525px;
  }

  & > span {
    font-size: 24px;
    line-height: 32px;
    margin-right: 16px;
  }
`

const InfoText = styled.div`
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
`

const ProposingInput = styled(Input)`
  width: 100%;
  padding: 11px 20px;
  margin-bottom: 32px;
  margin-top: 10px;
  font-size: 15px;
  line-height: 22px;
  height: 66px;
  text-align: left;

  &::-webkit-input-placeholder {
    white-space: pre-line;
  }

  &::-moz-placeholder {
    white-space: pre-line;
  }

  &::-ms-input-placeholder {
    white-space: pre-line;
  }
`
const ProposingTextInput = styled(ProposingInput)`
  height: 220px;
`
const Label = styled.label`
  width: 100%;
  font-size: 15px;
  line-height: 22px;
  align-self: flex-start;
`
