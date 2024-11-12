import { BookmarkIcon, DotsVerticalIcon, PlusIcon } from '@radix-ui/react-icons'
import { Button, Checkbox, CheckboxGroup, Dialog, DropdownMenu, Flex, IconButton, Spinner, Text } from '@radix-ui/themes'
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
  const { data: playlist, isLoading: loading } = useFetchUserPlaylists(user?._id)
  const [checkedPlaylists, setCheckedPlaylists] = useState([])
  const { mutate: addVideoToPlaylist } = useAddVideoToPlaylist(videoData, user?._id)
  const { mutate: removeVideoFromPlaylist } = useRemoveVideoFromPlaylist(videoData, user?._id)
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
      console.log(videoInPlaylists)

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
        <Dialog.Content aria-describedby={undefined} width={'360px'} className='flex flex-col gap-8' >
          <Dialog.Title
            size={'3'}
            weight={'medium'}
            className='flex items-center justify-between mb-0'
          >
            <Text className='w-full'>
              Save video to..
            </Text>
            <CloseButton />
          </Dialog.Title>
          {loading && <Spinner className='mx-auto' size={'3'} />}
          {!loading && playlist?.data.map((data) => (
            <Text as="label" size="2" className='cursor-pointer'>
              <Flex gap="2">
                <Checkbox
                  highContrast
                  size={'3'}
                  checked={checkedPlaylists.includes(data._id)}
                  onCheckedChange={(checked) => handleCheckboxChange(data._id, checked, data.name)}
                />
                <p className='line-clamp-1'>
                  {data.name}
                </p>
              </Flex>
            </Text>
          ))}
          {/* <CheckboxGroup.Root
            highContrast
            size={'3'}
            className='space-y-4'
          >
            {!loading && playlist?.data.map((playlistData) => (
              <CheckboxGroup.Item
                key={playlistData._id}
                value={playlistData.name}
                className='flex items-center w-full gap-4 cursor-pointer'
                checked={checkedPlaylists.includes(playlistData._id)}
                // onChange={(checked) => {
                //   handleCheckboxChange(playlistData._id, checked)
                //   console.log('hello')
                // }}
                onche={() => {
                  console.log('hello')
                }}
            //     onClick={(checkedPlaylists.includes(playlistData._id)) => {
            //   console.log('hello')
            // }}
              >
            <Text size={'2'} className=' line-clamp-1'>
              {playlistData.name}
            </Text>
          </CheckboxGroup.Item>
            ))}
        </CheckboxGroup.Root> */}
          <Button
            onClick={() => {
              setOpenCreatePlaylist(true)
            }}
            variant='soft'
            highContrast
            className='w-full'
            radius='full'
            size={'2'}
          >
            <PlusIcon width={'20'} height={'20'} /> New playlist
          </Button>
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
