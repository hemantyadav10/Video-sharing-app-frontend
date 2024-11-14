import { AlertDialog, Badge, Button, Flex, Heading, IconButton, Separator, Skeleton, Switch, Table, Text, Tooltip } from '@radix-ui/themes'
import React from 'react'
import { useAuth } from '../context/authContext'
import { EyeOpenIcon, HeartIcon, Pencil1Icon, PersonIcon, TrashIcon } from '@radix-ui/react-icons'
import UploadVideoIcon from '../assets/UploadVideoIcon'
import ChannelStatsCard from '../components/ChannelStatsCard'
import VideoIcon from '../assets/VideoIcon'
import { Link } from 'react-router-dom'
import { toIndianDateFormat } from '../utils/utils'
import { useGetChannelStats, useGetChannleVideos } from '../lib/queries/dashboardQueries'

function Dashboard() {
  const { user } = useAuth()
  const { data: videoData, isLoading: loadingVideos } = useGetChannleVideos(user?._id)
  const { data: stats, isLoading: loadingStats } = useGetChannelStats(user?._id)
  console.log(videoData)

  return (
    <div className='flex flex-col w-full gap-6 p-6 py-12 mb-16 md:px-24'>

      {/* Top section */}
      <section className='flex flex-col gap-6 sm:flex-row sm:justify-between'>
        <div>
          <Heading mb={'1'}>
            Welcome back, {user?.fullName}
          </Heading>
          <Text
            as='p'
            color='gray'
            weight={'light'}
            size={'2'}
          >
            Seamless Video Management, Elevated Results
          </Text>
        </div>
        <Button
          highContrast
          radius='full'
          className='w-max'
        >
          <UploadVideoIcon width='20px' height='20px' fill='#111113' /> Upload video
        </Button>
      </section>

      <Separator size={'4'} />

      {/* Stats cards section */}
      <section className='flex flex-col flex-wrap gap-4 sm:grid-cols-2 sm:grid md:grid-cols-3 lg:grid-cols-4'>
        <ChannelStatsCard
          statType='Videos'
          Icon={VideoIcon}
          loading={loadingStats}
          statNumbers={stats?.data.totalVideos || 0}
        />
        <ChannelStatsCard
          statType='Views'
          Icon={EyeOpenIcon}
          loading={loadingStats}
          statNumbers={stats?.data.totalViews || 0}
        />
        <ChannelStatsCard
          statType='Subscribers'
          Icon={PersonIcon}
          loading={loadingStats}
          statNumbers={stats?.data.totalSubscribers || 0}
        />
        <ChannelStatsCard
          statType='Likes'
          Icon={HeartIcon}
          loading={loadingStats}
          statNumbers={stats?.data.totalLikes || 0}
        />
      </section>

      {/* video details table */}
      <section>
        <Table.Root variant="surface">
          <Table.Header>
            <Skeleton loading={loadingVideos}>
              <Table.Row >
                <Table.Cell minWidth={'100px'}>
                  <Text color='gray' size={'1'}>
                    Toggle status
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text color='gray' size={'1'}>
                    Status
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text color='gray' size={'1'}>
                    Video
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text color='gray' size={'1'}>
                    Views
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text color='gray' size={'1'}>
                    Likes
                  </Text>
                </Table.Cell>
                <Table.Cell >
                  <Text color='gray' size={'1'}>
                    Date
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text color='gray' size={'1'}>
                    Edit/Delete
                  </Text>
                </Table.Cell>
              </Table.Row>
            </Skeleton>
          </Table.Header>
          <Table.Body >
            {videoData?.data.map((video) => (

              <Table.Row key={video._id} className='bg-[#111113] hover:bg-[#0c0c0d] transition-all'>
                <Table.Cell>
                  <Switch
                    variant='surface'
                    color='sky'
                    checked={video.isPublished}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    color={video.isPublished ? 'green' : 'orange'}
                    size={'2'}
                    radius='full'
                    variant='surface'
                    className='font-normal'
                  >
                    {video.isPublished ? 'Published' : 'Unpublished'}
                  </Badge>
                </Table.Cell>
                <Table.Cell
                  title={video.title}
                  minWidth={'268px'}
                  maxWidth={'620px'}
                  width={'620px'}
                >
                  <Link
                    to={`/watch/${video._id}`}
                    className='hover:underline hover:text-[#4493f8]'>
                    {video.title}
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  {video.views}
                </Table.Cell>
                <Table.Cell>
                  {video.likes}
                </Table.Cell>
                <Table.Cell minWidth={'108px'}>
                  {toIndianDateFormat(video.createdAt)}
                </Table.Cell>
                <Table.Cell >
                  <AlertDialog.Root>
                    <Tooltip content='Delete video' side='bottom'>
                      <AlertDialog.Trigger>
                        <IconButton variant='ghost' color='gray' highContrast radius='full' mr={'2'}>
                          <TrashIcon height={'20px'} width={'20'} />
                        </IconButton>
                      </AlertDialog.Trigger>
                    </Tooltip>
                    <AlertDialog.Content maxWidth="450px">
                      <AlertDialog.Title>Delete video</AlertDialog.Title>
                      <AlertDialog.Description size="2">
                        Are you sure you want to delete this video ?
                        Once its deleted, you will not be able to recover it.
                      </AlertDialog.Description>

                      <Flex gap="3" mt="4" justify="end">
                        <AlertDialog.Cancel>
                          <Button variant="soft" highContrast color="gray" radius='full'>
                            Cancel
                          </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                          <Button highContrast radius='full'>
                            Delete
                          </Button>
                        </AlertDialog.Action>
                      </Flex>
                    </AlertDialog.Content>
                  </AlertDialog.Root>

                  <Tooltip content='Edit video' side='bottom'>
                    <IconButton variant='ghost' color='gray' highContrast radius='full'>
                      <Pencil1Icon height={'20px'} width={'20'} />
                    </IconButton>
                  </Tooltip>
                </Table.Cell>
              </Table.Row>
            ))}
            {loadingVideos &&
              <>
                <Table.Row className='h-12 bg-[#111113]'>
                  <Table.Cell >
                    <Skeleton>
                      <Switch />
                    </Skeleton>
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton className='w-24 h-6'>
                      <Badge
                        size={'2'}
                        radius='full'
                      >
                      </Badge>
                    </Skeleton>
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton maxWidth={'460px'} width={'460px'} minWidth={'200px'} height={'16px'}>
                    </Skeleton>
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton width={'48px'} height={'16px'}>
                    </Skeleton>
                  </Table.Cell>
                  <Table.Cell>
                    <Skeleton width={'48px'} height={'16px'}>
                    </Skeleton>
                  </Table.Cell>
                  <Table.Cell >
                    <Skeleton width={'100px'} height={'16px'}>
                    </Skeleton>
                  </Table.Cell>
                  <Table.Cell className='flex'>
                    <Skeleton width={'20px'} height={'20px'} className='mr-2 rounded-full'>
                    </Skeleton>
                    <Skeleton width={'20px'} height={'20px'} className='rounded-full'>
                    </Skeleton>
                  </Table.Cell>
                </Table.Row>
              </>
            }

          </Table.Body>
        </Table.Root>
      </section>
      {/* {loadingVideos && <Spinner size={'3'} className='mx-auto' />} */}
    </div >
  )
}

export default Dashboard
