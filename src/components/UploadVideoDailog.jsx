import { Cross1Icon, InfoCircledIcon, UploadIcon } from '@radix-ui/react-icons'
import { Button, Callout, Dialog, Flex, IconButton, ScrollArea, Select, Separator, Text, TextArea, TextField } from '@radix-ui/themes'
import CloseButton from './CloseButton'
import { set, useForm } from 'react-hook-form'
import { usePublishVideo } from '../lib/queries/videoQueries'
import toast from 'react-hot-toast'
import { BarLoader } from 'react-spinners'
import { useAuth } from '../context/authContext'
import { categories } from '../utils/categories'
import { useState } from 'react'
import TagInputComponent from './TagInputComponent'

const ErrorLine = ({ errors }) => {
  return (
    <>
      {errors
        ? <Text as='p' size={'1'} mt={'2'} color='red' className='flex items-center gap-1 '>
          <InfoCircledIcon height={"16"} width={"16"} />{errors.message}
        </Text>
        : null
      }
    </>
  )
}

function UploadVideoDialog({ children, isDialogOpen, setDialogOpen }) {
  const {
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      videoFile: '',
      thumbnail: '',
      title: '',
      description: ''
    }
  })
  const { user } = useAuth()
  const imageFile = watch('thumbnail')
  const video = watch('videoFile')
  const image = imageFile ? URL.createObjectURL(imageFile[0]) : null;
  const videoUrl = video ? URL.createObjectURL(video[0]) : null;
  const { mutate: publishVideo, isPending: publishingVideo } = usePublishVideo(user?._id)
  const [category, setCategory] = useState('')
  const [categoryError, setCategoryError] = useState(null)
  const [tagName, setTagName] = useState('')
  const [tags, setTags] = useState([])


  // Function to handle video upload
  const handleUploadVideo = async (data) => {
    if (category === '') {
      return setCategoryError({
        message: 'Category is required.'
      })
    }
    const formData = {
      video: data.videoFile[0],
      thumbnail: data.thumbnail[0],
      title: data.title?.trim(),
      description: data.description?.trim(),
      category: category.toLowerCase()
    }

    if (tags.length > 0) {
      formData["tags"] = tags
    }
    console.log(formData)
    publishVideo(formData, {
      onSuccess: () => {
        toast('Video uploaded sucessfully')
        setDialogOpen(false)
      }
    })
  }

  return (
    <Dialog.Root
      open={isDialogOpen}
      onOpenChange={open => {
        // reset form data when dialog is closed 
        if (publishingVideo) {
          setDialogOpen(true)
        } else {
          reset()
          setCategoryError(null)
          setCategory('')
          setTags([])
          setDialogOpen(open)
        }
      }}
    >
      <Dialog.Trigger>
        {children}
      </Dialog.Trigger>
      <Dialog.Content
        className={`relative flex flex-col p-0 md:min-w-max`}
        aria-describedby={undefined}
      >
        <Dialog.Title
          weight={'medium'}
          size={'4'}
          className='flex justify-between p-4 mb-0 border-b border-[#484848]'
        >
          <Text className='mr-auto '>
            Upload Video
          </Text>
          <Dialog.Close>
            <CloseButton />
          </Dialog.Close>
        </Dialog.Title>
        {/* Bar loading indicator when the video publishing is in progress */}
        <div className='absolute top-0 left-0 right-0'>
          <BarLoader
            color='#70b8ff'
            width={'100%'}
            height={'3px'}
            loading={publishingVideo}
            className='z-[101]'
          />
        </div>
        {publishingVideo && <div className='absolute inset-0 bg-black/30 top-14 rounded-b-xl z-[100]'></div>}
        {/* Callout- info */}
        <Callout.Root className='rounded-none' variant='surface'>
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            Your videos will be private untill you publish them.
          </Callout.Text>
        </Callout.Root>
        {/* Video Details section */}
        <ScrollArea type="auto" scrollbars="vertical" style={{ height: 448 }}>
          <Flex gap={'6'} className='flex-col p-4 md:flex-row md:p-6'>
            <Flex direction="column" gap="6">
              {/* Title */}
              <label>
                <Text
                  as="div"
                  size="2"
                  mb="1"
                  weight={'medium'}
                >
                  Title <Text as='span' color='red' weight={'medium'}>*</Text>
                </Text>
                <TextArea
                  autoFocus
                  resize={'vertical'}
                  color={errors.title ? 'red' : 'blue'}
                  {...register('title', {
                    required: 'Title is required.',
                    validate: value => value.trim() !== "" || "Please enter some text.",
                  })}
                  placeholder='Add a title that describes your video...'
                  className={`${errors.title && 'shadow-inset-custom'}`}
                  disabled={publishingVideo}
                />
                <ErrorLine errors={errors.title} />
              </label>
              {/* Description */}
              <label>
                <Text
                  as="div"
                  size="2"
                  mb="1"
                  weight={'medium'}
                >
                  Description <Text as='span' color='red' weight={'medium'}>*</Text>
                </Text>
                <TextArea
                  resize={'vertical'}
                  color={errors.description ? 'red' : 'blue'}
                  {...register('description', {
                    required: 'Description is required.',
                    validate: value => value.trim() !== "" || "Please enter some text",
                  })}
                  className={`${errors.description && 'shadow-inset-textarea'}`}
                  placeholder="Tell viewers about your video..."
                  disabled={publishingVideo}
                />
                <ErrorLine errors={errors.description} />
              </label>
              {/* Upload Thumbnail Section */}
              <div>
                <Text
                  as="p"
                  size="2"
                  weight={'medium'}
                  mb={'1'}
                >
                  Thumbnail <Text as='span' color='red' weight={'medium'}>*</Text>
                </Text>
                <Text as="p" size="1" mb="2" color='gray'>
                  Set a thumbnail that stands out and draws viewers' attention.
                </Text>
                <label htmlFor="upload_thumbnail" className='hover:cursor-pointer'>
                  <div className={`w-full min-h-40 flex flex-col justify-center items-center  border-2 border-dashed rounded-md  hover:opacity-85 transition-opacity gap-2 ${!errors.thumbnail ? "border-[#484848]" : "border-[#b54548]"} p-4 md:w-[384px]`}>
                    {!image
                      ? <><div className='flex items-center justify-center p-2  rounded-full w-max bg-[rgba(0,119,255,0.1)] mx-auto '>
                        <div className='p-[6px]   rounded-full bg-[#0077ff3a]'>
                          <UploadIcon width='24px' height='24px' className='text-[#c2e6ff]' fill='#c2e6ff' />
                        </div>
                      </div>
                        <Text align={'center'} as='p' size={'2'} color='blue'>
                          Click to upload image
                        </Text>
                        <Text align={'center'} as='p' size={'1'} color='gray'>
                          JPEG, JPG, PNG, SVG
                        </Text>
                      </>
                      : <img src={image} alt="" className='object-cover object-center w-full rounded-md aspect-video' />
                    }
                  </div>
                  <input
                    {...register('thumbnail', {
                      required: 'Thumbanil is required.'
                    })}
                    accept=".jpg, .jpeg, .png, .webp"
                    type="file"
                    id='upload_thumbnail'
                    hidden
                    disabled={publishingVideo}
                  />
                  <ErrorLine errors={errors.thumbnail} />
                </label>
              </div>
            </Flex>
            <div className='flex flex-col gap-6'>
              {/* Upload Video Section */}
              <div className='md:w-[384px] pt-4 md:pt-0 w-full'>
                <Text
                  as="p"
                  size="2"
                  weight={'medium'}
                  mb={'1'}
                >
                  Video <Text as='span' color='red' weight={'medium'}>*</Text>
                </Text>
                {!videoUrl && <>
                  <label htmlFor="upload_video" className='hover:cursor-pointer'>
                    <div className={`w-full h-40 border-2 border-dashed rounded-xl hover:opacity-85 transition-opacity gap-4 flex flex-col items-center justify-center ${errors.videoFile ? 'border-[#b54548]' : 'border-[#484848]'} `}>
                      <div>
                        <Text align={'center'} as='p' mb={'1'} size={'2'} color='blue'>
                          Click to upload video
                        </Text>
                      </div>
                      <Button
                        highContrast
                        radius='full'
                        tabIndex={-1}
                        className='pointer-events-none'
                      >
                        Select File
                      </Button>
                    </div>
                    <input
                      {...register('videoFile', {
                        required: 'Video file is required.'
                      })}
                      accept=".mp4, .webm, .mov, .avi, .mkv"
                      type="file"
                      id='upload_video'
                      hidden
                      disabled={publishingVideo}
                    />
                  </label>
                  <ErrorLine errors={errors.videoFile} />

                </>}
                {videoUrl && <div className='flex flex-col items-center '>
                  <div className='md:w-[384px]  w-full rounded-t-md  aspect-video '>
                    <video controls className='object-cover object-center w-full h-full rounded-t-md aspect-video'>
                      <source src={videoUrl} type="video/mp4" />
                    </video>
                    {/* <img
                    src="https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706_640.jpg"
                    alt=""
                    className='object-cover object-center w-full h-full rounded-t-xl'
                  /> */}
                  </div>
                  <div className='p-4 rounded-b-md bg-[#00000040]  w-full'>
                    <Text
                      color='gray'
                      as='span'
                      size={'1'}
                    >
                      Filename
                    </Text>
                    <Text
                      as='p'
                      size={'2'}
                      color='blue'
                      className=' line-clamp-1'
                    >
                      {video[0].name}
                    </Text>
                  </div>
                </div>}
              </div>
              {/* Category Section */}
              <label>
                <Text
                  as="div"
                  size="2"
                  mb="1"
                  weight={'medium'}
                >
                  Category <Text as='span' color='red' weight={'medium'}>*</Text>
                </Text>
                <Select.Root
                  value={category}
                  onValueChange={value => {
                    setCategory(value)
                    setCategoryError(null)
                  }}
                >
                  <Select.Trigger
                    className={`w-full ${categoryError && "shadow-inset-select"}`}
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
                <ErrorLine errors={categoryError} />
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
                  className='max-w-sm'
                />
                <Text as="p" size="1" mt="2" color='gray'>
                  Maximum 5 tags allowed. {5 - `${tags.length}`} remaining.
                </Text>
              </div>
            </div>

          </Flex>
        </ScrollArea>
        {/* Bottom section */}
        <Separator size={'4'} />
        <Flex
          p={'4'}
          justify={'end'}
          direction='row'
          gap={'3'}
        >
          <Dialog.Close>
            <Button
              variant='soft'
              highContrast
              color='gray'
              radius='full'
              className='px-4'
            >
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            highContrast
            radius='full'
            className='px-4'
            onClick={() => {
              if (category === '') {
                setCategoryError({
                  message: 'Category is required.'
                })
              }
              handleSubmit((data) => handleUploadVideo(data))()
            }}
            loading={publishingVideo}
          >
            Save
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default UploadVideoDialog
