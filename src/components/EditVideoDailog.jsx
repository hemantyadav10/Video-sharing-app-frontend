import { Button, Dialog, Flex, Text, TextArea, TextField, Tooltip } from '@radix-ui/themes'
import React, { useState } from 'react'
import CloseButton from './CloseButton'
import { UploadIcon } from '@radix-ui/react-icons'
import { set, useForm } from 'react-hook-form'
import { useUpdateVideo } from '../lib/queries/videoQueries'
import toast from 'react-hot-toast'
import { useAuth } from '../context/authContext'

function EditVideoDailog({ children, video }) {
  const { _id: videoId } = video
  const { user } = useAuth()

  const { register, handleSubmit, reset, watch, resetField } = useForm({
    defaultValues: {
      title: video.title || '',
      description: video.description || '',
      videoThumbnail: ''
    }
  })
  const [open, setOpen] = useState(false)

  const { mutate: updateVideo, isPending: updatingVideo } = useUpdateVideo(user?._id)

  const data = watch(['title', 'description', 'videoThumbnail'])
  const thumbnail = data[2] ? URL.createObjectURL(data[2][0]) : null;

  const handleEditVideo = async (info) => {
    const formData = {}
    if (info.title?.trim()) {
      formData.title = info.title
    }
    if (info.description?.trim()) {
      formData.description = info.description
    }
    if (info.videoThumbnail?.[0]) {
      formData.thumbnail = info.videoThumbnail?.[0]
    }

    if (Object.keys(formData).length > 0) {
      updateVideo({ videoId, formData }, {
        onSuccess: () => {
          toast('Video updated')
          setOpen(false)
        }
      })
    } else {
      toast('No changes to save')
    }
    console.log(formData)

  }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => {
      setOpen(o)
      resetField('videoThumbnail')
    }}>
      <Tooltip content='Edit video' side='bottom' >
        <Dialog.Trigger>
          {children}
        </Dialog.Trigger>
      </Tooltip>

      <Dialog.Content maxWidth="600px">
        <Dialog.Title className='flex justify-between'>
          <Text as='span' className='mr-auto'>
            Edit Video
          </Text>
          <CloseButton />
        </Dialog.Title>
        <Dialog.Description size="1" mb="4" color='gray' mt={'1'}>
          Make your video stand out with a fresh thumbnail, title, and description!
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <div>
            <Text as="p" size="2" weight={'medium'} mb={'1'}>
              Thumbnail
            </Text>
            <Text as="p" size="1" mb="2" color='gray'>
              Set a thumbnail that stands out and draws viewers' attention.
            </Text>
            {thumbnail &&
              <div className='w-full min-h-40 border-2 border-dashed rounded-xl border-[#484848]  space-y-2 p-2'>
                <img
                  src={thumbnail}
                  alt="thumbnail"
                  className='object-cover object-center w-full max-w-sm mx-auto aspect-video rounded-xl'
                />
                <div className='flex justify-center'>
                  <Button
                    variant='soft'
                    color='gray'
                    highContrast
                    className='w-full max-w-sm font-normal'
                    onClick={(e) => {
                      e.preventDefault()
                      resetField('videoThumbnail')
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            }
            {
              !thumbnail && <>
                <label htmlFor="upload_thumbnail" className='hover:cursor-pointer'>
                  <div className='w-full h-40 border-2 border-dashed rounded-xl border-[#484848] hover:opacity-85 transition-opacity space-y-2'>
                    <div className='flex items-center justify-center p-2  rounded-full w-max bg-[rgba(0,119,255,0.1)] mx-auto mt-4'>
                      <div className='p-[6px]   rounded-full bg-[#0077ff3a]'>
                        <UploadIcon width='24px' height='24px' className='text-[#c2e6ff]' fill='#c2e6ff' />
                      </div>
                    </div>
                    <Text align={'center'} as='p' size={'2'}  highContrast color='blue'>
                      Click to upload image
                    </Text>
                    <Text align={'center'} as='p' size={'1'} color='gray'>
                      JPEG, JPG, PNG, SVG
                    </Text>
                  </div>
                  <input
                    {...register('videoThumbnail')}
                    type="file"
                    id='upload_thumbnail'
                    hidden
                  />
                </label>
              </>
            }
          </div>
          <label>
            <Text as="div" size="2" mb="1" weight={'medium'}>
              Title
            </Text>
            <TextField.Root
              placeholder='Add a title that describes your video...'
              {...register('title')}
            />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight={'medium'}>
              Description
            </Text>
            <TextArea
              {...register('description')}
              className='h-28'
              placeholder="Tell viewers about your video..."
            />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify={'end'}>
          <Dialog.Close>
            <Button
              onClick={() => reset()}
              radius='full'
              variant="soft"
              color="gray"
              highContrast
              className='px-4'
            >
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button
              onClick={handleSubmit(handleEditVideo)}
              highContrast
              radius='full'
              loading={updatingVideo}
              disabled={!data[0]?.trim() && !data[1]?.trim() && !data[2]}
              className='px-4'
            >
              Save
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>

  )
}

export default EditVideoDailog
