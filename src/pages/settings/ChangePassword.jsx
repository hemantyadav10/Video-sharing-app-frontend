import { InfoCircledIcon } from '@radix-ui/react-icons'
import { Button, Callout, Flex, Text, TextField } from '@radix-ui/themes'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useChangePassword } from '../../lib/queries/userQueries'
import toast from 'react-hot-toast'

function ChangePassword() {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm()
  const oldPassword = watch('oldPassword')
  const newPassword = watch('newPassword')
  const { mutate: changePassword, isPending: loading } = useChangePassword()
  const [error, setError] = useState(null)

  const handleChangePassword = async (data) => {
    setError('')
    const { oldPassword, newPassword } = data
    changePassword({
      oldPassword,
      newPassword
    }, {
      onSuccess: () => {
        reset()
        toast('Password changed successfully')
      },
      onError: (err) => {
        setError(err.response.data.message || error.response.message || "Something  went wrong. Please try again later.")
      }
    })
  }

  return (
    <div className='flex flex-col items-center mb-8 lg:gap-10 lg:flex-row lg:justify-between lg:items-start'>
      <div className='w-full max-w-lg min-w-fit'>
        <Text as='p'>
          Password
        </Text>
        <Text size={'2'} color='gray'>
          Please enter your current password to change your password.
        </Text>
      </div>
      <form onSubmit={handleSubmit(handleChangePassword)} className='flex flex-col gap-6 p-6 mt-4 border rounded-xl border-[#484848] max-w-lg lg:max-w-xl w-full lg:mt-0 '>
        {error && <Callout.Root variant='surface' color="red">
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            {error}
          </Callout.Text>
        </Callout.Root>}
        <label>
          <Text as="div" size="2" mb="2">
            Current Password*
          </Text>
          <TextField.Root
            color={errors.oldPassword ? 'red' : 'blue'}
            {...register('oldPassword', {
              required: 'Current Password is required'
            })}
            size={'3'}
            placeholder="Enter current password"
            className={`${errors.oldPassword && 'shadow-inset-custom'} `}
          />
          {errors.oldPassword &&
            <Text as='p' size={'1'} mt={'2'} color='red' className='flex items-center gap-1 '>
              <InfoCircledIcon height={"16"} width={"16"} />{errors.oldPassword.message}
            </Text>
          }
        </label>
        <label>
          <Text as="div" size="2" mb="2">
            New password*
          </Text>
          <TextField.Root
            color={errors.newPassword ? 'red' : 'blue'}
            {...register('newPassword', {
              required: 'New password is required',
              minLength: {
                value: 7,
                message: 'New password must be atleast 7 characters long'
              },
              validate: (value) => {
                return value !== oldPassword || 'New password must be different from the current password'
              }
            })}
            size={'3'}
            placeholder="Enter new password"
            className={`${errors.newPassword && 'shadow-inset-custom'} `}
          />
          {errors.newPassword &&
            <Text as='p' size={'1'} mt={'2'} color='red' className='flex items-center gap-1 '>
              <InfoCircledIcon height={"16"} width={"16"} />{errors.newPassword.message}
            </Text>
          }
        </label>
        <label>
          <Text as="div" size="2" mb="2">
            Confirm new password*
          </Text>
          <TextField.Root
            color={errors.confirmPassword ? 'red' : 'blue'}
            {...register('confirmPassword', {
              required: 'Please confirm your new password.',
              validate: (value) => {
                return value === newPassword || 'New password and confirm password do not match.'
              }
            })}
            size={'3'}
            placeholder="Re-enter new password"
            className={`${errors.confirmPassword && 'shadow-inset-custom'} `}
          />
          {errors.confirmPassword &&
            <Text as='p' size={'1'} mt={'2'} color='red' className='flex items-center gap-1 '>
              <InfoCircledIcon height={"16"} width={"16"} />{errors.confirmPassword.message}
            </Text>
          }
        </label>
        <Flex gap="3" justify="end">
          <Button
            disabled={loading}
            onClick={() => {
              setError('')
              reset()
            }}
            type='button'
            variant="surface"
            color="gray"
            radius='full'
            highContrast
          >
            Cancel
          </Button>
          <Button
            loading={loading}
            type='submit'
            highContrast
            radius='full'
          >
            Update password
          </Button>
        </Flex>
      </form>
    </div>
  )
}

export default ChangePassword
