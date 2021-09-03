import React, { useState } from 'react'
import styled from 'styled-components'
import { useEthers } from '@usedapp/core'
import { Modal, Networks, Button } from '@status-waku-voting/react-components'

export function ProposalHeader() {
  const { activateBrowserWallet, account } = useEthers()
  const [showProposeCreation, setShowProposeCreation] = useState(false)
  const [selectConnect, setSelectConnect] = useState(false)

  return (
    <Wrapper>
      <Header>
        <Heading>Your voice has real power</Heading>
        <HeaderText>
          Take part in a decentralised governance by voting on proposals provided by community or creating your own.
        </HeaderText>
      </Header>
      {account ? (
        <CreateButton onClick={() => setShowProposeCreation(true)}>Create proposal</CreateButton>
      ) : (
        <CreateButton
          onClick={() => {
            if ((window as any).ethereum) {
              activateBrowserWallet()
            } else setSelectConnect(true)
          }}
        >
          Connect to vote
        </CreateButton>
      )}
      {selectConnect && (
        <Modal heading="Connect" setShowModal={setSelectConnect}>
          <Networks />
        </Modal>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 680px;

  @media (max-width: 425px) {
    position: fixed;
    padding: 12px 16px 0;
    width: 100%;
    background: #f8faff;
  }
`

const Heading = styled.h1`
  font-weight: bold;
  font-size: 28px;
  line-height: 38px;
  letter-spacing: -0.4px;
  margin: 0;
  margin-bottom: 8px;

  @media (max-width: 425px) {
    font-size: 22px;
    line-height: 30px;
  }
`

const HeaderText = styled.p`
  font-size: 22px;
  line-height: 32px;
  margin: 0;
  margin-bottom: 24px;

  @media (max-width: 425px) {
    font-size: 13px;
    line-height: 18px;
  }
`

const CreateButton = styled(Button)`
  width: 343px;
  background-color: #ffb571;
  color: #ffffff;
  font-weight: bold;
  font-size: 15px;
  line-height: 24px;
  margin-bottom: 48px;
  &:not(:disabled):hover {
    background: #a53607;
  }
  &:not(:disabled):active {
    background: #f4b77e;
  }
  @media (max-width: 425px) {
    position: fixed;
    bottom: 0;
    z-index: 10;
    margin-bottom: 16px;
    width: calc(100% - 32px);
    padding: 0;
  }
`
