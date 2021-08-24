pragma solidity ^0.8.5;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

contract VotingContract {
    using ECDSA for bytes32;
    using SafeMath for uint256;

    uint256 private constant VOTING_LENGTH = 1000;

    bytes32 constant EIP712DOMAIN_TYPEHASH =
        keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)');

    struct EIP712Domain {
        string name;
        string version;
        uint256 chainId;
        address verifyingContract;
    }

    enum VoteType {
        REMOVE,
        ADD
    }

    struct VotingRoom {
        uint256 startBlock;
        uint256 endAt;
        string question;
        uint256 totalVotesFor;
        uint256 totalVotesAgainst;
        address[] voters;
    }

    event VotingRoomStarted(uint256 roomId, string question);

    IERC20 public token;

    mapping(uint256 => mapping(address => bool)) voted;
    VotingRoom[] public votingRooms;

    bytes32 DOMAIN_SEPARATOR;

    function hash(EIP712Domain memory eip712Domain) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    EIP712DOMAIN_TYPEHASH,
                    keccak256(bytes(eip712Domain.name)),
                    keccak256(bytes(eip712Domain.version)),
                    eip712Domain.chainId,
                    eip712Domain.verifyingContract
                )
            );
    }

    constructor(IERC20 _address) {
        token = _address;
        DOMAIN_SEPARATOR = hash(
            EIP712Domain({ name: 'Voting Contract', version: '1', chainId: 1, verifyingContract: address(this) })
        );
    }

    function getVotingRooms() public view returns (VotingRoom[] memory) {
        return votingRooms;
    }

    function listRoomVoters(uint256 roomId) public view returns (address[] memory) {
        require(roomId < votingRooms.length, 'No room');
        return votingRooms[roomId].voters;
    }

    function initializeVotingRoom(string calldata question, uint256 voteAmount) public {
        require(token.balanceOf(msg.sender) >= voteAmount, 'not enough token');
        VotingRoom memory newVotingRoom;
        newVotingRoom.startBlock = block.number;
        newVotingRoom.endAt = block.timestamp.add(VOTING_LENGTH);
        newVotingRoom.question = question;
        newVotingRoom.totalVotesFor = voteAmount;
        voted[votingRooms.length][msg.sender] = true;

        votingRooms.push(newVotingRoom);
        votingRooms[votingRooms.length - 1].voters.push(msg.sender);

        emit VotingRoomStarted(votingRooms.length - 1, question);
    }

    event VoteCast(uint256 roomId, address voter);
    event NotEnoughToken(uint256 roomId, address voter);

    bytes32 constant VOTE_TYPEHASH = keccak256(
        "Mail(Person from,Person to,string contents)Person(string name,address wallet)"
    );

    function hash(Vote calldata vote) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            VOTE_TYPEHASH,
            keccak256(abi.encode(vote.voter)),
            keccak256(abi.encode(vote.roomIdAndType)),
            keccak256(abi.encode(vote.sntAmount))
        ));
    }

    function verify(Vote calldata vote, bytes32 r, bytes32 vs) internal view returns (bool) {
        // Note: we need to use `encodePacked` here instead of `encode`.
        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            hash(vote)
        ));
        return digest.recover(abi.encode(r, vs)) == vote.voter;
    }

    struct Vote {
        address voter;
        uint256 roomIdAndType;
        uint256 sntAmount;
    }

    struct Signature {
        bytes32 r;
        bytes32 vs;
    }

    function castVotes(Vote[] calldata votes, Signature[] calldata sigs) public {
        for (uint256 i = 0; i < votes.length; i++) {
            Vote calldata vote = votes[i];
            uint256 roomId = vote.roomIdAndType >> 1;
            require(roomId < votingRooms.length, 'vote not found');
            if (verify(vote, sigs[i].r, sigs[i].vs)) {
                require(votingRooms[roomId].endAt > block.timestamp, 'vote closed');
                if (voted[roomId][vote.voter] == false) {
                    if (token.balanceOf(vote.voter) >= vote.sntAmount) {
                        if (vote.roomIdAndType & 1 == 1) {
                            votingRooms[roomId].totalVotesFor = votingRooms[roomId].totalVotesFor.add(vote.sntAmount);
                        } else {
                            votingRooms[roomId].totalVotesAgainst = votingRooms[roomId].totalVotesAgainst.add(
                                vote.sntAmount
                            );
                        }
                        votingRooms[roomId].voters.push(vote.voter);
                        voted[roomId][vote.voter] = true;
                        emit VoteCast(roomId, vote.voter);
                    } else {
                        emit NotEnoughToken(roomId, vote.voter);
                    }
                }
            }
        }
    }
}
