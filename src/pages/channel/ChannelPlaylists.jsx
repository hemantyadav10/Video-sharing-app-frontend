import { Text } from '@radix-ui/themes'
import React from 'react'
import PlaylistCard from '../../components/PlaylistCard'

function ChannelPlaylists() {
  return (
      <div className='flex flex-col py-6 gap-y-8 gap-x-4 sm:grid sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 10 }).fill(1).map((_, i) => (
          <PlaylistCard key={i} />
        ))}
    </div>
  )
}

export default ChannelPlaylists
