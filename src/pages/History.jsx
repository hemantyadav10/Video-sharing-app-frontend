import { TrashIcon, UpdateIcon } from '@radix-ui/react-icons'
import { AlertDialog, Button, Flex, Separator, Skeleton, Spinner, Text } from '@radix-ui/themes'
import { HistoryIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useInView } from 'react-intersection-observer'
import QueryErrorHandler from '../components/QueryErrorHandler'
import SignInPrompt from '../components/SignInPrompt '
import VideoCard from '../components/VideoCard'
import { useAuth } from '../context/authContext'
import { useClearWatchHistory, useFetchUserWatchHistory } from '../lib/queries/userQueries'

function History() {
  const { user, isAuthenticated } = useAuth()
  const { data: watchHistory, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, error, isError, refetch } = useFetchUserWatchHistory(user?._id, 2)
  const { mutate: deleteHistory, isPending: deletingHistory } = useClearWatchHistory()
  const { ref, inView } = useInView({
    rootMargin: '250px'
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);


  const handleDeleteHistory = async () => {
    deleteHistory(undefined, {
      onSuccess: () => {
        toast('Watch history cleared')
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
        toast.error(errorMessage);
      }
    })
  }


  return (
    <div className={`w-full px-4 py-6 sm:px-10 mb-16 sm:mb-0`}>
      {!isAuthenticated &&
        <SignInPrompt
          Icon={HistoryIcon}
          title='Keep track of what you watch'
          description="Watch history isn't viewable when signed out."
        />
      }
      {isAuthenticated &&
        <h1 className='flex flex-col max-w-6xl gap-4 px-1 mx-auto mb-4 text-3xl font-semibold sm:mb-10 sm:flex-row'>
          <div className='flex items-center gap-4'>
            Watch History
            {isFetching && <span className={`${isFetching && 'animate-spin'}`}>
              <UpdateIcon />
            </span>}
          </div>

          {!isError && <AlertDialog.Root >
            <AlertDialog.Trigger
              disabled={deletingHistory || isLoading || watchHistory?.pages[0].data.totalDocs === 0}
            >
              <Button
                className='ml-auto'
                highContrast
                color='gray'
                variant='soft'
                radius='full'
                loading={deletingHistory}
              >
                <TrashIcon height={'20px'} width={'20px'} /> Clear history
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth="450px">
              <AlertDialog.Title weight={'medium'}>Clear watch history?</AlertDialog.Title>
              <AlertDialog.Description color='gray' size={'2'}>
                {user?.fullName} <span className='lowercase'>({user?.email})</span>
              </AlertDialog.Description>
              <Text as='p' color='gray' size={'2'} mt={'2'}>
                Your watch history will be cleared from all apps on all devices.
              </Text>
              <Flex gap="3" mt="4" justify="end">
                <AlertDialog.Cancel>
                  <Button
                    variant="surface"
                    color="gray"
                    radius='full'
                  >
                    Cancel
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button
                    highContrast
                    radius='full'
                    onClick={handleDeleteHistory}
                  >
                    Clear watch history
                  </Button>
                </AlertDialog.Action>
              </Flex>
            </AlertDialog.Content>
          </AlertDialog.Root>}

        </h1>
      }
      {isError && (
        <div className='border rounded-xl border-[--gray-a6] p-6 pt-0'>
          <QueryErrorHandler error={error} onRetry={refetch} />
        </div>
      )}
      {isAuthenticated && !isError && <div className='flex flex-col items-center justify-center max-w-6xl gap-6 mx-auto sm:gap-0'>
        {isLoading &&
          Array.from({ length: 1 }).fill(1).map((_, i) => (
            <React.Fragment key={i}>
              <div className='w-full '>
                <Skeleton loading={isLoading} className='w-24 h-6'>
                  <Text
                    as='span'
                    mb={'4'}
                    ml={'1'}
                  >
                  </Text>
                </Skeleton>
              </div>
              <div className='flex flex-col items-center w-full sm:gap-4'>
                {Array.from({ length: 2 }).fill(1).map((_, i) => (
                  <VideoCard
                    key={i}
                    loading={isLoading}
                    list
                  />
                ))}
              </div>
            </React.Fragment>
          ))
        }
        {watchHistory?.pages.map(page => (
          page?.data.docs.map((list) => (
            <div key={list._id} className='w-full pb-0 sm:mb-6'>
              <div className='flex items-center gap-2 mb-4 ml-1'>
                <Text
                  as='span'
                  weight={'medium'}
                >
                  {new Date(list.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                </Text>
                <Separator className='flex-1' />
              </div>
              {list?.videos.length > 0
                ? (
                  <div className='flex flex-col sm:gap-4'>
                    {list.videos.map((video) => (
                      <VideoCard
                        key={video._id}
                        list
                        videoData={video}
                        loading={isLoading}
                      />
                    ))}
                  </div>
                ) : (
                  <Text as='p' size={'2'} align={'center'}>
                    No videos for this date
                  </Text>
                )
              }
            </div>
          )
          )
        ))}
        {isFetchingNextPage && <Spinner className='my-2 size-6' />}
        {(hasNextPage && !isFetchingNextPage) && <div ref={ref}></div>}

        {watchHistory?.pages[0].data.totalDocs === 0 &&
          <div>
            <Text size={'2'}>
              This list has no videos.
            </Text>
          </div>
        }
      </div>
      }
    </div>
  )
}

export default History
