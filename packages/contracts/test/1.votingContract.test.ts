import { expect, use } from 'chai'
import { loadFixture, deployContract, MockProvider, solidity } from 'ethereum-waffle'
import { VotingContract, ERC20Mock } from '../abi'
import { utils, Wallet, Contract } from 'ethers'

import { BigNumber } from '@ethersproject/bignumber'

use(solidity)

const typedData = {
  types: {
      EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
      ],
      Vote: [
          { name: 'voter', type: 'address' },
          { name: 'roomIdAndType', type: 'uint256' },
          { name: 'sntAmount', type: 'uint256' }
      ],
  },
  primaryType: 'Vote',
  domain: {
      name: 'Voting Contract',
      version: '1',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  },
}

const getSignedMessages = async (
  alice: Wallet,
  firstAddress: Wallet,
  secondAddress: Wallet
): Promise<{ messages: any[]; signedMessages: any[] }> => {
  const votes = [
    {
      voter: alice,
      vote: 1,
      sntAmount: BigNumber.from(100),
      sessionID: 0,
    },
    {
      voter: firstAddress,
      vote: 0,
      sntAmount: BigNumber.from(100),
      sessionID: 0,
    },
    {
      voter: secondAddress,
      vote: 1,
      sntAmount: BigNumber.from(100),
      sessionID: 0,
    },
  ]
  const types = ['address', 'uint256', 'uint256']
  const messages = votes.map((vote) => {
    return {
    voter: vote.voter.address,
    roomIdAndType: BigNumber.from(vote.sessionID).mul(2).add(vote.vote),
    sntAmount: vote.sntAmount,
  }
})

  const signedMessages = await Promise.all(
    messages.map(async (message, idx) => {
      const returnArray = [...message]
      const signature = utils.splitSignature(
        await votes[idx].voter.signMessage(utils.arrayify(utils.solidityPack(types, message)))
      )
      returnArray.push(signature.r)
      returnArray.push(signature._vs)
      return returnArray
    })
  )

  return { messages, signedMessages }
}

const vote = async (room: number, type: number, signer: Wallet, contract: Contract, provider: MockProvider) => {
  const types = ['address', 'uint256', 'uint256']
  const vote = [signer.address, BigNumber.from(room).mul(2).add(type), BigNumber.from(100)]
  const signature = utils.splitSignature(await signer.signMessage(utils.arrayify(utils.solidityPack(types, vote))))
  const votes = [[...vote, signature.r, signature._vs]]
  await contract.castVotes(votes)
}

