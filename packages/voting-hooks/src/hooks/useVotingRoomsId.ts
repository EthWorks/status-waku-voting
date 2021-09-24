import { id } from '@ethersproject/hash'
import { WakuVoting } from '@status-waku-voting/core'
import { VotingRoom } from '@status-waku-voting/core/dist/esm/src/types/PollType'
import React, { useEffect, useRef, useState } from 'react'

export function useVotingRoomsId(wakuVoting: WakuVoting) {
  const [votes, setVotes] = useState<number[]>([])
  const votesLength = useRef(0)
  useEffect(() => {
    const interval = setInterval(async () => {
      const newRooms = (await wakuVoting.getVotingRooms()).map((e) => e.id)
      if (newRooms.length != votesLength.current) {
        setVotes(newRooms)
        votesLength.current = newRooms.length
      }
    }, 10000)
    setVotes([])
    wakuVoting.getVotingRooms().then((e) => {
      setVotes(e.map((vote) => vote.id))
      votesLength.current = e.length
    })
    return () => clearInterval(interval)
  }, [wakuVoting])
  return votes
}
