import React, { useEffect, useState } from 'react'
import { WakuPolling } from '@status-waku-voting/react-components'
import styled from 'styled-components'
import { TopBar } from '../components/TopBar'
import pollingIcon from '../assets/images/pollingIcon.svg'
import { JsonRpcSigner } from '@ethersproject/providers'
import { useEthers } from '@usedapp/core'
import { BigNumber} from 'ethers'
const typedData = {
    types: {
        EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
        ],
        Vote: [
            { name: 'roomIdAndType', type: 'uint256' },
            { name: 'sntAmount', type: 'uint256' },
            { name: 'voter', type: 'address' },
        ],
    },
    primaryType: 'Vote',
    domain: {
        name: 'Voting Contract',
        version: '1',
        chainId: 1,
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    },
    message: {} as any
  }

export function Polling() {
  const { account, library } = useEthers()
  const [signer, setSigner] = useState<undefined | JsonRpcSigner>(undefined)

  useEffect(() => {
    setSigner(library?.getSigner())
  }, [account])
  typedData.message = {voter:account, roomIdAndType: BigNumber.from(123).toHexString(),sntAmount:BigNumber.from(123).toHexString()}
  return (
    <Wrapper>
      <TopBar logo={pollingIcon} title={'Polling Dapp'} />
      <WakuPolling appName={'testApp_'} signer={signer} localhost={process.env.ENV === 'localhost'} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`
