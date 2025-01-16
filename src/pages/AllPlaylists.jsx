import { PlusIcon } from '@radix-ui/react-icons'
import { Button } from '@radix-ui/themes'
import React, { useState } from 'react'
import CreatePlaylistDialog from '../components/CreatePlaylistDialog'
import NoContent from '../components/NoContent'
import PlaylistCard from '../components/PlaylistCard'
import { useAuth } from '../context/authContext'
import { useFetchUserPlaylists } from '../lib/queries/playlistQueries'
import QueryErrorHandler from '../components/QueryErrorHandler'

function AllPlaylists() {
  const { user } = useAuth()
  const { data: playlists, isFetching, isError, error, refetch } = useFetchUserPlaylists(user?._id, true)
  const [openCreatePlaylist, setOpenCreatePlaylist] = useState(false)

  if (isError) {
    return <QueryErrorHandler error={error} onRetry={refetch} />
  }

  return (
    <div className='w-full p-6 mb-16 sm:mb-0'>
      <h1 className='text-3xl font-semibold'>Playlists</h1>
      {playlists?.data.length !== 0 &&
        <div className='flex flex-col py-6 gap-y-8 gap-x-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {isFetching &&
            Array.from({ length: 8 }).fill(1).map((_, i) =>
              <PlaylistCard key={i} loading={isFetching} />
            )
          }
          {playlists?.data.map((playlist) => (
            <PlaylistCard key={playlist._id} playlistData={playlist} loading={isFetching} />
          ))}
        </div>
      }

      {playlists?.data.length === 0 &&
        <div className='flex flex-col items-center justify-center gap-6 '>
          <NoContent
            description='Start creating your playlists to save your favorite videos in one place.'
            title='No Playlists Yet'
          />
          <Button
            variant='soft'
            highContrast
            radius='full'
            onClick={() => {
              setOpenCreatePlaylist(true)
            }}
          >
            <PlusIcon />Create playlist
          </Button>
          {/* Create new playlist */}
          <CreatePlaylistDialog
            open={openCreatePlaylist}
            toggleOpen={setOpenCreatePlaylist}
          />
        </div>
      }
    </div>
  )
}

export default AllPlaylists
