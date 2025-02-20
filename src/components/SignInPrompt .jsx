import React from 'react'
import VideoIcon from '../assets/VideoIcon'
import { Button, Text } from '@radix-ui/themes'
import { AvatarIcon } from '@radix-ui/react-icons'
import { Link } from 'react-router-dom'

function SignInPrompt({
  Icon = VideoIcon,
  title = "Enjoy your favorite videos",
  description = "Sign in to access videos that you've liked",
  size = 120
}) {
  return (
    <div className='flex flex-col items-center justify-center gap-8 mx-auto mt-24 h-max w-max'>
      {Icon && <Icon size={size} strokeWidth={1.25} />}
      <div className='flex flex-col items-center gap-4'>
        <Text size={'6'} as='p'>
          {title}
        </Text>
        <Text
          as='p'
          align={'center'}
          size={'2'}
          className='max-w-sm'
          color='gray'
        >
          {description}
        </Text>
      </div>
      <Link
        to={'/login'}
        className='rounded-full outline-none focus:ring-2'
      >
        <Button
          variant='outline'
          radius={'full'}
          tabIndex={-1}
          aria-hidden='true'
          size={'3'}
        >
          <AvatarIcon height={'24'} width={'24'} />
          Sign in
        </Button>
      </Link>
    </div>
  )
}

export default SignInPrompt 
