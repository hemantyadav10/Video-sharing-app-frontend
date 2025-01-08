import { Button, Dialog, Flex, ScrollArea, Select, Text, TextArea, TextField, Tooltip } from '@radix-ui/themes'
import React, { useState } from 'react'
import CloseButton from './CloseButton'
import { UploadIcon } from '@radix-ui/react-icons'
import { set, useForm } from 'react-hook-form'
import { useUpdateVideo } from '../lib/queries/videoQueries'
import toast from 'react-hot-toast'
import { useAuth } from '../context/authContext'
import { categories } from '../utils/categories'
import TagInputComponent from './TagInputComponent'
import { BarLoader } from 'react-spinners'

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
  const [category, setCategory] = useState(video.category || '')
  const [tags, setTags] = useState(video.tags || [])
  const [tagName, setTagName] = useState('')

  const [open, setOpen] = useState(false)

  const { mutate: updateVideo, isPending: updatingVideo } = useUpdateVideo(user?._id)

  const data = watch(['title', 'description', 'videoThumbnail'])
  const thumbnail = data[2] ? URL.createObjectURL(data[2][0]) : null;

  const handleEditVideo = async (info) => {
    const formData = {}

    // Update title if it's provided and changed
    if (info.title?.trim() && info.title !== video?.title) {
      formData.title = info.title
    }

    // Update description if it's provided and changed
    if (info.description?.trim() && info.description !== video?.description) {
      formData.description = info.description
    }

    // Update thumbnail if a new file is selected
    if (info.videoThumbnail?.[0]) {
      formData.thumbnail = info.videoThumbnail?.[0]
    }

    // Update category if it's changed
    if (category !== video?.category) {
      formData.category = category
    }

    // Ensure tags is always sent, even if it's an empty array
    if (tags?.length === 0) {
      formData.tags = JSON.stringify([])
    } else {
      formData.tags = tags
    }

    // Only proceed if there are changes to save
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
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (updatingVideo) {
          setOpen(true)
        } else {
          setOpen(o)
          resetField('videoThumbnail')
          setCategory(video?.category)
          setTags(video?.tags)
        }
      }}
    >
      <Tooltip content='Edit video' side='bottom' >
        <Dialog.Trigger>
          {children}
        </Dialog.Trigger>
      </Tooltip>

      <Dialog.Content maxWidth="600px" className='relative p-0'>
        <Dialog.Title className='flex justify-between p-4 pb-1'>
          <Text as='span' className='mr-auto'>
            Edit Video
          </Text>
          <CloseButton />
        </Dialog.Title>
        <Dialog.Description size="1" color='gray'  className='px-4 pb-4  border-[#484848] border-b'>
          Make your video stand out with a fresh thumbnail, title, and description!
        </Dialog.Description>
        <div className='absolute top-0 left-0 right-0'>
          <BarLoader
            color='#70b8ff'
            width={'100%'}
            height={'3px'}
            loading={updatingVideo}
            className='z-[101]'
          />
        </div>
        {updatingVideo && <div className='absolute inset-0 bg-black/30 top-14 rounded-b-xl z-[100]'></div>}

        {updatingVideo && <div className='absolute inset-0 bg-black/30 top-14 rounded-b-xl z-[100]'></div>}
        <ScrollArea type="auto" scrollbars="vertical" style={{ height: 448 }} className='p-0'>
          <Flex direction="column" gap="5" p={'4'}>
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
                    src={thumbnail || video.thumbnail}
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
                    <div
                      tabIndex={1}
                      className='w-full h-40 border-2 border-dashed rounded-xl border-[#484848] hover:opacity-85 transition-opacity space-y-2 focus-within:border-[#2870bd]'>
                      <div className='flex items-center justify-center p-2  rounded-full w-max bg-[rgba(0,119,255,0.1)] mx-auto mt-4'>
                        <div className='p-[6px]   rounded-full bg-[#0077ff3a]'>
                          <UploadIcon width='24px' height='24px' className='text-[#c2e6ff]' fill='#c2e6ff' />
                        </div>
                      </div>
                      <Text align={'center'} as='p' size={'2'} highContrast color='blue'>
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
              <TextArea
                resize={'vertical'}
                autoFocus
                placeholder='Add a title that describes your video...'
                {...register('title')}
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight={'medium'}>
                Description
              </Text>
              <TextArea
                resize={'vertical'}
                {...register('description')}
                className='h-28'
                placeholder="Tell viewers about your video..."
              />
            </label>
            <label>
              <Text
                as="div"
                size="2"
                mb="1"
                weight={'medium'}
              >
                Category
              </Text>
              <Select.Root
                value={category}
                onValueChange={value => {
                  setCategory(value)
                }}
              >
                <Select.Trigger
                  className={`w-full`}
                  placeholder="Select a category"
                />
                <Select.Content position="popper" highContrast >
                  {categories.map(category => (
                    <Select.Item
                      key={category}
                      value={category}
                      className='capitalize'
                    >
                      {category}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>

            </label>
            {/* Tags Section */}
            <div>
              <label
                htmlFor='tag_input'
                className='flex-1 text-sm font-medium'
              >
                Tags
              </label>
              <Text as="p" size="1" mb="2" color='gray'>
                Choose tags that best represent your video content.
              </Text>
              <TagInputComponent
                setTagName={setTagName}
                tagName={tagName}
                tags={tags}
                setTags={setTags}
              />
              <Text as="p" size="1" mt="2" color='gray'>
                Maximum 5 tags allowed. {5 - `${tags?.length}`} remaining.
              </Text>
            </div>

          </Flex>
        </ScrollArea>

        <Flex gap="3" justify={'end'} p={'4'} className='border-t border-[#484848]'>
          <Dialog.Close>
            <Button
              onClick={() => reset()}
              radius='full'
              variant="soft"
              color="gray"
              disabled={updatingVideo}
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
              disabled={!data[0]?.trim() && !data[1]?.trim() && !data[2] || updatingVideo}
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
