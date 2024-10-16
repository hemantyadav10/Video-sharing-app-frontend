import { SegmentedControl } from '@radix-ui/themes'
import React from 'react'
import VideoCard from '../../components/VideoCard'

function ChannelVideos() {
  return (
    <div>
      <div>
        <SegmentedControl.Root defaultValue="inbox" >
          <SegmentedControl.Item value="inbox">Latest</SegmentedControl.Item>
          <SegmentedControl.Item value="drafts">Popular</SegmentedControl.Item>
          <SegmentedControl.Item value="sent">Oldest</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      <div className='flex flex-col py-6 gap-y-6 gap-x-4 sm:grid sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 10 }).fill(1).map((_, i) => (
          <VideoCard key={i} hideAvatar/>
        ))}
      </div>
    </div>
  )
}

export default ChannelVideos
