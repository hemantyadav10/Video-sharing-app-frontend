import { Button, Flex, Text, TextField } from '@radix-ui/themes'
import React from 'react'

function ChangePassword() {
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
      <div className='flex flex-col gap-6 p-6 mt-4 border rounded-xl border-[#484848] max-w-lg lg:max-w-xl w-full lg:mt-0 '>
        <label>
          <Text as="div" size="2" mb="2">
            Current Password
          </Text>
          <TextField.Root
            size={'3'}
            defaultValue="Freja Johnsen"
            placeholder="Enter your full name"
          />
        </label>
        <label>
          <Text as="div" size="2" mb="2">
            New password
          </Text>
          <TextField.Root
            size={'3'}
            defaultValue="Freja Johnsen"
            placeholder="Enter your email"
          />
        </label>
        <label>
          <Text as="div" size="2" mb="2">
            Confirm new password
          </Text>
          <TextField.Root
            size={'3'}
            defaultValue="Freja Johnsen"
            placeholder="Enter your email"
          />
        </label>
        <Flex gap="3" justify="end">
          <Button variant="soft" color="gray">
            Cancel
          </Button>
          <Button variant='surface'>Update password</Button>
        </Flex>
      </div>
    </div>
  )
}

export default ChangePassword
