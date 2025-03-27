import { DotsVerticalIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { AlertDialog, Button, DropdownMenu, Flex, IconButton, Skeleton, Switch, Table, Text } from '@radix-ui/themes'
import { Earth, LockKeyhole } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { BarLoader } from 'react-spinners'
import { useAuth } from '../context/authContext'
import { useDeleteVideo, useTogglePublishStatus } from '../lib/queries/videoQueries'
import { formatVideoDuration } from '../utils/formatVideoDuration'
import { toIndianDateFormat } from '../utils/utils'
import EditVideoDailog from './EditVideoDailog'

const tableHeaders = [
  { key: 'video', label: 'Video' },
  { key: 'status', label: 'Status' },
  { key: 'views', label: 'Views' },
  { key: 'likes', label: 'Likes' },
  { key: 'date', label: 'Date' },
];

function VideoTable({
  videos,
  limit,
  page,
}) {
  const { user } = useAuth();
  const userId = user?._id;

  const { mutateAsync: toggleStatus, isPending } = useTogglePublishStatus({ limit, page })

  const handleTogglePublish = async (videoId, checked) => {
    toggleStatus(videoId, {
      onSuccess: () => {
        toast.success(checked ? "Video published" : "Video unpublished")
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
        toast.error(errorMessage);
      }
    })
  }

  return (
    <div>
      <div className='fixed left-0 right-0 z-[60] top-16'>
        <BarLoader
          color='#70b8ff'
          width={'100%'}
          height={'4px'}
          loading={isPending}
          className='rounded-full'
        />
      </div>
      <Table.Root>
        <Table.Header className='bg-[--gray-2]'>
          <Table.Row>
            {tableHeaders.map(header => (
              <Table.ColumnHeaderCell key={header.key} className={`${header.className} text-nowrap`}>
                <Text color='gray' size={'1'} weight={'medium'}>
                  {header.label}
                </Text>
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body >
          {videos?.docs?.map((video) => (
            <Table.Row key={video._id} className=' bg-[--color-background] transition-all even:bg-[--gray-2] hover:bg-[--color-surface]'>

              <Table.Cell
                className='min-w-[400px] max-w-[400px]'
              >
                <Flex>
                  <Link
                    to={video.isPublished ? `/watch/${video._id}` : ""}
                    preventScrollReset
                    className={`flex items-start flex-1 gap-4 group ${!video.isPublished && 'cursor-default'}`}
                  >
                    <VideoThumbnail video={video} />
                    <Flex direction={'column'} gap={'1'} className='flex-1 '>
                      <Text color='blue' className='w-full group-hover:underline line-clamp-2'>
                        {video.title}
                      </Text>
                      <Text size={'1'} color='gray' className='w-full line-clamp-2'>
                        {video.description}
                      </Text>
                    </Flex>
                  </Link>
                  <MoreOptionsMenu video={video} limit={limit} page={page} />
                </Flex>
              </Table.Cell>

              <Table.Cell>
                <Text as="label" size="2">
                  <Flex align={'center'} gap={'4'}>
                    <Switch
                      color='sky'
                      checked={video.isPublished}
                      onCheckedChange={(checked) => handleTogglePublish(video._id, checked)}
                    />
                    <span
                      className='flex items-center gap-2 text-xs'
                    >
                      {
                        video.isPublished
                          ? <><Earth size={18} strokeWidth={1.25} /> Public</>
                          : <><LockKeyhole size={18} strokeWidth={1.25} /> Private</>
                      }
                    </span>
                  </Flex>
                </Text>
              </Table.Cell>

              <Table.Cell className=''>
                {video.views || 0}
              </Table.Cell>

              <Table.Cell className=''>
                {video.likes || 0}
              </Table.Cell>

              <Table.Cell className=' text-nowrap'>
                {toIndianDateFormat(video.createdAt)}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div >
  )
}

export default VideoTable

export const VideoTableSkeleton = ({ className = '' }) => {
  return (
    <Table.Root variant="ghost">
      <Table.Header className='bg-[--gray-2]'>
        <Table.Row>
          {tableHeaders.map(header => (
            <Table.Cell key={header.key} className={className}>
              <Text color='gray' size={'1'} weight={'medium'}>
                {header.label}
              </Text>
            </Table.Cell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body >
        {Array.from({ length: 3 }).map((_, i) =>
          <Table.Row key={i} className='h-12 bg-[--color-background]'>
            <Table.Cell className='min-w-[400px] max-w-[400px]'>
              <Flex>
                <div className='flex items-start flex-1 gap-4' >
                  <Skeleton className='h-auto rounded-lg w-28 aspect-video' />
                  <div className='flex-1 space-y-3'>
                    <Skeleton className='flex-1 h-5' />
                    <Skeleton className='w-3/4 h-4' />
                  </div>
                </div>
              </Flex>
            </Table.Cell>
            <Table.Cell>
              <Flex gap={'4'} align={'center'}>
                <Skeleton>
                  <Switch />
                </Skeleton>
                <Skeleton className='w-16 h-5' />
              </Flex>
            </Table.Cell>
            <Table.Cell>
              <Skeleton className='w-8 h-5' />
            </Table.Cell>
            <Table.Cell>
              <Skeleton className='w-8 h-5' />
            </Table.Cell>
            <Table.Cell>
              <Skeleton className='w-16 h-5' />
            </Table.Cell>
          </Table.Row >
        )}
      </Table.Body >
    </Table.Root >
  )
}

export function VideoThumbnail({ video }) {
  return (
    <div className='relative w-28 aspect-video'>
      <img src={video.thumbnail} alt="playlist thumbnail" className='object-cover object-center w-full h-full rounded-lg' />
      <Text
        className='absolute bottom-1 right-1 p-[2px] px-1 text-xs bg-black/70 font-medium rounded-md text-white'
        as='span'
      >
        {formatVideoDuration(video?.duration)}
      </Text>
    </div>
  )
}

export function MoreOptionsMenu({
  video,
  limit,
  page
}) {
  const [open, setOpen] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton
            variant='ghost'
            mx={1}
            aria-label="More options"
            color='gray'
            radius='full'
            highContrast
            title='More options'
          >
            <DotsVerticalIcon width="18" height="18" />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content variant='soft' className='w-40' >
          <DropdownMenu.Item
            onClick={() => setOpenEditDialog(true)}
          >
            <Pencil1Icon /> Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => setOpen(true)}
            color='red'
          >
            <TrashIcon /> Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {open && (
        <AlertDeleteDialog
          video={video}
          limit={limit}
          page={page}
          open={open}
          setOpen={setOpen}
        />
      )}
      {openEditDialog && (
        <EditVideoDailog
          video={video}
          limit={limit}
          page={page}
          open={openEditDialog}
          setOpen={setOpenEditDialog}
        />
      )}
    </>
  )
}

export function AlertDeleteDialog({
  video,
  limit,
  page,
  open = false,
  setOpen }) {
  const { mutate: deleteVideo, isPending: deletingVideo } = useDeleteVideo({ limit, page });

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
    <AlertDialog.Root
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialog.Content maxWidth="550px" className='relative'>
        <AlertDialog.Title size={'4'} my={'0'} weight={'medium'}>
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
        <div className='mt-3'>
          <Flex p={'4'} pb={'2'} gap={'4'} className='bg-[--color-background] ' >
            <div className='w-28 aspect-video'>
              <img src={video.thumbnail} alt="thumbnail" className='object-cover object-center w-full h-full rounded-lg' />
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
          <AlertDialog.Description size={'2'} mt={'2'}>
            Are you sure you want to delete this video ?
            Once its deleted, you will not be able to recover it.
          </AlertDialog.Description>
        </div>
        <Flex gap="3" mt={'2'} justify="end">
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
            }}
            disabled={deletingVideo}
          >
            <Button
              loading={deletingVideo}
              onClick={() => handleDeleteVideo(video._id)}
              highContrast
              radius='full'
            >
              Delete forever
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
