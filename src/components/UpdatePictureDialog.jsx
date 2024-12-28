import { ColumnSpacingIcon, Cross1Icon } from '@radix-ui/react-icons'
import { Box, Button, Dialog, Flex, IconButton, Text } from '@radix-ui/themes'
import React, { useState } from 'react'
import { useUpdateAvatar, useUpdateCoverImage } from '../lib/queries/userQueries'
import { BarLoader } from 'react-spinners'
import toast from 'react-hot-toast'
import { useAuth } from '../context/authContext'

function UpdatePictureDialog({
  type = 'avatar',
  title = 'Update picture',
  image,
  open,
  setOpenDialog,
  clearImages,
  imageFile
}) {
  const { setUser } = useAuth()
  const { mutate: updateAvatar, isPending: updateAvatarLoading } = useUpdateAvatar()
  const { mutate: updateCoverImage, isPending: updateCoverLoading } = useUpdateCoverImage()

  const handleUpdateImage = async () => {
    if (!imageFile) {
      toast.error('No image file selected');
      return;
    }

    const formData = new FormData();
    const key = type === "avatar" ? "avatar" : "coverImage";

    formData.append(key, imageFile);

    if (type === "avatar") {
      updateAvatar(formData, {
        onSuccess: (res) => {
          toast('Avatar updated successfully');
          const userDetails = JSON.parse(localStorage.getItem('user'))
          localStorage.setItem('user', JSON.stringify({ ...userDetails, avatar: res.data.avatar }))
          setUser(prev => ({
            ...prev,
            avatar: res.data.avatar
          }))
          setOpenDialog(false)
        },
      });
    } else {
      updateCoverImage(formData, {
        onSuccess: (res) => {
          toast('Cover image updated successfully');
          const userDetails = JSON.parse(localStorage.getItem('user'))
          localStorage.setItem('user', JSON.stringify({ ...userDetails, coverImage: res.data.coverImage }))
          setUser(prev => ({
            ...prev,
            coverImage: res.data.coverImage
          }))
          setOpenDialog(false)
        },
      });
    }
  };

  return (
    <>
      <Dialog.Root
        open={open}
        onOpenChange={(isOpen) => {
          if (updateAvatarLoading || updateCoverLoading) {
            setOpenDialog(true)
          } else {
            if (!isOpen) clearImages();
            setOpenDialog(isOpen)
          }
        }}
      >
        <Dialog.Content
          maxWidth={'900px'}
          className='flex flex-col p-0'
          aria-describedby={undefined}
        >
          <Dialog.Title
            weight={'medium'}
            size={'4'}
            className='flex justify-between p-4 border-b border-[#484848]  mb-0'
          >
            <Text className='mr-auto '>
              {title}
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
          <Flex align={'center'} justify={'center'} position={'relative'}>
            <div className='absolute top-0 left-0 right-0'>
              <BarLoader
                color='#70b8ff'
                width={'100%'}
                height={'2px'}
                loading={updateAvatarLoading || updateCoverLoading}
              />
            </div>
            <Box className={`flex items-center  justify-center flex-1 m-6  ${type === 'avatar' ? "aspect-square max-w-sm rounded-full" : "rounded-lg aspect-[6/1]"}  overflow-hidden`}>
              {image &&
                <img
                  src={image}
                  className={`w-full h-full object-cover object-center ${type == "avatar" ? "rounded-full" : "rounded-lg"}`}
                />
              }
            </Box>
          </Flex>
          <div className='flex justify-end gap-4 p-4 border-t border-[#484848]'>
            <Dialog.Close>
              <Button variant='surface' radius='full' highContrast color='gray'>
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              onClick={handleUpdateImage}
              radius='full'
              highContrast
              loading={updateAvatarLoading || updateCoverLoading}
            >
              Update
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}

export default UpdatePictureDialog
