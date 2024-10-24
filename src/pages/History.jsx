import React from 'react'
import VideoCard from '../components/VideoCard'
import { AlertDialog, Button, Flex } from '@radix-ui/themes'
import { TrashIcon } from '@radix-ui/react-icons'
import { useFetchUserWatchHistory } from '../lib/queries/userQueries'
import { useAuth } from '../context/authContext'

function History() {
  const { user, isAuthenticated } = useAuth()
  const { data: watchHistory, isLoading } = useFetchUserWatchHistory(user?._id)
  console.log(watchHistory?.data)
  return (
    <div className='w-full px-4 py-6 sm:px-10 '>
      <h1 className='flex flex-wrap items-center justify-between max-w-6xl gap-4 mx-auto mb-10 text-3xl font-semibold'>Watch History

        {isAuthenticated && <AlertDialog.Root>
          <AlertDialog.Trigger>
            <Button className='ml-auto font-medium' variant='ghost'>
              <TrashIcon height={'20px'} width={'20px'} /> Clear all watch history
            </Button>
          </AlertDialog.Trigger>
          <AlertDialog.Content maxWidth="450px">
            <AlertDialog.Title weight={'medium'}>Clear watch history?</AlertDialog.Title>
            <AlertDialog.Description size="2" className='space-y-4'>
              <p className='capitalize'>{user?.fullName} <span className='lowercase'>({user?.email})</span>
              </p>
              <p>Your watch history will be cleared from all apps on all devices.
              </p>
            </AlertDialog.Description>

            <Flex gap="3" mt="4" justify="end">
              <AlertDialog.Cancel>
                <Button variant="soft" color="gray" highContrast>
                  Cancel
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button variant="soft" highContrast>
                  Clear Watch History
                </Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>
        }

      </h1>
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
      </div>
      }    </div>
  )
}

export default History
