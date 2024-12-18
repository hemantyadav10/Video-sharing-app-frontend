import React from 'react'
import VideoCard from '../components/VideoCard'
import { AlertDialog, Button, Flex, Text } from '@radix-ui/themes'
import { CounterClockwiseClockIcon, TrashIcon } from '@radix-ui/react-icons'
import { useClearWatchHistory, useFetchUserWatchHistory } from '../lib/queries/userQueries'
import { useAuth } from '../context/authContext'
import SignInPrompt from '../components/SignInPrompt '
import toast from 'react-hot-toast'

function History() {
  const { user, isAuthenticated } = useAuth()
  const { data: watchHistory, isLoading } = useFetchUserWatchHistory(user?._id)
  const { mutate: deleteHistory, isPending: deletingHistory } = useClearWatchHistory()


  const handleDeleteHistory = async () => {
    deleteHistory(undefined, {
      onSuccess: () => {
        toast('Watch history cleared')
      },
      onError: () => {
        toast.error('Something went wrong, please try again.')
      }
    })
  }


  return (
    <div className='w-full px-4 py-6 sm:px-10 '>
      {!isAuthenticated &&
        <SignInPrompt
          Icon={CounterClockwiseClockIcon}
          title='Keep track of what you watch'
          description="Watch history isn't viewable when signed out."
        />
      }
      {isAuthenticated &&
        <h1 className='flex flex-wrap items-center justify-between max-w-6xl gap-4 mx-auto mb-10 text-3xl font-semibold'>Watch History

          <AlertDialog.Root >
            <AlertDialog.Trigger
              disabled={deletingHistory || isLoading || watchHistory?.data.length === 0 ? true : false}
            >
              <Button
                className='ml-auto'
                highContrast
                color='gray'
                variant='soft'
                radius='full'
                loading={deletingHistory}
              >
                <TrashIcon height={'20px'} width={'20px'} /> Clear all watch history
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
                    variant="soft"
                    color="gray"
                    highContrast
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
          </AlertDialog.Root>

        </h1>
      }
      {isAuthenticated && <div className='flex flex-col items-center gap-6 sm:gap-0'>
        {isLoading &&
          Array.from({ length: 4 }).fill(1).map((_, i) => (
            <VideoCard
              key={i}
              loading={isLoading}
              list
            />
          ))
        }
        {watchHistory?.data.map((video) => (
          <VideoCard
            key={video._id}
            list
            videoData={video}
            loading={isLoading}
            removeFromHistoryButton
            moreOptionsButton={false}
          />
        ))}
        {
          watchHistory?.data.length === 0 &&
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
