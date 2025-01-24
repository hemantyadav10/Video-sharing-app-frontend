import React from 'react'
import { Link } from 'react-router-dom'
import { PlayIcon } from 'lucide-react'
import { Text } from '@radix-ui/themes'


function Logo() {
  return (
    <Link
      to='/'
      className='flex items-center gap-1 '
    >
      <PlayIcon color='#70b8ff' fill='#70b8ff' />
      <Text size={'5'} weight={'medium'}>
      VidNova 
      </Text>
    </Link>
  )
}

export default Logo
