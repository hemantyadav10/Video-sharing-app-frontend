import { DotsVerticalIcon, PlusIcon } from '@radix-ui/react-icons'
import { Button, Checkbox, Dialog, DropdownMenu, Flex, IconButton, Spinner, Text } from '@radix-ui/themes'
import { Link, ListPlus, Share } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/authContext'
import { useAddVideoToPlaylist, useFetchUserPlaylists, useRemoveVideoFromPlaylist } from '../lib/queries/playlistQueries'
import CreatePlaylistDialog from './CreatePlaylistDialog'

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

  const handleCopyLink = () => {
    const videoLink = `${window.location.origin}/watch/${videoId}`

    navigator.clipboard.writeText(videoLink);
    toast.success('Link copied')
  }

  useEffect(() => {
    if (!loading) {
      // Initialize the checked state with the playlists that already have the video
      const videoInPlaylists = playlist?.data.filter(playlistData =>
        playlistData.videos.includes(videoId)
      ).map(playlistData => playlistData._id)

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
          toast.success(`Added to ${playlistName}`)
          console.log(`Added to ${playlistName}`)
        },
        onError: (error) => {
          // Uncheck if error occurs
          const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
          toast.error(errorMessage);

          // Rollback changes
          const revertedCheckedPlaylists = checkedPlaylists.filter(id => id !== playlistId);
          setCheckedPlaylists(revertedCheckedPlaylists);
        }
      })
    }
    else {
      // Remove the video from the playlist
      removeVideoFromPlaylist({ playlistId, videoId }, {
        onSuccess: () => {
          toast.success(`Removed from ${playlistName}`)
          console.log(`Removed from ${playlistName}`)
        },
        onError: (error) => {
          const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
          toast.error(errorMessage);

          // Rollback changes
          const revertedCheckedPlaylists = [...checkedPlaylists, playlistId];
          setCheckedPlaylists(revertedCheckedPlaylists);
        }
      })
    }
  }

  if (!isAuthenticated) return null;

  return (
    <div className='z-10 flex items-center'
      title='More Options'
    >
      {/* ====== Dropdown menu - save to playlist button ====== */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton
            variant='ghost'
            mx={1}
            size={'3'}
            aria-label="More options"
            color='gray'
            radius='full'
            highContrast
          >
            <DotsVerticalIcon width="18" height="18" />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content variant='soft'>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              <Share size={18} strokeWidth={1.25} /> Share
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent className='min-w-40'>
              <DropdownMenu.Item
                onClick={handleCopyLink}
              >
                <Link size={16} strokeWidth={1.25} /> Copy Link
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Item
            onClick={handleClick}
          >
            <ListPlus size={18} strokeWidth={1.25} /> Add to Playlist
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {/* ====== Save to playlist dialog - all playlist listed ====== */}
      <Dialog.Root
        open={openDialog}
        onOpenChange={setOpenDialog}
      >
        <Dialog.Content
          aria-describedby={undefined}
          maxWidth={'450px'}
          className='flex flex-col p-0'
        >
          <Dialog.Title
            size={'4'}
            weight={'medium'}
            mb={'1'}
            className='p-6'
          >
            Save video to..
          </Dialog.Title>
          <div className={`relative py-2 ${(addingVideo || removingVideo) && 'bg-opacity-50'}`}>
            {
              (loading || addingVideo || removingVideo) &&
              <div className='absolute inset-0 flex items-center justify-center'>
                <Spinner className='mx-auto' size={'3'} />
              </div>
            }
            {playlist?.data.map((data) => (
              <Text
                key={data._id}
                as="label"
                size="2"
                className={`cursor-pointer ${(addingVideo || removingVideo) && 'pointer-events-none'} `}
                title={data.name}
              >
                <Flex
                  gap="2"
                  py={'2'}
                  px={'5'}
                  align={'center'}
                  className='hover:bg-[--gray-a3] transition-all'
                >
                  <Checkbox
                    highContrast
                    size={'3'}
                    variant='surface'
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

      {/* ====== Create new playlist ====== */}
      <CreatePlaylistDialog
        open={openCreatePlaylist}
        toggleOpen={setOpenCreatePlaylist}
      />
    </div >
  )
}

export default SaveToPlaylistButton
