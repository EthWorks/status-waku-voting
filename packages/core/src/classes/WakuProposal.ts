
import { VotingContract } from '@status-waku-voting/contracts/abi'
import { WakuVoting } from './WakuVoting'
import { Contract, Wallet, BigNumber } from 'ethers'
import { Waku } from 'js-waku'
import { Provider } from '@ethersproject/abstract-provider'
import { createWaku } from '../utils/createWaku'
import { JsonRpcSigner } from '@ethersproject/providers'

const ABI = [
    'function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)',
]


export class WakuProposal extends WakuVoting {
    private multicall: Contract
    private votingContract: Contract

    constructor(appName: string, votingContract: Contract, token: string, waku: Waku, provider: Provider, chainId: number, multicallAddress: string) {
        super(appName, token, waku, provider, chainId)
        this.votingContract = votingContract
        this.multicall = new Contract(this.multicall, ABI, this.provider)
    }

    public static async create(
        appName: string,
        contractAddress: string,
        provider: Provider,
        multicall: string,
        waku?: Waku
    ) {
        const network = await provider.getNetwork()
        const votingContract = new Contract(contractAddress, VotingContract.abi, provider)
        const tokenAddress = votingContract.token()
        return new WakuProposal(
            appName,
            votingContract,
            tokenAddress,
            await createWaku(waku),
            provider,
            network.chainId,
            multicall
        )
    }

    public async createProposal(
        signer: JsonRpcSigner | Wallet,
        question: string,
        descripiton: string,
        tokenAmount: BigNumber
    ) {
        await this.votingContract.initializeVotingRoom(question, descripiton, tokenAmount)
    }

    private lastPolls: any[] = []
    private lastGetPollsBlockNumber = 0

    public async getPolls() {
        const blockNumber = await this.provider.getBlockNumber()
        if (blockNumber != this.lastGetPollsBlockNumber) {
            this.lastGetPollsBlockNumber = blockNumber
            this.lastPolls = await this.votingContract.getVotingRooms()
        }
    }

    public async sendWakuVote(signer: JsonRpcSigner | Wallet,
        answer: Number,
        tokenAmount: BigNumber,
        roomId: number) {
            
    }

}