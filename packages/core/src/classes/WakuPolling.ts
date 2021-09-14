import { Waku } from 'js-waku'
import { JsonRpcSigner } from '@ethersproject/providers'
import { PollInitMsg } from '../models/PollInitMsg'
import { PollType } from '../types/PollType'
import { BigNumber, Wallet } from 'ethers'
import { WakuMessage } from 'js-waku'
import { TimedPollVoteMsg } from '../models/TimedPollVoteMsg'
import { DetailedTimedPoll } from '../models/DetailedTimedPoll'
import { createWaku } from '../utils/createWaku'
import { WakuMessaging } from './WakuMessaging'
import { Provider } from '@ethersproject/providers'

export enum MESSEGAGE_SENDING_RESULT {
  ok = 0,
  notEnoughToken = 1,
  errorCreatingMessage = 2,
  pollNotFound = 3,
}

export class WakuPolling extends WakuMessaging {
  protected constructor(
    appName: string,
    tokenAddress: string,
    waku: Waku,
    provider: Provider,
    chainId: number,
    multicall: string
  ) {
    super(appName, tokenAddress, waku, provider, chainId, multicall)
    this.wakuMessages['pollInit'] = {
      topic: `/${this.appName}/waku-polling/timed-polls-init/proto/`,
      hashMap: {},
      tokenCheckArray: ['owner'],
      arr: [],
      updateFunction: (msg: WakuMessage[]) =>
        this.decodeMsgAndSetArray(
          msg,
          PollInitMsg.decode,
          this.wakuMessages['pollInit'],
          (e) => e.endTime > Date.now()
        ),
    }
    this.wakuMessages['pollVote'] = {
      topic: `/${this.appName}/waku-polling/votes/proto/`,
      hashMap: {},
      tokenCheckArray: ['voter'],
      arr: [],
      updateFunction: (msg: WakuMessage[]) =>
        this.decodeMsgAndSetArray(msg, TimedPollVoteMsg.decode, this.wakuMessages['pollVote']),
    }
    this.setObserver()
  }

  public static async create(
    appName: string,
    tokenAddress: string,
    provider: Provider,
    multicall: string,
    waku?: Waku
  ) {
    const network = await provider.getNetwork()
    const wakuPolling = new WakuPolling(
      appName,
      tokenAddress,
      await createWaku(waku),
      provider,
      network.chainId,
      multicall
    )
    return wakuPolling
  }

  public async createTimedPoll(
    signer: JsonRpcSigner | Wallet,
    question: string,
    answers: string[],
    pollType: PollType,
    minToken?: BigNumber,
    endTime?: number
  ) {
    const address = await signer.getAddress()
    await this.updateBalances(address)
    if (this.addressesBalances[address] && this.addressesBalances[address]?.gt(minToken ?? BigNumber.from(0))) {
      const pollInit = await PollInitMsg.create(signer, question, answers, pollType, this.chainId, minToken, endTime)
      if (pollInit) {
        await this.sendWakuMessage(this.wakuMessages['pollInit'], pollInit)
        return MESSEGAGE_SENDING_RESULT.ok
      } else {
        return MESSEGAGE_SENDING_RESULT.errorCreatingMessage
      }
    } else {
      return MESSEGAGE_SENDING_RESULT.notEnoughToken
    }
  }

  public async sendTimedPollVote(
    signer: JsonRpcSigner | Wallet,
    pollId: string,
    selectedAnswer: number,
    tokenAmount?: BigNumber
  ) {
    const address = await signer.getAddress()
    const poll = this.wakuMessages['pollInit'].arr.find((poll: PollInitMsg): poll is PollInitMsg => poll.id === pollId)
    if (poll) {
      await this.updateBalances(address)
      if (this.addressesBalances[address] && this.addressesBalances[address]?.gt(poll.minToken ?? BigNumber.from(0))) {
        const pollVote = await TimedPollVoteMsg.create(signer, pollId, selectedAnswer, this.chainId, tokenAmount)
        if (pollVote) {
          await this.sendWakuMessage(this.wakuMessages['pollVote'], pollVote)
        } else {
          return MESSEGAGE_SENDING_RESULT.errorCreatingMessage
        }
      } else {
        return MESSEGAGE_SENDING_RESULT.notEnoughToken
      }
    } else {
      return MESSEGAGE_SENDING_RESULT.pollNotFound
    }
  }

  public async getDetailedTimedPolls() {
    await this.updateBalances()
    return this.wakuMessages['pollInit'].arr
      .map((poll: PollInitMsg) => {
        if (
          this.addressesBalances[poll.owner] &&
          this.addressesBalances[poll.owner]?.gt(poll.minToken ?? BigNumber.from(0))
        ) {
          return new DetailedTimedPoll(
            poll,
            this.wakuMessages['pollVote'].arr
              .filter(
                (vote: TimedPollVoteMsg) =>
                  vote.pollId === poll.id &&
                  this.addressesBalances[poll.owner] &&
                  this.addressesBalances[vote.voter]?.gt(poll.minToken ?? BigNumber.from(0))
              )
              .filter((e): e is TimedPollVoteMsg => !!e)
          )
        } else {
          return undefined
        }
      })
      .filter((e): e is DetailedTimedPoll => !!e)
  }
}
