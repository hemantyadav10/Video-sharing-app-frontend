import { Flex, Text } from '@radix-ui/themes'
import { ListVideo } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import EmptyLibrary from '../../components/EmptyLibrary'
import Loader from '../../components/Loader'
import PlaylistCard from '../../components/PlaylistCard'
import QueryErrorHandler from '../../components/QueryErrorHandler'
import { useAuth } from '../../context/authContext'
import { useFetchUserPlaylists } from '../../lib/queries/playlistQueries'

function ChannelPlaylists() {
  const { userId } = useOutletContext()
  const { user } = useAuth()
  const { data: playlists, isLoading, error, isError, refetch } = useFetchUserPlaylists(userId, true)

  if (isLoading) return <Loader center />;
  if (isError) return <div className='border rounded-xl border-[--gray-a6] pt-0 p-6 mt-6'>
    <QueryErrorHandler error={error} onRetry={refetch} />
  </div>

  return (
    <div>
      <Flex mt={'2'} align={'center'} justify={'between'}>
        <Text as='span' weight={'medium'} size={'2'} className='px-4 sm:px-0'>
          Created playlists
        </Text>
      </Flex>
      {playlists?.data.length > 0
        ? (
          <div className='flex flex-col px-4 py-6 gap-y-8 gap-x-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 sm:px-0'>
            {playlists?.data.map((playlist) => (
              <PlaylistCard
                key={playlist._id}
                playlistData={playlist}
                loading={isLoading}
              />
            ))}
          </div>
        ) : (
          <div className='sm:mt-4'>
            <EmptyLibrary
              Icon={ListVideo}
              title='No playlists created'
              description='There are no playlists in this library'
            />
          </div>
        )
      }
    </div>
  )
}

export default ChannelPlaylists
