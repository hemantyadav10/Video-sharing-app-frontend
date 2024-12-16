import React from 'react'
import PlaylistCard from '../components/PlaylistCard'
import { useFetchUserPlaylists } from '../lib/queries/playlistQueries'
import { useAuth } from '../context/authContext'
import NoContent from '../components/NoContent'

function AllPlaylists() {
  const { user } = useAuth()
  const { data: playlists, isLoading } = useFetchUserPlaylists(user?._id)

  return (
    <div className='w-full p-6 '>
      <h1 className='text-3xl font-semibold'>Playlists</h1>
      <div className='flex flex-col py-6 gap-y-8 gap-x-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {isLoading &&
          Array.from({ length: 8 }).fill(1).map((_, i) =>
            <PlaylistCard key={i} loading={isLoading} />
          )
        }
        {playlists?.data.map((playlist) => (
          <PlaylistCard key={playlist._id} playlistData={playlist} loading={isLoading} />
        ))}
      </div>
      {playlists?.data.length === 0 &&
        <NoContent
          description='Start creating your playlists to save your favorite videos in one place.'
          title='No Playlists Yet'
        />}
    </div>
  )
}

export default AllPlaylists
