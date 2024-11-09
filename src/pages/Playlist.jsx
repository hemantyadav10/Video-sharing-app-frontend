import { Cross1Icon, InfoCircledIcon, Pencil1Icon, PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { AlertDialog, Avatar, Button, Dialog, Flex, IconButton, Text, TextArea, TextField, Tooltip } from '@radix-ui/themes'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import VideoCard2 from '../components/VideoCard2'
import { useDeletePlaylist, useFetchPlaylistById, useUpdatePlaylist } from '../lib/queries/playlistQueries'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../context/authContext'
import noThumbnail from '../assets/noThumbnail.webp'

function PlaylistVideos() {
  const { playlistId } = useParams();
  const { user } = useAuth()
  const { data: playlist } = useFetchPlaylistById(playlistId)
  const { mutate: updatePlaylist, isPending: updatingPlaylist } = useUpdatePlaylist(playlistId)
  const { mutate: deletePlaylist } = useDeletePlaylist(playlistId, user?._id)
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

  useEffect(() => {
    if (playlist) {
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
      onError: () => {
        toast.error('Error updating playlist')
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

  console.log(playlist)


  // Function to delete playlist 
  const handleDeletePlaylist = async () => {
    deletePlaylist(playlistId, {
      onSuccess: () => {
        toast('Playlist deleted')
        navigate('/playlists')
      }
    })
  }

  return (
    <div className="flex flex-col w-full mb-16 lg:flex-row lg:p-6">
      <div
        className={`relative p-4 bg-cover bg-center sm:p-6  lg:rounded-t-2xl lg:h-[calc(100vh-122px)] lg:sticky lg:top-[88px] sm:px-24 md:px-6 overflow-hidden bg-fixed`}
        style={{ backgroundImage: `url(${playlist?.data?.videos[0]?.thumbnail})` }}
      >
        <div hidden={!playlist?.data.videos.length} className="absolute inset-0 z-0 bg-gradient-to-b from-white/20 to-[#111113] backdrop-blur-xl"></div>
        <div className="relative z-10 flex flex-col w-full gap-6 text-xs md:flex-row md:items-center lg:flex-col lg:w-80">
          {playlist?.data?.videos.length > 0 && <div className='w-full'>
            <img
              src={playlist?.data?.videos[0]?.thumbnail || ''}
              alt=""
              className="object-cover object-center w-full rounded-xl aspect-video"
            />
          </div>}
          <div className='flex flex-col w-full gap-4 text-white'>
            <p className='text-xl font-bold sm:text-2xl line-clamp-2'>
              {playlist?.data?.name}
            </p>
            <div className='space-y-2'>
              <Link to={`/channel/${playlist?.data?.owner._id}/videos`} className='flex items-center gap-2 hover:opacity-90'>
                <Avatar
                  radius='full'
                  size={'1'}
                  src={playlist?.data?.owner.avatar}
                  alt='avatar'
                  fallback="A"
                />
                <p className='font-medium '>
                  by {playlist?.data?.owner.username}
                </p>
              </Link>
              <p className=''>
                Playlist • {playlist?.data?.totalVideos} videos
              </p>
            </div>
            <Dialog.Root >
              <Dialog.Trigger className='cursor-pointer'>
                <Text as='p' className='relative'>
                  <span className='line-clamp-2 '>
                    {playlist?.data?.description}
                  </span>
                  <button className='absolute w-full font-semibold text-left'>...more</button>
                </Text>
              </Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Title size={'3'} className='flex justify-between '>
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
                  {playlist?.data.description}
                </Dialog.Description>
              </Dialog.Content>
            </Dialog.Root>

            {user?._id === playlist?.data?.owner._id &&
              <div className='flex justify-end gap-2 '>
                {/* Add videos to playlist */}
                <Link to={`/channel/${user?._id}/videos`}>
                  <Tooltip content='Add videos'><IconButton radius='full' variant='soft' highContrast><PlusIcon width={'20'} height={'20'} /></IconButton></Tooltip>
                </Link>
                {/* Edit playlist button and edit dialog */}
                <Dialog.Root
                  open={isDialogOpen}
                  onOpenChange={handleDialogOpenChange}
                >
                  <Tooltip content='Edit playlist'>
                    <Dialog.Trigger >
                      <IconButton radius='full' variant='soft' highContrast><Pencil1Icon width={'20'} height={'20'} /></IconButton>
                    </Dialog.Trigger>
                  </Tooltip>
                  <Dialog.Content maxWidth="450px">
                    <Dialog.Title>Edit playlist</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                      Make changes to your playlist.
                    </Dialog.Description>

                    <Flex direction="column" gap="3">
                      <label>
                        <Text as="div" size="2" mb="1" color='gray'>
                          Title
                        </Text>
                        <TextField.Root
                          color={errors.name ? 'red' : 'blue'}
                          {...register('name', {
                            required: 'Title is required',
                            validate: value => value.trim() !== "" || "Please enter some text",

                          })}
                          placeholder="Enter title of playlist"
                        />
                        {errors.name &&
                          <Text as='p' size={'1'} mt={'2'} color='red' className='flex items-center gap-1 '>
                            <InfoCircledIcon height={"16"} width={"16"} />{errors.name.message}
                          </Text>
                        }
                      </label>
                      <label>
                        <Text as="div" size="2" mb="1" color='gray'>
                          Description
                        </Text>
                        <TextArea
                          color={errors.description ? 'red' : 'blue'}
                          {...register('description', {
                            required: 'Description is required',
                            validate: value => value.trim() !== "" || "Please enter some text",
                          })}
                          placeholder="Add description…"
                        />
                        {errors.description &&
                          <Text as='p' size={'1'} mt={'2'} color='red' className='flex items-center gap-1 '>
                            <InfoCircledIcon height={"16"} width={"16"} />{errors.description.message}
                          </Text>
                        }
                      </label>
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                      <Dialog.Close>
                        <Button
                          disabled={updatingPlaylist}
                          type='button' variant="soft" color="gray" highContrast>
                          Cancel
                        </Button>
                      </Dialog.Close>
                      {/* <Dialog.Close> */}
                      <Button
                        type='submit'
                        loading={updatingPlaylist}
                        onClick={handleSubmit(handleEditPlaylist)}
                        disabled={name.trim() === playlist?.data.name && description.trim() === playlist?.data.description}
                        variant='soft'
                        highContrast
                      >
                        Save
                      </Button>
                      {/* </Dialog.Close> */}
                    </Flex>
                  </Dialog.Content>
                </Dialog.Root>
                {/* Delete playlist button and alert dialog */}
                <AlertDialog.Root>
                  <Tooltip content='Delete playlist'>
                    <AlertDialog.Trigger>
                      <IconButton radius='full' variant='soft' highContrast><TrashIcon width={'20'} height={'20'} /></IconButton>
                    </AlertDialog.Trigger>
                  </Tooltip>
                  <AlertDialog.Content maxWidth="450px">
                    <AlertDialog.Title>Delete playlist</AlertDialog.Title>
                    <AlertDialog.Description size="2">
                      Are you sure? Deleting playlists is a permanent action and cannot be undone.
                    </AlertDialog.Description>

                    <Flex gap="3" mt="4" justify="end">
                      <AlertDialog.Cancel>
                        <Button variant="soft" color="gray" highContrast>
                          Cancel
                        </Button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action>
                        <Button onClick={handleDeletePlaylist} variant="soft" highContrast>
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
      <div className='flex flex-col flex-1 py-4 sm:px-2 lg:py-0'>
        {playlist?.data.videos.length === 0 &&
          <p className='text-sm font-medium text-center'>No videos in this playlist</p>
        }

        {playlist?.data.videos.map((video, i) => (
          <VideoCard2
            key={i}
            videoNumber={i + 1}
            video={video}
            playlistOwnerId={playlist?.data?.owner._id}
          />
        ))}
        <hr hidden={!playlist?.data.videos.length} className="border-t border-[#484848]" />

      </div>
    </div>

  )
}

export default PlaylistVideos



