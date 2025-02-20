import { Button, Text } from '@radix-ui/themes'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import notFound from '../assets/notFound.png'

function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <div className='flex items-center gap-4'>
        <img src={notFound} alt="" />
        <Text as='div' className='text-transparent text-8xl bg-gradient-to-r from-blue-300 to to-blue-900 bg-clip-text' align={'center'} weight={'bold'} >
          404
          <Text as='p' size={'3'} highContrast>
            PAGE NOT FOUND
          </Text>
        </Text>
      </div>

      <Text as='div' align={'center'} >
        Lost in the void?
        Let's guide you back to awesomeness!
      </Text>
      <NavLink to={'/'}>
        <Button
          highContrast
          radius='full'
          size={'3'}
        >
          <ArrowLeft height={20} width={20} /> Go Back Home
        </Button>
      </NavLink>
    </div>
  )
}

export default NotFound
