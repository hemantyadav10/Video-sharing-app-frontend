import { DotsVerticalIcon, TrashIcon } from '@radix-ui/react-icons'
import { DropdownMenu, Flex, IconButton, Skeleton, Spinner, Table, Text } from '@radix-ui/themes'
import { ListVideo, } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import no_content from '../../assets/no_content.svg'
import noThumbnail from '../../assets/noThumbnail.webp'
import ConfirmationDialog from '../../components/ConfirmationDialog'
import QueryErrorHandler from '../../components/QueryErrorHandler'
import { useAuth } from '../../context/authContext'
import { useDeletePlaylist, useFetchUserPlaylists } from '../../lib/queries/playlistQueries'
import { toIndianDateFormat } from '../../utils/utils'

function PlaylistsTab() {
  const { user } = useAuth()
  const { data: playlists, isLoading, error, isError, refetch } = useFetchUserPlaylists(user?._id, true)

  return (
    <div className=''>
      {isLoading ? (
        <SkeletonLoader />
      ) : isError ? (
        <QueryErrorHandler error={error} onRetry={refetch} className='mt-0' />
      ) : playlists?.data.length === 0 ? (
        <NoContent />
      ) : (
        <Table.Root>
          <TableHeader />
          <Table.Body>
            {playlists?.data.map((playlist) => (
              <Table.Row key={playlist._id} className='bg-[--color-background] transition-all even:bg-[--gray-2] hover:bg-[--color-surface]'>
                <Table.Cell
                  className='min-w-[320px] max-w-[320px]'
                >
                  <Flex>
                    <Link
                      to={`/playlist/${playlist._id}`}
                      className='flex items-start flex-1 gap-4 group'
                    >
                      <PlaylistThumbnail playlist={playlist} />
                      <Flex direction={'column'} gap={'1'} className='flex-1 '>
                        <Text weight={"medium"} className='w-full group-hover:underline line-clamp-2'>
                          {playlist.name}
                        </Text>
                        <Text size={'1'} color='gray' className='w-full line-clamp-2'>
                          {playlist.description}
                        </Text>
                      </Flex>
                    </Link>
                    <MoreOptionsMenu
                      playlistId={playlist?._id}
                      userId={user?._id}
                      playlistName={playlist?.name}
                    />
                  </Flex>
                </Table.Cell>
                <Table.Cell className='text-nowrap'>{toIndianDateFormat(playlist.updatedAt)}</Table.Cell>
                <Table.Cell className='text-nowrap'>{playlist.totalVideos}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </div>
  )
}

export default PlaylistsTab

export function SkeletonLoader() {
  return (
    <Table.Root>
      <TableHeader />
      <Table.Body>
        {Array.from({ length: 3 }).map((_, idx) => (
          <Table.Row key={idx}>
            <Table.RowHeaderCell
              className='min-w-[319px] max-w-[319px]'
            >
              <Flex>
                <div
                  className='flex items-start flex-1 gap-4'
                >
                  <Skeleton className='h-auto rounded-lg w-28 aspect-video' />
                  <div className='flex-1 space-y-3'>
                    <Skeleton className='flex-1 h-5' />
                    <Skeleton className='w-3/4 h-4' />
                  </div>
                </div>
              </Flex>
            </Table.RowHeaderCell>
            <Table.Cell >
              <Skeleton className='h-5 w-[72px]' />
            </Table.Cell>
            <Table.Cell>
              <Skeleton className='w-12 h-5' />
            </Table.Cell>
          </Table.Row >
        ))
        }
      </Table.Body >
    </Table.Root>
  )
}

export function PlaylistThumbnail({
  playlist
}) {
  return (
    <div className='relative w-28 aspect-video'>
      <img src={playlist.thumbnail || noThumbnail} alt="playlist thumbnail" className='object-cover object-center w-full h-full rounded-lg' />
      <Text
        className='absolute bottom-0 top-0 right-0 p-[2px] w-12 px-1 text-xs bg-black/80 font-semibold rounded-r-md text-white flex items-center justify-center'
        as='span'
      >
        <span>
          {playlist.totalVideos} <ListVideo size={16} />
        </span>
      </Text>
    </div>
  )
}

export function MoreOptionsMenu({
  playlistId,
  userId,
  playlistName
}) {
  const { mutate: deletePlaylist, isPending, } = useDeletePlaylist(playlistId, userId)
  const [open, setOpen] = useState(false)

  const handleDeletePlaylist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isPending) return;
    deletePlaylist(playlistId, {
      onSuccess: () => {
        toast.success('Playlist deleted')
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
        toast.error(errorMessage);
      }
    })
  }

  return (
    <>
      {open && (
        <ConfirmationDialog
          open={open}
          setOpen={setOpen}
          action={handleDeletePlaylist}
          title={`Delete "${playlistName}"?`}
          descripion={`Are you sure you want to delete "${playlistName}"? Note: Deleting playlists is a permanent action and cannot be undone. The videos within the playlist won't be deleted.`}
          maxWidth='480px'
        />
      )}
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
        <DropdownMenu.Content variant='soft' color='red' >
          <DropdownMenu.Item
            onClick={() => setOpen(true)}
            disabled={isPending}
            color='red'
          >
            <Spinner loading={isPending}>
              <TrashIcon />
            </Spinner>
            Delete playlist
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  )
}

const NoContent = () => (
  <section className="flex flex-col items-center justify-center">
    <img src={no_content} alt="no content" className="size-52" />
    <Text color="gray" size="2">No content available</Text>
  </section>
);

function TableHeader() {
  return (
    <Table.Header className='bg-[--gray-2]'>
      <Table.Row>
        <Table.ColumnHeaderCell>
          <Text color='gray' size={'1'} weight={'medium'}>
            Playlist
          </Text>
        </Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell className='text-nowrap'>
          <Text color='gray' size={'1'} weight={'medium'}>
            Last updated
          </Text>
        </Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell className='text-nowrap'>
          <Text color='gray' size={'1'} weight={'medium'}>
            Video count
          </Text>
        </Table.ColumnHeaderCell>
      </Table.Row>
    </Table.Header>
  )
}