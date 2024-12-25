import { Spinner } from '@radix-ui/themes'
import React from 'react'
import { useOutletContext } from 'react-router-dom'
import VideoIcon from '../../assets/VideoIcon'
import EmptyLibrary from '../../components/EmptyLibrary'
import PlaylistCard from '../../components/PlaylistCard'
import { useFetchUserPlaylists } from '../../lib/queries/playlistQueries'

function ChannelPlaylists() {
  const { userId } = useOutletContext()
  const { data: playlists, isLoading } = useFetchUserPlaylists(userId)

  if (isLoading) return <div className=''><Spinner className='h-6 mx-auto' /></div>

  return (
    <>
      <div className='flex flex-col py-6 gap-y-8 gap-x-4 sm:grid sm:grid-cols-2 lg:grid-cols-3'>
        {playlists?.data.map((playlist) => (
          <PlaylistCard
            key={playlist._id}
            playlistData={playlist}
            loading={isLoading}
          />
        ))}
      </div>
      {playlists?.data.length === 0 &&
        <div className='-mt-12'>
          <EmptyLibrary
            Icon={VideoIcon} 
            title='No playlists created'
            description='There are no playlists in this library'
            />
        </div>
      }
    </>
  )
}

export default ChannelPlaylists
