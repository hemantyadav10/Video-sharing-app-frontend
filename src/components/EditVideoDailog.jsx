import { Button, Callout, Dialog, Flex, ScrollArea, Select, Text, TextArea, Tooltip } from '@radix-ui/themes'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BarLoader } from 'react-spinners'
import uploadImg from '../assets/uploadImg.png'
import { useAuth } from '../context/authContext'
import { useUpdateVideo } from '../lib/queries/videoQueries'
import { categories } from '../utils/categories'
import CloseButton from './CloseButton'
import TagInputComponent from './TagInputComponent'
import { MAX_IMAGE_SIZE } from '../constants'
import { InfoCircledIcon } from '@radix-ui/react-icons'



function EditVideoDailog({ children, video }) {
  const { _id: videoId } = video
  const { user } = useAuth()

  const { register, handleSubmit, reset, watch, resetField, formState: { errors } } = useForm({
    defaultValues: {
      title: video.title || '',
      description: video.description || '',
      videoThumbnail: ''
    },
    mode: "onChange"
  })
  const [category, setCategory] = useState(video.category || '')
  const [tags, setTags] = useState(video.tags || [])
  const [tagName, setTagName] = useState('')

  const [open, setOpen] = useState(false)

  const { mutate: updateVideo, isPending: updatingVideo, error, reset: resetError } = useUpdateVideo(user?._id)

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
          toast.success('Video updated')
          setOpen(false)
        },
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
          resetError()
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
        <Dialog.Description size="1" color='gray' className='px-4 pb-4  border-[#484848] border-b'>
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
        {/* Error Callout */}
        {error && (
          <Callout.Root
            m={'2'}
            color='red'
            variant='surface'
          >
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text className='flex items-center justify-between w-full'>
              {error?.response?.data?.message || 'Something went wrong. Please try again later'}
            </Callout.Text>
          </Callout.Root>
        )}

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
                      variant='surface'
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

              <label htmlFor="upload_thumbnail" className='hover:cursor-pointer' hidden={thumbnail}>
                <div
                  tabIndex={1}
                  className='w-full p-4 border-2 border-dashed rounded-xl border-[#484848] hover:opacity-85 transition-opacity space-y-2 focus-within:border-[#2870bd]'>
                  <div className='flex items-center justify-center p-8 mx-auto rounded-full w-max bg-[#00000040] mb-2'>
                    <img src={uploadImg} alt="" className='size-14 brightness-75' />
                  </div>
                  <Text align={'center'} as='p' size={'2'}  color='blue'>
                    Click to upload image
                  </Text>
                  <Text align={'center'} as='p' size={'1'} color='gray'>
                  JPEG, JPG, PNG, WEBP (Max. {MAX_IMAGE_SIZE}MB)
                  </Text>
                </div>
                <input
                  {...register('videoThumbnail', {
                    validate: {
                      acceptedFormats: files =>
                        ['image/jpeg', 'image/png', 'image/webp'].includes(
                          files[0]?.type
                        ) || 'Only JPEG, PNG, and WEBP formats are supported.',
                      maxThumbnailSize: files => files[0]?.size < MAX_IMAGE_SIZE * 1024 * 1024 || `The thumbnail size must not exceed ${MAX_IMAGE_SIZE}MB.`,
                    }
                  })}
                  accept=".jpg, .jpeg, .png, .webp"
                  type="file"
                  id='upload_thumbnail'
                  hidden
                />
              </label>
              {errors.videoThumbnail && <Text as='p' size={'1'} mt={'2'} color='red' className='flex items-center gap-1 '>
                <InfoCircledIcon height={"16"} width={"16"} />{errors.videoThumbnail.message}
              </Text>
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
              variant="surface"
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
              Save changes
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>

  )
}

export default EditVideoDailog
