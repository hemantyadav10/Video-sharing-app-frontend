import { BookmarkIcon, DotsVerticalIcon, PlusIcon } from '@radix-ui/react-icons'
import { Button, Checkbox, Dialog, DropdownMenu, Flex, IconButton, Separator, Spinner, Text } from '@radix-ui/themes'
import React, { useEffect, useState } from 'react'
import CloseButton from './CloseButton'
import { useAddVideoToPlaylist, useFetchUserPlaylists, useRemoveVideoFromPlaylist } from '../lib/queries/playlistQueries'
import { useAuth } from '../context/authContext'
import CreatePlaylistDialog from './CreatePlaylistDialog'
import toast from 'react-hot-toast'

function SaveToPlaylistButton({ videoData }) {
  const [openDialog, setOpenDialog] = useState(false)
  const [openCreatePlaylist, setOpenCreatePlaylist] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const { data: playlist, isLoading: loading } = useFetchUserPlaylists(user?._id, openDialog)
  const [checkedPlaylists, setCheckedPlaylists] = useState([])
  const { mutate: addVideoToPlaylist, isPending: addingVideo } = useAddVideoToPlaylist(videoData, user?._id)
  const { mutate: removeVideoFromPlaylist, isPending: removingVideo } = useRemoveVideoFromPlaylist(videoData, user?._id)
  const { _id: videoId } = videoData

  const handleClick = () => {
    setOpenDialog(true)
  }

  useEffect(() => {
    if (!loading) {
      // Initialize the checked state with the playlists that already have the video
      const videoInPlaylists = playlist?.data.filter(playlistData =>
        playlistData.videos.includes(videoId)
      ).map(playlistData => playlistData._id)
      // console.log(videoInPlaylists)

      setCheckedPlaylists(videoInPlaylists)
    }
  }, [playlist, videoId])


  const handleCheckboxChange = (playlistId, isChecked, playlistName) => {
    const updatedCheckedPlaylists = isChecked
      ? [...checkedPlaylists, playlistId]
      : checkedPlaylists.filter(id => id !== playlistId)
    setCheckedPlaylists(updatedCheckedPlaylists)
    console.log(updatedCheckedPlaylists)

    if (isChecked) {
      // Add the video to the playlist
      addVideoToPlaylist({ playlistId, videoId }, {
        onSuccess: () => {
          toast(`Added to ${playlistName}`)
          console.log(`Added to ${playlistName}`)
        }
      })
    }
    else {
      // Remove the video from the playlist
      removeVideoFromPlaylist({ playlistId, videoId }, {
        onSuccess: () => {
          toast(`Removed from ${playlistName}`)
          console.log(`Removed from ${playlistName}`)
        }
      })
    }
  }



  return (
    <div className='z-10 flex items-center' >
      {/* dropdown menu - save to playlist button */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger hidden={!isAuthenticated}>
          <IconButton
            aria-label="More options"
            className='bg-transparent hover:bg-[#ddeaf814] active:bg-[#d3edf81d] '
            color='gray'
            radius='full'
          >
            <DotsVerticalIcon width="18" height="18" />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content variant='soft'>
          <DropdownMenu.Item
            onClick={handleClick}
          >
            <BookmarkIcon /> Save to Playlist
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {/* save to playlist dialog - all playlist listed */}
      <Dialog.Root
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open)
        }}
      >
        <Dialog.Content
          aria-describedby={undefined}
          maxWidth={'450px'}
          className='flex flex-col p-0'
        >
          <Dialog.Title
            size={'3'}
            weight={'medium'}
            mb={'0'}
            className='flex items-center justify-between p-6'
          >
            <Text className='w-full'>
              Save video to..
            </Text>
            {/* <CloseButton /> */}
          </Dialog.Title>
          <div className={`relative py-2 ${(loading || addingVideo || removingVideo) && 'opacity-50'}`}>
            {
              (loading || addingVideo || removingVideo) &&
              <div className='absolute inset-0 flex items-center justify-center'>
                <Spinner className='mx-auto' size={'3'} />
              </div>
            }
            {playlist?.data.map((data) => (
              <Text
                as="label"
                size="2"
                className={`cursor-pointer ${(loading || addingVideo || removingVideo) && 'pointer-events-none'} `}
                title={data.name}
              >
                <Flex
                  gap="2"
                  py={'2'}
                  px={'5'}
                  align={'center'}
                  className='hover:bg-[#0c0c0dcc] transition-all'
                >
                  <Checkbox
                    highContrast
                    size={'3'}
                    variant='classic'
                    checked={checkedPlaylists?.includes(data._id)}
                    onCheckedChange={(checked) => handleCheckboxChange(data._id, checked, data.name)}
                  />
                  <p className='line-clamp-1'>
                    {data.name}
                  </p>
                </Flex>
              </Text>
            ))}

          </div>
          <div className='flex flex-wrap-reverse gap-4 p-6'>
            <Dialog.Close>
              <Button
                className='flex-1 text-nowrap'
                variant='outline'
                radius='full'
                color='gray'
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              onClick={() => {
                setOpenCreatePlaylist(true)
              }}
              highContrast
              radius='full'
              size={'2'}
              className='flex-1 text-nowrap'
            >
              <PlusIcon width={'20'} height={'20'} /> New playlist
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Root>

      {/* Create new playlist */}
      <CreatePlaylistDialog
        open={openCreatePlaylist}
        toggleOpen={setOpenCreatePlaylist}
      />
    </div >
  )
}

export default SaveToPlaylistButton
