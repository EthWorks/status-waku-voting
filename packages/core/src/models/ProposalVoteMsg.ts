import { utils } from 'ethers'
import protons, { ProposalVote } from 'protons'
import { BigNumber, Wallet } from 'ethers'
import { JsonRpcSigner } from '@ethersproject/providers'
import { createSignFunction } from '../utils/createSignFunction'
const proto = protons(`
message ProposalVote {
    bytes voter = 1; 
    int64 timestamp = 2;
    int8 answer = 3;
    bytes roomId = 4
    bytes tokenAmount = 5;
    bytes signature = 6;
}
`)


type Message = {
  roomIdAndType: string
  tokenAmount: string
  voter: string
}


export function createSignMsgParams(message: Message, chainId: number, verifyingContract: string) {
  const msgParams: any = {
    domain: {
      name: 'Waku proposal',
      version: '1',
      chainId,
      verifyingContract
    },
    message: {
      ...message
    },
    primaryType: 'Vote',
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Vote: [
        { name: 'roomIdAndType', type: 'string' },
        { name: 'tokenAmount', type: 'string' },
        { name: 'voter', type: 'string' },
      ],
    },
  }
  return msgParams
}

export class ProposalVoteMsg {
  public roomId: number
  public voter: string
  public timestamp: number
  public answer: number
  public tokenAmount: BigNumber
  public signature: string
  public id: string
  public chainId: number

  constructor(signature: string, roomId: number, voter: string, answer: number, tokenAmount: BigNumber, chainId: number, timestamp: number) {
    this.id = utils.id([voter, timestamp, signature].join())
    this.roomId = roomId
    this.voter = voter
    this.timestamp = timestamp
    this.answer = answer
    this.tokenAmount = tokenAmount
    this.signature = signature
    this.chainId = chainId
  }

  static async _createWithSignFunction(
    signer: JsonRpcSigner | Wallet,
    roomId: number,
    answer: number,
    chainId: number,
    tokenAmount: BigNumber,
    contractAddress: string
  ): Promise<ProposalVoteMsg | undefined> {
    const signFunction = createSignFunction(signer)
    const voter = await signer.getAddress()
    const msg = { roomIdAndType:BigNumber.from(roomId).mul(2).add(answer).toHexString(), tokenAmount:tokenAmount.toHexString(), voter }
    const params = [msg.voter, JSON.stringify(createSignMsgParams(msg, chainId, contractAddress))]
    const signature = await signFunction(params)
    if (signature) {
      return new ProposalVoteMsg(signature, roomId,voter,answer,tokenAmount,chainId, Date.now())
    } else {
      return undefined
    }
  }

  encode() {
    try {
      const voteProto: ProposalVote = {
        voter: utils.arrayify(this.voter),
        timestamp: this.timestamp,
        answer: this.answer,
        tokenAmount: utils.arrayify(this.tokenAmount),
        roomId: utils.arrayify(BigNumber.from(this.roomId)),
        signature: utils.arrayify(this.signature),
      }
      return proto.ProposalVote.encode(voteProto)
    } catch {
      return undefined
    }
  }

  static decode(
    rawPayload: Uint8Array | undefined,
    timestamp: Date | undefined,
    chainId: number,
    verifyFunction?: (params: any, address: string) => boolean
  ) {
    try {
      const payload = proto.TimedPollVote.decode(rawPayload)
      if (!timestamp || !payload.timestamp || timestamp?.getTime() != payload.timestamp) {
        return undefined
      }
      const signature = utils.hexlify(payload.signature)

      const msg = {
        pollId: utils.hexlify(payload.pollId),
        answer: payload.answer,
        voter: utils.getAddress(utils.hexlify(payload.voter)),
        timestamp: payload.timestamp,
        tokenAmount: payload.tokenAmount ? BigNumber.from(payload.tokenAmount) : undefined,
      }

      const params = {
        data: createSignMsgParams(msg, chainId),
        sig: signature,
      }
      if (verifyFunction ? !verifyFunction : !verifySignature(params, msg.voter)) {
        return undefined
      }
      return new TimedPollVoteMsg(signature, msg, chainId)
    } catch {
      return undefined
    }
  }
}