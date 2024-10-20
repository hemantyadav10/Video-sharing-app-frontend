import { Spinner, Text } from '@radix-ui/themes'
import React from 'react'
import PlaylistCard from '../../components/PlaylistCard'
import { useFetchUserPlaylists } from '../../lib/queries/playlistQueries'
import { useOutletContext } from 'react-router-dom'

function ChannelPlaylists() {
  const { userId } = useOutletContext()
  const { data: playlists, isLoading, error } = useFetchUserPlaylists(userId)

  if (isLoading) return <div className=''><Spinner className='h-6 mx-auto' /></div>

  return (

    <div className='flex flex-col py-6 gap-y-8 gap-x-4 sm:grid sm:grid-cols-2 lg:grid-cols-3'>
      {playlists?.data.map((playlist) => (
        <PlaylistCard
          key={playlist._id}
          playlistData={playlist}
          loading={isLoading}
        />
      ))}
    </div>
  )
}

export default ChannelPlaylists
