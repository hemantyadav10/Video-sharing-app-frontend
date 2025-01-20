import React, { useState } from 'react'
import { toIndianDateFormat } from '../utils/utils'
import { AlertDialog, Badge, Button, Flex, IconButton, Skeleton, Switch, Table, Text, Tooltip } from '@radix-ui/themes'
import { Link } from 'react-router-dom'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import EditVideoDailog from './EditVideoDailog'
import { formatVideoDuration } from '../utils/formatVideoDuration'
import { useDeleteVideo } from '../lib/queries/videoQueries'
import toast from 'react-hot-toast'
import { BarLoader } from 'react-spinners'
import { useAuth } from '../context/authContext'

function VideoTable({
  videos,
  publishedVideos,
  onTogglePublish,
  loadingVideos,
}) {

  const tableHeaders = [
    { key: 'toggleStatus', label: 'Toggle status', minWidth: '100px' },
    { key: 'status', label: 'Status' },
    { key: 'video', label: 'Video' },
    { key: 'views', label: 'Views' },
    { key: 'likes', label: 'Likes' },
    { key: 'date', label: 'Date' },
    { key: 'actions', label: 'Edit/Delete' },
  ];

  const { user } = useAuth()
  const { _id: userId } = user
  const [open, setOpen] = useState(false)

  const { mutate: deleteVideo, isPending: deletingVideo } = useDeleteVideo(userId);

  const handleDeleteVideo = async (videoId) => {
    deleteVideo(videoId, {
      onSuccess: () => {
        toast.success('Video successfully deleted')
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
        toast.error(errorMessage);
      }
    })
  }

  return (
    <>
      {/* <EditVideoDailog video={video} /> */}
      <Table.Root variant="surface" className='shadow-lg'>
        <Table.Header>
          <Skeleton loading={loadingVideos || !publishedVideos}>
            <Table.Row >
              {tableHeaders.map(header => (
                <Table.Cell key={header.key} minWidth={header.minWidth || undefined}>
                  <Text color='gray' size={'1'}>
                    {header.label}
                  </Text>
                </Table.Cell>
              ))}
            </Table.Row>
          </Skeleton>
        </Table.Header>
        <Table.Body >
          {/* Skeleton loader for video table  */}
          {loadingVideos || !publishedVideos ?
            Array.from({ length: 3 }).map((_, i) =>
              <Table.Row key={i} className='h-12 bg-[#111113]'>
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
                <Table.Cell >
                  <Skeleton maxWidth={'500px'} width={'500px'} minWidth={'300px'} height={'16px'}>
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
                <Table.Cell>
                  <Flex>
                    <Skeleton width={'20px'} height={'20px'} className='mr-2 rounded-full'>
                    </Skeleton>
                    <Skeleton width={'20px'} height={'20px'} className='rounded-full'>
                    </Skeleton>
                  </Flex>
                </Table.Cell>
              </Table.Row>) :
            (videos?.data.map((video) => (

              <Table.Row key={video._id} className='bg-[#111113] hover:bg-[#d8f4f601] transition-all'>
                <Table.Cell>
                  <Switch
                    color='sky'
                    checked={publishedVideos?.includes(video._id)}
                    onCheckedChange={(checked) => onTogglePublish(video._id, checked)}
                  />
                </Table.Cell>
                <Table.Cell minWidth={'122px'}>
                  <Badge
                    color={
                      video.isPublished
                        ? 'green'
                        : 'orange'
                    }
                    size={'2'}
                    radius='full'
                  // variant='outline'
                  // highContrast
                  // className='font-normal'
                  >
                    {video.isPublished
                      ? 'Published'
                      : 'Unpublished'}
                  </Badge>
                </Table.Cell>
                <Table.Cell
                  title={video.title}
                  minWidth={'440px'}
                  maxWidth={'620px'}
                  width={'620px'}
                >
                  <Link
                    to={video.isPublished ? `/watch/${video._id}` : null}
                    className={`flex items-start gap-4 group ${!video.isPublished && 'cursor-default'}`}
                  >
                    <div className='relative w-32 aspect-video'>
                      <img src={video.thumbnail} alt="thumbnail" className='object-cover object-center w-full h-full rounded-lg' />
                      <Text
                        className='absolute bottom-1 right-1 p-[2px] px-1 text-xs bg-black/70 font-medium rounded-md text-white'
                        as='span'
                      >
                        {formatVideoDuration(video?.duration)}
                      </Text>
                    </div>
                    <div className='flex-1'>
                      <Text
                        as='p'
                        mb={'1'}
                        color='blue'
                        className='group-hover:underline'
                        size={'2'}
                      >
                        {video.title}
                      </Text>
                      <Text
                        as='p'
                        color='gray'
                        size={'1'}
                        className=' line-clamp-2'
                        title={video.description}
                      >
                        {video.description}
                      </Text>
                    </div>
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  {video.views || 0}
                </Table.Cell>
                <Table.Cell>
                  {video.likes || 0}
                </Table.Cell>
                <Table.Cell minWidth={'108px'}>
                  {toIndianDateFormat(video.createdAt)}
                </Table.Cell>
                <Table.Cell >

                  {/* Delete video button that opens a delete confirmation modal */}
                  <AlertDialog.Root
                  >
                    <Tooltip content='Delete video' side='bottom'>
                      <AlertDialog.Trigger>
                        <IconButton variant='ghost' color='gray' highContrast radius='full' mr={'4'}>
                          <TrashIcon height={'20px'} width={'20'} />
                        </IconButton>
                      </AlertDialog.Trigger>
                    </Tooltip>
                    <AlertDialog.Content maxWidth="550px" className='relative'>
                      <AlertDialog.Title>
                        Permanently delete this video?
                      </AlertDialog.Title>
                      <div className='absolute top-0 left-6 right-6 '>
                        <BarLoader
                          color='#70b8ff'
                          width={'100%'}
                          height={'3px'}
                          loading={deletingVideo}
                        />
                      </div>
                      <Flex p={'4'} mt={'4'} gap={'4'} className='bg-[#0c0c0d] ' >
                        <div className='relative w-28 aspect-video'>
                          <img src={video.thumbnail} alt="thumbnail" className='object-cover object-center w-full h-full rounded-lg' />
                          <Text
                            className='absolute bottom-1 right-1 p-[2px] px-1 text-xs bg-black/70 font-medium rounded-md text-white '
                            as='span'
                          >
                            {formatVideoDuration(video?.duration)}
                          </Text>
                        </div>
                        <div className='flex-1'>
                          <Text as='p' size={'1'} weight={'medium'}>
                            {video.title}
                          </Text>
                          <Text weight={'light'} color='gray' as='p' size={'1'}>
                            Uploaded on {toIndianDateFormat(video.createdAt)}
                          </Text>
                          <Text weight={'light'} color='gray' as='p' size={'1'}>
                            {video.views} views
                          </Text>
                        </div>
                      </Flex>

                      <AlertDialog.Description size="2" mt={'4'}>
                        Are you sure you want to delete this video ?
                        Once its deleted, you will not be able to recover it.
                      </AlertDialog.Description>
                      <Flex gap="3" mt="4" justify="end">
                        <AlertDialog.Cancel disabled={deletingVideo}>
                          <Button
                            highContrast
                            variant="surface"
                            color="gray"
                            radius='full'
                          >
                            Cancel
                          </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action
                          onClick={e => {
                            e.preventDefault()
                            if (deletingVideo) {

                            }
                          }}
                          disabled={deletingVideo}
                        >
                          <Button
                            loading={deletingVideo}
                            onClick={() => handleDeleteVideo(video._id)}
                            // onClick={(video._id) => handleDeleteVideo(videoId)}
                            highContrast
                            radius='full'
                          >
                            Delete forever
                          </Button>
                        </AlertDialog.Action>
                      </Flex>
                    </AlertDialog.Content>
                  </AlertDialog.Root>
                  {/* Edit video button that triggers a dialog open to edit video details */}
                  <EditVideoDailog video={video} >
                    <IconButton
                      variant='ghost'
                      color='gray'
                      highContrast
                      radius='full'
                    >
                      <Pencil1Icon height={'20px'} width={'20'} />
                    </IconButton>
                  </EditVideoDailog>
                </Table.Cell>
              </Table.Row>
            )))
          }
        </Table.Body>
      </Table.Root >
    </>
  )
}

export default VideoTable
