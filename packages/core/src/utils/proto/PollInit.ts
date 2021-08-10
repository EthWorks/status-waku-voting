import protons, { PollInit } from 'protons'
import { PollType } from '../../types/PollType'
import { utils } from 'ethers'
import { PollInitMsg } from '../../models/PollInitMsg'

const proto = protons(`
message PollInit {
    bytes owner = 1; 
    int64 timestamp = 2;
    string question = 3;
    repeated string answers = 4;
    enum PollType {
        WEIGHTED = 0;
        NON_WEIGHTED = 1;
    }
    PollType pollType = 5;
    optional bytes minToken = 6;
    int64 endTime = 7;
    bytes signature = 8;
}
`)

export function encode(pollInit: PollInitMsg) {
  try {
    const arrayify = utils.arrayify
    const pollProto: PollInit = {
      owner: arrayify(pollInit.owner),
      timestamp: pollInit.timestamp,
      question: pollInit.question,
      answers: pollInit.answers,
      pollType: pollInit.pollType,
      endTime: pollInit.endTime,
      signature: arrayify(pollInit.signature),
    }

    if (pollInit.pollType === PollType.NON_WEIGHTED) {
      if (pollInit.minToken) {
        pollProto.minToken = arrayify(pollInit.minToken)
      } else {
        return undefined
      }
    }
    return proto.PollInit.encode(pollProto)
  } catch {
    return undefined
  }
}

export function decode(payload: Uint8Array, timestamp: Date | undefined) {
  try {
    const msg = proto.PollInit.decode(payload)
    if (!timestamp || timestamp.getTime() != msg.timestamp) {
      console.log('wrong time')
      return undefined
    }
    if (
      msg.owner &&
      msg.timestamp &&
      msg.question &&
      msg.answers &&
      msg.pollType != undefined &&
      msg.endTime &&
      msg.signature
    ) {
      return PollInitMsg.fromProto(msg)
    }
  } catch {
    return undefined
  }

  return undefined
}

export default { encode, decode }
