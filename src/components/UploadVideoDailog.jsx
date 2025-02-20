import { InfoCircledIcon } from '@radix-ui/react-icons'
import { Button, Callout, Dialog, Flex, ScrollArea, Select, Separator, Text, TextArea } from '@radix-ui/themes'
import { Info } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BarLoader } from 'react-spinners'
import uploadImg from '../assets/uploadImg.png'
import { MAX_IMAGE_SIZE, MAX_VIDEO_SIZE } from '../constants'
import { useAuth } from '../context/authContext'
import { usePublishVideo } from '../lib/queries/videoQueries'
import { categories } from '../utils/categories'
import CloseButton from './CloseButton'
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

function UploadVideoDialog({
  children,
  isDialogOpen,
  setDialogOpen,
  limit,
  page,
}) {
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
    },
    mode: "onChange"
  })



  const { user } = useAuth()
  const imageFile = watch('thumbnail')
  const video = watch('videoFile')
  const image = imageFile ? URL.createObjectURL(imageFile?.[0]) : null;
  const videoUrl = video ? URL.createObjectURL(video?.[0]) : null;
  const { mutate: publishVideo, isPending: publishingVideo, error, reset: resetError } = usePublishVideo(user?._id, { limit, page })
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

    publishVideo(formData, {
      onSuccess: () => {
        toast.success('Video uploaded sucessfully')
        setDialogOpen(false)
        reset()
        resetError()
        setCategoryError(null)
        setCategory('')
        setTags([])
      },
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
          resetError()
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
          size={'5'}
          className='flex justify-between p-4 mb-0 border-b border-[--gray-a6]'
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
        {publishingVideo && <div className='absolute inset-0 bg-[--color-overlay] top-14 rounded-b-xl z-[100]'></div>}
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
        {/* Video Details section */}
        <ScrollArea type="auto" scrollbars="vertical" style={{ height: 448 }}>
          <Flex as='div' gap='1' align={'center'} px={'5'} pt={'4'}>
            <Info size={16} strokeWidth={'1.5'} /> <Text color='gray' highContrast size={'1'}>Your videos will be private until you publish them.</Text>
          </Flex>
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
                  className={`${errors.title && 'shadow-inset-textarea'}`}
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
                  <div className={`w-full min-h-40 flex flex-col justify-center items-center  border-2 border-dashed rounded-md  hover:opacity-85 transition-opacity gap-2 ${!errors.thumbnail ? "border-[--gray-a7]" : "border-[#b54548]"} p-4 md:w-[384px]`}>
                    {!image
                      ? <>
                        <div className='flex items-center justify-center p-8 mx-auto rounded-full w-max bg-[--color-background]'>
                          <img src={uploadImg} alt="" className='size-14 brightness-75' />
                        </div>
                        <Text align={'center'} as='p' size={'2'} color='blue'>
                          Click to upload image
                        </Text>
                        <Text align={'center'} as='p' size={'1'} color='gray'>
                          JPEG, JPG, PNG, WEBP (Max. {MAX_IMAGE_SIZE}MB)
                        </Text>
                      </>
                      : <img src={image} alt="" className='object-cover object-center w-full rounded-md aspect-video' />
                    }
                  </div>
                  <input
                    {...register('thumbnail', {
                      required: 'Thumbanil is required.',
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
                    disabled={publishingVideo}
                  />
                  <ErrorLine errors={errors.thumbnail} />
                </label>
              </div>
            </Flex>
            <div className='flex flex-col w-full gap-6 md:w-[384px]'>
              {/* Upload Video Section */}
              <div className='w-full pt-4 md:pt-0'>
                <Text
                  as="p"
                  size="2"
                  weight={'medium'}
                  mb={'1'}
                >
                  Video <Text as='span' color='red' weight={'medium'}>*</Text>
                </Text>
                <label htmlFor="upload_video" className='hover:cursor-pointer' hidden={videoUrl}>
                  <div className={`w-full  border-2 border-dashed rounded-xl hover:opacity-85 transition-opacity gap-4 flex flex-col items-center justify-center p-6 ${errors.videoFile ? 'border-[#b54548]' : 'border-[--gray-a7]'} `}>
                    <div>
                      <div className='flex items-center justify-center p-8 mx-auto rounded-full w-max bg-[--color-background] mb-2'>
                        <img src={uploadImg} alt="" className='size-14 brightness-75' />
                      </div>
                      <Text align={'center'} as='p' mb={'1'} size={'2'} color='blue'>
                        Click to upload video
                      </Text>
                      <Text align={'center'} as='p' size={'1'} color='gray'>
                        MP4, WEBM (Max. {MAX_VIDEO_SIZE}MB)
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
                      required: 'Video file is required.',
                      validate: {
                        acceptedFormats: files =>
                          ["video/webm", "video/mp4"].includes(
                            files[0]?.type
                          ) || 'Only MP4 and WEBM formats are supported.',
                        maxVideoSize: files => files[0]?.size < MAX_VIDEO_SIZE * 1024 * 1024 || `The video size must not exceed ${MAX_VIDEO_SIZE}MB.`,
                      }
                    })}
                    accept=".mp4, .webm"
                    type="file"
                    id='upload_video'
                    hidden
                    disabled={publishingVideo}
                  />
                </label>

                {videoUrl && <div className='flex flex-col items-center '>
                  <div className='w-full rounded-t-md aspect-video'>
                    <video controls className='object-cover object-center w-full h-full rounded-t-md aspect-video'>
                      <source src={videoUrl} type="video/mp4" />
                    </video>
                    {/* <img
                    src="https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706_640.jpg"
                    alt=""
                    className='object-cover object-center w-full h-full rounded-t-xl'
                  /> */}
                  </div>
                  <div className='p-4 rounded-b-md bg-[--gray-a2]  w-full'>
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
                <ErrorLine errors={errors.videoFile} />
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
              <div className='w-full'>
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
              variant='surface'
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