describe('Contract', () => {
  async function fixture([alice, firstAddress, secondAddress]: any[], provider: any) {
    const erc20 = await deployContract(alice, ERC20Mock, ['MSNT', 'Mock SNT', alice.address, 100000])
    await erc20.transfer(firstAddress.address, 10000)
    await erc20.transfer(secondAddress.address, 10000)
    const contract = await deployContract(alice, VotingContract, [erc20.address])
    await provider.send('evm_mine', [Math.floor(Date.now() / 1000)])
    typedData.domain.verifyingContract = contract.address
    return { contract, alice, firstAddress, secondAddress, provider }
  }
  loadFixture(fixture)

  describe('Voting Room', () => {
    describe('initialization', () => {
      it('initializes', async () => {
        const { contract } = await loadFixture(fixture)
        await expect(await contract.initializeVotingRoom('test', BigNumber.from(100)))
          .to.emit(contract, 'VotingRoomStarted')
          .withArgs(0, 'test')
        await expect(await contract.initializeVotingRoom('test2', BigNumber.from(100)))
          .to.emit(contract, 'VotingRoomStarted')
          .withArgs(1, 'test2')
      })

      it('not enough token', async () => {
        const { contract } = await loadFixture(fixture)
        await expect(contract.initializeVotingRoom('test', BigNumber.from(10000000000000))).to.be.revertedWith(
          'not enough token'
        )
      })
    })

    it('gets', async () => {
      const { contract } = await loadFixture(fixture)
      await contract.initializeVotingRoom('T1', BigNumber.from(100))

      expect((await contract.votingRooms(0))[2]).to.eq('T1')
      expect((await contract.votingRooms(0))[3]).to.deep.eq(BigNumber.from(100))
      expect((await contract.votingRooms(0))[4]).to.deep.eq(BigNumber.from(0))

      await contract.initializeVotingRoom('T2', BigNumber.from(200))
      expect((await contract.votingRooms(1))[2]).to.eq('T2')
      expect((await contract.votingRooms(1))[3]).to.deep.eq(BigNumber.from(200))
      expect((await contract.votingRooms(1))[4]).to.deep.eq(BigNumber.from(0))
    })

    it('reverts no room', async () => {
      const { contract } = await loadFixture(fixture)
      await expect(contract.votingRooms(1)).to.be.reverted
      await expect(contract.votingRooms(0)).to.be.reverted
      await contract.initializeVotingRoom('T2', BigNumber.from(200))
      await expect(contract.votingRooms(1)).to.be.reverted
    })
  })
  describe('helpers', () => {
    it('get voting rooms', async () => {
      const { contract, firstAddress, secondAddress, provider } = await loadFixture(fixture)
      await contract.initializeVotingRoom('T1', BigNumber.from(100))

      await contract.initializeVotingRoom('T2', BigNumber.from(200))
      const votingRooms = await contract.getVotingRooms()

      expect(votingRooms.length).to.eq(2)

      expect(votingRooms[0][2]).to.eq('T1')
      expect(votingRooms[0][3]).to.deep.eq(BigNumber.from(100))
      expect(votingRooms[0][4]).to.deep.eq(BigNumber.from(0))

      expect(votingRooms[1][2]).to.eq('T2')
      expect(votingRooms[1][3]).to.deep.eq(BigNumber.from(200))
      expect(votingRooms[1][4]).to.deep.eq(BigNumber.from(0))
    })
  })

  describe('voting', () => {
    it('check voters', async () => {
      const { contract, alice, firstAddress, secondAddress } = await loadFixture(fixture)
      const { signedMessages } = await getSignedMessages(alice, firstAddress, secondAddress)
      await contract.initializeVotingRoom('0xabA1eF51ef4aE360a9e8C9aD2d787330B602eb24', BigNumber.from(100))

      expect(await contract.listRoomVoters(0)).to.deep.eq([alice.address])
      await contract.castVotes(signedMessages.slice(2))
      expect(await contract.listRoomVoters(0)).to.deep.eq([alice.address, secondAddress.address])
    })

    it('not enough tokens', async () => {
      const { contract, firstAddress } = await loadFixture(fixture)
      await contract.initializeVotingRoom('test', BigNumber.from(100))

      const types = ['address', 'uint256', 'uint256']
      const message = [firstAddress.address, BigNumber.from(0).mul(2).add(1), BigNumber.from(100000000000)]

      const signedMessage = [...message]
      const signature = utils.splitSignature(
        await firstAddress.signMessage(utils.arrayify(utils.solidityPack(types, message)))
      )
      signedMessage.push(signature.r)
      signedMessage.push(signature._vs)

      await expect(await contract.castVotes([signedMessage]))
        .to.emit(contract, 'NotEnoughToken')
        .withArgs(0, firstAddress.address)

      const votingRoom = await contract.votingRooms(0)
      expect(votingRoom[2]).to.eq('test')
      expect(votingRoom[3]).to.deep.eq(BigNumber.from(100))
      expect(votingRoom[4]).to.deep.eq(BigNumber.from(0))
    })

    it('success', async () => {
      const { contract, alice, firstAddress, secondAddress } = await loadFixture(fixture)
      const { signedMessages } = await getSignedMessages(alice, firstAddress, secondAddress)
      await contract.initializeVotingRoom('test', BigNumber.from(100))
      await contract.castVotes(signedMessages)

      const votingRoom = await contract.votingRooms(0)
      expect(votingRoom[2]).to.eq('test')
      expect(votingRoom[3]).to.deep.eq(BigNumber.from(200))
      expect(votingRoom[4]).to.deep.eq(BigNumber.from(100))
    })

    it('double vote', async () => {
      const { contract, alice, firstAddress, secondAddress } = await loadFixture(fixture)
      const { signedMessages } = await getSignedMessages(alice, firstAddress, secondAddress)
      await contract.initializeVotingRoom('test', BigNumber.from(100))
      await contract.castVotes(signedMessages)
      await contract.castVotes(signedMessages)

      const votingRoom = await contract.votingRooms(0)
      expect(votingRoom[2]).to.eq('test')
      expect(votingRoom[3]).to.deep.eq(BigNumber.from(200))
      expect(votingRoom[4]).to.deep.eq(BigNumber.from(100))
    })

    it('random bytes', async () => {
      const { contract } = await loadFixture(fixture)
      await contract.initializeVotingRoom('test', BigNumber.from(100))
      await expect(contract.castVotes([new Uint8Array([12, 12, 12])])).to.be.reverted
    })

    it('none existent room', async () => {
      const { contract, alice, firstAddress, secondAddress } = await loadFixture(fixture)
      const { signedMessages } = await getSignedMessages(alice, firstAddress, secondAddress)
      await expect(contract.castVotes(signedMessages)).to.be.reverted
    })

    it('old room', async () => {
      const { contract, alice, firstAddress, secondAddress, provider } = await loadFixture(fixture)
      const { signedMessages } = await getSignedMessages(alice, firstAddress, secondAddress)
      await contract.initializeVotingRoom('test', BigNumber.from(100))
      await provider.send('evm_mine', [Math.floor(Date.now() / 1000 + 2000)])
      await expect(contract.castVotes(signedMessages)).to.be.reverted
    })

    it('wrong signature', async () => {
      const { contract, alice, firstAddress, secondAddress, provider } = await loadFixture(fixture)
      const { messages } = await getSignedMessages(alice, firstAddress, secondAddress)
      const types = ['address', 'uint256', 'uint256']
      await contract.initializeVotingRoom('test', BigNumber.from(100))
      await provider.send('evm_mine', [Math.floor(Date.now() / 1000 + 2000)])

      const signedMessages = await Promise.all(
        messages.map(async (message) => {
          const returnArray = [...message]
          const signature = utils.splitSignature(
            await alice.signMessage(utils.arrayify(utils.solidityPack(types, message)))
          )
          returnArray.push(signature.r)
          returnArray.push(signature._vs)
          return returnArray
        })
      )

      await expect(contract.castVotes(signedMessages)).to.be.reverted
    })
  })
})