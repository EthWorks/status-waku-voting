import React, { useState, useEffect } from 'react'
import WakuVoting from '@status-waku-voting/core'
import { providers } from 'ethers'
import { PollList } from './PollList'
import styled from 'styled-components'
import { PollCreation } from './PollCreation'
import { Button } from '../components/misc/Buttons'
import { JsonRpcSigner } from '@ethersproject/providers'

type WakuPollingProps = {
  appName: string
  signer: JsonRpcSigner | undefined
}

function WakuPolling({ appName, signer }: WakuPollingProps) {
  const [wakuVoting, setWakuVoting] = useState<WakuVoting | undefined>(undefined)
  const [showPollCreation, setShowPollCreation] = useState(false)

  useEffect(() => {
    WakuVoting.create(appName, '0x01').then((e) => setWakuVoting(e))
  }, [])

  return (
    <Wrapper onClick={() => showPollCreation && setShowPollCreation(false)}>
      {showPollCreation && signer && (
        <PollCreation signer={signer} wakuVoting={wakuVoting} setShowPollCreation={setShowPollCreation} />
      )}
      <CreatePollButton disabled={!signer} onClick={() => setShowPollCreation(true)}>
        Create a poll
      </CreatePollButton>
      <PollList wakuVoting={wakuVoting} signer={signer} />
    </Wrapper>
  )
}

const CreatePollButton = styled(Button)`
  width: 343px;
  margin-bottom: 44px;
  background-color: #ffb571;
  color: #ffffff;
  font-weight: bold;
  font-size: 15px;
  line-height: 24px;

  &:hover {
    border: 1px solid #a53607;
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 180px;
  height: 100%;
`

export default WakuPolling
