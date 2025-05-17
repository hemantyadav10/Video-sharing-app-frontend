import { Cross1Icon, InfoCircledIcon, Pencil1Icon, PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { AlertDialog, Avatar, Button, Dialog, Flex, IconButton, Skeleton, Spinner, Text, TextArea, TextField, Tooltip } from '@radix-ui/themes'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import NoContent from '../components/NoContent'
import QueryErrorHandler from '../components/QueryErrorHandler'
import VideoCard2 from '../components/VideoCard2'
import { useAuth } from '../context/authContext'
import { useDeletePlaylist, useFetchPlaylistById, useUpdatePlaylist } from '../lib/queries/playlistQueries'
import { timeAgo } from '../utils/formatTimeAgo'
import { useReadMore } from '../hooks/useReadMore'

function PlaylistVideos() {
  const { playlistId } = useParams();
  const { user } = useAuth()
  const { data: playlist, isLoading: loadingPlaylistData, error, isError, refetch } = useFetchPlaylistById(playlistId)
  const { mutate: updatePlaylist, isPending: updatingPlaylist } = useUpdatePlaylist(playlistId)
  const { mutate: deletePlaylist, isPending: isDeletingPlaylist } = useDeletePlaylist(playlistId, user?._id)
  const navigate = useNavigate();
  const { register, reset, watch, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: playlist?.data?.name || 'hello',
      description: playlist?.data?.description || 'hello'
    }
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const name = watch('name')
  const description = watch('description')
  const {
    contentRef,
    isExpanded,
    isLongContent,
    toggleExpand,
    setIsExpanded,
    setIsLongContent
  } = useReadMore(playlist?.data?.description)

  useEffect(() => {
    if (playlist?.data) {
      reset({
        name: playlist.data.name,
        description: playlist.data.description
      });
    }
  }, [playlist]);


  const handleEditPlaylist = async (data) => {
    updatePlaylist(data, {
      onSuccess: () => {
        toast('Playlist updated')
        setIsDialogOpen(false); // Close the dialog on successful update
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
        toast.error(errorMessage);
      }
    })
  }

  // Function to reset the form fields when the dialog opens
  const handleDialogOpenChange = (open) => {
    setIsDialogOpen(open)
    if (open && playlist) {
      reset({
        name: playlist.data.name,
        description: playlist.data.description
      });
    }
  };


  // Function to delete playlist 
  const handleDeletePlaylist = async () => {
    deletePlaylist(playlistId, {
      onSuccess: () => {
        navigate('/playlists')
        toast.success('Playlist deleted')
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
        toast.error(errorMessage);
      }
    })
  }

  if (isError) {
    return <QueryErrorHandler error={error} onRetry={refetch} />
  }

  return (
    <div className="flex flex-col w-full mb-16 sm:mb-0 lg:flex-row lg:p-6 mx-auto max-w-[2560px]">
      <Skeleton loading={loadingPlaylistData}>

        <div
          className={`relative p-4 bg-cover bg-center sm:p-6  lg:rounded-t-2xl lg:h-[calc(100vh-122px)] lg:sticky lg:top-[88px] sm:px-24 md:px-6 overflow-hidden bg-fixed`}
          style={{ backgroundImage: `url(${playlist?.data?.videos[0]?.thumbnail})` }}
        >
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[--gray-a6] to-[--gray-1] backdrop-blur-xl"></div>
          <div className="relative z-10 flex flex-col w-full gap-6 text-xs md:flex-row md:items-center lg:flex-col lg:w-80">
            {playlist?.data?.videos.length > 0 && <div className='w-full'>
              <img
                src={playlist?.data?.videos[0]?.thumbnail || ''}
                alt=""
                className="object-cover object-center w-full rounded-xl aspect-video"
              />
            </div>}
            <div className='flex flex-col w-full gap-4 '>
              <p className='text-xl font-bold sm:text-2xl line-clamp-2 drop-shadow-lg'>
                {playlist?.data?.name}
              </p>
              <div>
                <Link to={`/channel/${playlist?.data?.owner._id}/videos`} className='flex items-center gap-2 my-2 hover:opacity-90'>
                  <Avatar
                    radius='full'
                    size={'1'}
                    src={playlist?.data?.owner.avatar}
                    alt='avatar'
                    fallback="A"
                  />
                  <p className='font-medium drop-shadow-lg'>
                    by {playlist?.data?.owner.fullName}
                  </p>
                </Link>
                <Text as='p' className='drop-shadow-lg'>
                  Playlist • {playlist?.data?.totalVideos} videos • {`Updated ${timeAgo(playlist?.data?.updatedAt)}`}
                </Text>
              </div>
              <Dialog.Root >
                <Dialog.Trigger className='cursor-pointer'>
                  <Text as='div' tabIndex={'0'} className='relative'>
                    <Text
                      ref={contentRef}
                      as='p'
                      className={`drop-shadow-lg ${isExpanded ? "" : "line-clamp-2"} break-words whitespace-pre-wrap`}
                    >
                      {playlist?.data?.description}
                    </Text>
                    {isLongContent && <button className='absolute w-full font-semibold text-left drop-shadow-lg'>...more</button>}
                  </Text>
                </Dialog.Trigger>
                <Dialog.Content>
                  <Dialog.Title size={'4'} className='flex justify-between '>
                    <Text className='mr-auto break-all'>
                      {playlist?.data?.name}
                    </Text>
                    <Dialog.Close>
                      <IconButton
                        size={'3'}
                        radius='full'
                        variant='ghost'
                        color='gray'
                        highContrast
                        ml={'2'}
                      >
                        <Cross1Icon height={'20'} width={'20'} />
                      </IconButton>
                    </Dialog.Close>
                  </Dialog.Title>
                  <Dialog.Description size={'2'} className='break-words whitespace-pre-wrap'>
                    {playlist?.data?.description}
                  </Dialog.Description>
                </Dialog.Content>
              </Dialog.Root>

              {user?._id === playlist?.data?.owner._id &&
                <div className='flex justify-end gap-2 '>
                  {/* Add videos to playlist */}
                  <Tooltip content='Add videos' side='bottom'>
                    <IconButton
                      radius='full'
                      highContrast
                      variant='soft'
                      color='gray'
                      className='shadow-lg hover:shadow-black/30'
                      size={'3'}
                      asChild
                    >
                      <Link to={`/channel/${user?._id}/videos`}>
                        <PlusIcon width={'24'} height={'24'} />
                      </Link>
                    </IconButton>
                  </Tooltip>
                  {/* Edit playlist button and edit dialog */}
                  <Dialog.Root
                    open={isDialogOpen}
                    onOpenChange={handleDialogOpenChange}
                  >
                    <Tooltip content='Edit playlist' side='bottom'>
                      <Dialog.Trigger >
                        <IconButton
                          radius='full'
                          highContrast
                          variant='soft'
                          color='gray'
                          className='shadow-lg hover:shadow-black/30'
                          size={'3'}
                        >
                          <Pencil1Icon width={'22'} height={'22'} />
                        </IconButton>
                      </Dialog.Trigger>
                    </Tooltip>
                    <Dialog.Content maxWidth="500px">
                      <Dialog.Title>Edit playlist</Dialog.Title>
                      <Dialog.Description size="2" mb="4">
                        Make changes to your playlist.
                      </Dialog.Description>

                      <Flex direction="column" gap="3">
                        <label>
                          <Text as="div" size="2" mb="1" weight={'medium'}>
                            Title
                          </Text>
                          <TextField.Root
                            color={errors.name ? 'red' : 'blue'}
                            {...register('name', {
                              required: 'Title is required',
                              validate: value => value.trim() !== "" || "Please enter some text",

                            })}
                            placeholder="Enter title of playlist"
                            className={`${errors.name && 'shadow-inset-custom'} `}
                          />
                          {errors.name &&
                            <Text as='p' size={'1'} mt={'2'} color='red' className='flex items-center gap-1 '>
                              <InfoCircledIcon height={"16"} width={"16"} />{errors.name.message}
                            </Text>
                          }
                        </label>
                        <label>
                          <Text as="div" size="2" mb="1" weight={'medium'}>
                            Description
                          </Text>
                          <TextArea
                            resize={'vertical'}
                            color={errors.description ? 'red' : 'blue'}
                            {...register('description', {
                              required: 'Description is required',
                              validate: value => value.trim() !== "" || "Please enter some text",
                            })}
                            placeholder="Add description…"
                            className={`${errors.description && 'shadow-inset-textarea'} max-h-96`}
                          />
                          {errors.description &&
                            <Text as='p' size={'1'} mt={'2'} color='red' className='flex items-center gap-1 '>
                              <InfoCircledIcon height={"16"} width={"16"} />{errors.description.message}
                            </Text>
                          }
                        </label>
                      </Flex>

                      <Flex gap="3" mt="4" wrap={'wrap-reverse'}>
                        <Dialog.Close className='flex-1'>
                          <Button
                            disabled={updatingPlaylist}
                            type='button'
                            variant="surface"
                            color="gray"
                            highContrast
                            radius='full'
                          >
                            Cancel
                          </Button>
                        </Dialog.Close>
                        {/* <Dialog.Close> */}
                        <Button
                          type='submit'
                          onClick={handleSubmit(handleEditPlaylist)}
                          disabled={name.trim() === playlist?.data.name && description.trim() === playlist?.data.description || updatingPlaylist}
                          highContrast
                          radius='full'
                          className='flex-1 text-nowrap'
                        >
                          <Spinner loading={updatingPlaylist} />
                          Save changes
                        </Button>
                        {/* </Dialog.Close> */}
                      </Flex>
                    </Dialog.Content>
                  </Dialog.Root>
                  {/* Delete playlist button and alert dialog */}
                  <AlertDialog.Root>
                    <Tooltip content='Delete playlist' side='bottom'>
                      <AlertDialog.Trigger>
                        <IconButton
                          radius='full'
                          highContrast
                          variant='soft'
                          color='gray'
                          className='shadow-lg hover:shadow-black/30'
                          size={'3'}
                        >
                          <TrashIcon width={'22'} height={'22'} />
                        </IconButton>
                      </AlertDialog.Trigger>
                    </Tooltip>
                    <AlertDialog.Content maxWidth="450px">
                      <AlertDialog.Title>Delete playlist</AlertDialog.Title>
                      <AlertDialog.Description size="2">
                        Are you sure ? Deleting playlists is a permanent action and cannot be undone.
                      </AlertDialog.Description>

                      <Flex gap="3" mt="4" justify="end">
                        <AlertDialog.Cancel
                          disabled={isDeletingPlaylist}
                        >
                          <Button
                            color="gray"
                            radius='full'
                            variant="surface"
                          >
                            Cancel
                          </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action
                          onClick={e => {
                            e.preventDefault()
                          }}
                          disabled={isDeletingPlaylist}
                        >
                          <Button
                            loading={isDeletingPlaylist}
                            onClick={handleDeletePlaylist}
                            highContrast
                            radius='full'
                          >
                            Delete
                          </Button>
                        </AlertDialog.Action>
                      </Flex>
                    </AlertDialog.Content>
                  </AlertDialog.Root>
                </div>
              }
            </div>
          </div>
        </div>
      </Skeleton>
      <div className='flex flex-col flex-1 py-4 sm:px-2 lg:py-0'>
        {playlist?.data?.videos.length === 0 && <NoContent />}
        {loadingPlaylistData && Array.from({ length: 3 }).fill(1).map((item, i) => (
          <VideoCard2
            key={i}
            loading={loadingPlaylistData}
          />
        ))}
        {playlist?.data?.videos.map((video, i) => (
          <VideoCard2
            key={i}
            videoNumber={i + 1}
            video={video}
            playlistOwnerId={playlist?.data?.owner._id}
            removeType={'playlist'}
            playlistId={playlist?.data._id}
            loading={loadingPlaylistData}
            playlistName={playlist?.data?.name}
          />
        ))}
        <hr hidden={!playlist?.data?.videos.length} className="border-t border-[--gray-a6]" />

      </div>
    </div>

  )
}

export default PlaylistVideos



