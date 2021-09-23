import { WakuPolling } from '@status-waku-voting/core'
import { DetailedTimedPoll } from '@status-waku-voting/core/dist/esm/src/models/DetailedTimedPoll'
import React, { useEffect, useState } from 'react'

export function usePollList(wakuPolling: WakuPolling | undefined) {
  const [polls, setPolls] = useState<DetailedTimedPoll[]>([])
  useEffect(() => {
    const interval = setInterval(async () => {
      if (wakuPolling) {
        const DetailedTimedPolls = await wakuPolling.getDetailedTimedPolls()
        setPolls(DetailedTimedPolls)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [wakuPolling])
  return polls
}
