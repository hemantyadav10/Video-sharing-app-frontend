import { EnvelopeClosedIcon, InfoCircledIcon, PersonIcon } from '@radix-ui/react-icons'
import { Button, Callout, Flex, Text, TextField } from '@radix-ui/themes'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/authContext'
import { useUpdateAccountDetails } from '../../lib/queries/userQueries'

function PersonalInfo() {
  const { user, isAuthenticated, setUser } = useAuth()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || ''
    }
  })
  const fullName = watch('fullName')
  const email = watch('email')
  const { mutate: updateDetails, isPending: updatingDetails } = useUpdateAccountDetails()
  const [error, setError] = useState('')

  const handleUpdateInfo = async (data) => {
    setError('')
    const { fullName, email } = data
    updateDetails(data, {
      onSuccess: () => {
        setUser(prev => ({
          ...prev,
          fullName,
          email
        }))
        const userDetails = JSON.parse(localStorage.getItem('user'))
        localStorage.setItem('user', JSON.stringify({ ...userDetails, fullName, email }))
        toast('Personal info updated')
      },
      onError: (err) => {
        setError(err.response.data.message || err.response.message || "Something went wrong. Please try again later.")
      }
    })
  }

  const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;


  return (
    <div className='flex flex-col items-center mb-8 lg:gap-10 lg:flex-row lg:justify-between lg:items-start'>
      <div className='w-full max-w-lg min-w-fit'>
        <Text as='p'>
          Personal Info
        </Text>
        <Text size={'2'} color='gray'>
          Update your photo and personal details.
        </Text>
      </div>
      <form onSubmit={handleSubmit(handleUpdateInfo)} className='flex flex-col gap-6 p-6 mt-4 border rounded-xl border-[--gray-a6] max-w-lg lg:max-w-xl w-full lg:mt-0 '>
        {error && <Callout.Root variant='surface' color="red">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            {error}
          </Callout.Text>
        </Callout.Root>}
        <label>
          <Text as="div" size="3" mb="2">
            Name
          </Text>
          <Text as='p' size={'1'} color='gray' mb="2">
            Choose a channel name that represents you and your content.
          </Text>
          <TextField.Root
            color={errors.fullName ? 'red' : 'blue'}
            {...register("fullName", {
              required: 'Full Name is required'
            })}
            size={'3'}
            placeholder="Enter your full name"
            className={`${errors.fullName && 'shadow-inset-custom'} `}
          >
            <TextField.Slot>
              <PersonIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
          {errors.fullName &&
            <Text
              as='p'
              size={'1'}
              mt={'2'}
              color='red'
              className='flex items-center gap-1'
            >
              <InfoCircledIcon height={"16"} width={"16"} />
              {errors.fullName.message}
            </Text>
          }
        </label>
        <label>
          <Text as="div" size="3" mb="2">
            Email address
          </Text>
          <TextField.Root
            color={errors.email ? 'red' : 'blue'}
            size={'3'}
            {...register("email", {
              required: 'Email is required',
              validate: value => emailPattern.test(value) || 'Invalid email id'
            })}
            placeholder="Enter your email"
            className={`${errors.email && 'shadow-inset-custom'} `}
          >
            <TextField.Slot>
              <EnvelopeClosedIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
          {errors.email &&
            <Text
              as='p'
              size={'1'}
              mt={'2'}
              color='red'
              className='flex items-center gap-1'
            >
              <InfoCircledIcon height={"16"} width={"16"} />
              {errors.email.message}
            </Text>
          }
        </label>
        <Flex gap="3" justify="end">
          <Button
            type='button'
            onClick={() => {
              setError('')
              reset()
            }}
            variant='surface'
            highContrast
            radius='full'
            color='gray'
            hidden={fullName.trim() === user?.fullName && email.trim() === user?.email}
            disabled={updatingDetails}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            radius='full'
            highContrast
            disabled={(fullName.trim() === user?.fullName && email.trim() === user?.email) || updatingDetails}
            loading={updatingDetails}
          >
            Save changes
          </Button>
        </Flex>
      </form>
    </div>
  )
}

export default PersonalInfo
