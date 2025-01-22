import { InfoCircledIcon } from '@radix-ui/react-icons'
import { Button, Dialog, Flex, Text, TextArea, TextField } from '@radix-ui/themes'
import { useForm } from 'react-hook-form'
import React from 'react'
import { useCreatePlaylist } from '../lib/queries/playlistQueries'
import toast from 'react-hot-toast'
import { useAuth } from '../context/authContext'

function CreatePlaylistDialog({
  open,
  toggleOpen
}) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: '',
      description: ''
    }
  })
  const { user } = useAuth()
  const { mutate: createPlaylist, isPending: creatingPlaylist } = useCreatePlaylist(user?._id)

  const handleCreatePlaylist = (data) => {
    createPlaylist(data, {
      onSuccess: () => {
        open = false
        toggleOpen(open)
        toast('Playlist created')
        reset()
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
        toast.error(errorMessage);
      }
    })
  }



  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        toggleOpen(open)
        reset()
      }}
    >
      <Dialog.Content
        maxWidth={'600px'}
      >
        <Dialog.Title>
          New playlist
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Create a new playlist.
        </Dialog.Description>
        {/* input fields for name and description */}
        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight={'medium'}>
              Title <Text as='span' color='red' weight={'medium'}>*</Text>
            </Text>
            <TextField.Root
              color={errors.name ? 'red' : 'blue'}
              {...register('name', {
                required: 'Title is required',
                validate: value => value.trim() !== "" || "Please enter some text",

              })}
              placeholder="Enter title of playlist"
              className={`${errors.name && 'shadow-inset-custom'} `}
            />
            {errors.name &&
              <Text as='p' size={'1'} mt={'2'} color='red' className='flex items-center gap-1 '>
                <InfoCircledIcon height={"16"} width={"16"} />
                {errors.name.message}
              </Text>
            }
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight={'medium'}>
              Description <Text as='span' color='red' weight={'medium'}>*</Text>
            </Text>
            <TextArea
              resize={'vertical'}
              color={errors.description ? 'red' : 'blue'}
              {...register('description', {
                required: 'Description is required',
                validate: value => value.trim() !== "" || "Please enter some text",
              })}
              placeholder="Add description…"
              className={`${errors.description && 'shadow-inset-textarea'} min-h-32`}
            />
            {errors.description &&
              <Text as='p' size={'1'} mt={'2'} color='red' className='flex items-center gap-1 '>
                <InfoCircledIcon height={"16"} width={"16"} />
                {errors.description.message}
              </Text>
            }
          </label>
        </Flex>

        {/* Create and Canel button section */}
        <div className='flex w-full gap-4 mt-4 '>
          <Dialog.Close>
            <Button
              variant='surface'
              highContrast
              radius='full'
              color='gray'
              className='flex-1'
              disabled={creatingPlaylist}
              onClick={() => {
                reset()
              }}
            >
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            loading={creatingPlaylist}
            highContrast
            radius='full'
            className='flex-1 '
            onClick={handleSubmit(handleCreatePlaylist)}
          >
            Create
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default CreatePlaylistDialog
