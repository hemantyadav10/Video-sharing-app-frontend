import { Pencil1Icon, PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { AlertDialog, Avatar, Button, Dialog, Flex, IconButton, Text, TextArea, TextField, Tooltip } from '@radix-ui/themes'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import VideoCard2 from '../components/VideoCard2'
import { useFetchPlaylistById } from '../lib/queries/playlistQueries'

function PlaylistVideos() {
  const { playlistId } = useParams();
  const { data: playlist } = useFetchPlaylistById(playlistId)

  console.log(playlist)
  return (
    <div className="flex flex-col w-full mb-16 lg:flex-row lg:p-6">
      <div
        className={`relative p-4 bg-cover bg-center sm:p-6 overflow-hidden lg:rounded-t-2xl lg:h-[calc(100vh-122px)] lg:sticky lg:top-[88px] sm:px-24 md:px-6`}
        style={{ backgroundImage: `url(${playlist?.data.videos[0].thumbnail})` }}
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/20 to-[#111113] backdrop-blur-xl"></div>
        <div className="relative z-10 flex flex-col w-full gap-6 text-xs md:flex-row md:items-center lg:flex-col lg:w-80 ">
          <div className='w-full'>
            <img
              src={playlist?.data.videos[0].thumbnail}
              alt=""
              className="object-cover object-center w-full rounded-xl aspect-video"
            />
          </div>
          <div className='flex flex-col w-full gap-4 text-white'>
            <p className='text-xl font-bold sm:text-2xl'>
              {playlist?.data.name}
            </p>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Avatar
                  radius='full'
                  size={'1'}
                  src={playlist?.data.owner.avatar}
                  alt='avatar'
                  fallback="A"
                />
                <p className='font-medium '>
                  by {playlist?.data.owner.username}
                </p>
              </div>
              <p className=''>
                Playlist • {playlist?.data.totalVideos} videos
              </p>
            </div>
            <p>
              {playlist?.data.description}
            </p>
            <div className='flex justify-end gap-2 '>
              {/* Add videos to playlist */}
              <Link to={'/channel/hemant/videos'}>
                <Tooltip content='Add videos'><IconButton radius='full' variant='soft' highContrast><PlusIcon width={'20'} height={'20'} /></IconButton></Tooltip>
              </Link>
              {/* Edit playlist button and edit dialog */}
              <Dialog.Root>
                <Tooltip content='Edit playlist'>
                  <Dialog.Trigger>
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
                        defaultValue="Freja Johnsen"
                        placeholder="Enter title of playlist"
                      />
                    </label>
                    <label>
                      <Text as="div" size="2" mb="1" color='gray'>
                        Description
                      </Text>
                      <TextArea placeholder="Add description…" />
                    </label>
                  </Flex>

                  <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                      <Button variant="soft" color="gray" highContrast>
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                      <Button variant='soft' highContrast>Save</Button>
                    </Dialog.Close>
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
                      <Button variant="soft" highContrast>
                        Delete
                      </Button>
                    </AlertDialog.Action>
                  </Flex>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </div>

          </div>
        </div>
      </div>
      <div className='flex flex-col flex-1 py-4 sm:px-2 lg:py-0'>

        {playlist?.data.videos.map((video, i) => (
          <VideoCard2
            key={i}
            videoNumber={i + 1}
            video={video}
          />
        ))}
        <hr className="border-t border-[#484848]" />

      </div>
    </div>

  )
}

export default PlaylistVideos



