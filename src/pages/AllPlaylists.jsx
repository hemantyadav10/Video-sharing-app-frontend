import { PlusIcon } from '@radix-ui/react-icons'
import { Flex, IconButton, Text, Tooltip } from '@radix-ui/themes'
import React, { useState } from 'react'
import CreatePlaylistDialog from '../components/CreatePlaylistDialog'
import NoContent from '../components/NoContent'
import PlaylistCard from '../components/PlaylistCard'
import QueryErrorHandler from '../components/QueryErrorHandler'
import { useAuth } from '../context/authContext'
import { useFetchUserPlaylists } from '../lib/queries/playlistQueries'

function AllPlaylists() {
  const { user } = useAuth()
  const { data: playlists, isFetching, isError, error, refetch } = useFetchUserPlaylists(user?._id, true)
  const [openCreatePlaylist, setOpenCreatePlaylist] = useState(false)

  if (isError) {
    return <QueryErrorHandler error={error} onRetry={refetch} />
  }

  return (
    <div className='w-full p-6 mb-16 sm:mb-0'>
      <Flex align={'start'} justify={'between'}>
        <Flex direction={'column'} gap={'1'}>
          <Text as='span' size={'7'} weight={'bold'}>
            Playlists
          </Text>
          <Text as='span' size={"1"} color='gray'>
            Collections you have created
          </Text>
        </Flex>
        <Tooltip content='Create Playlist' side='bottom'>
          <IconButton
            variant='soft'
            color='gray'
            highContrast
            radius='full'
            onClick={() => {
              setOpenCreatePlaylist(true)
            }}
          >
            <PlusIcon />
          </IconButton>
        </Tooltip>
        <CreatePlaylistDialog
          open={openCreatePlaylist}
          toggleOpen={setOpenCreatePlaylist}
        />
      </Flex>
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
        </div>
      }
    </div>
  )
}

export default AllPlaylists
