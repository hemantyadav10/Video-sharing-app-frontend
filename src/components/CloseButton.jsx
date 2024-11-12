import { Cross1Icon } from '@radix-ui/react-icons'
import { Dialog, IconButton } from '@radix-ui/themes'
import React from 'react'

function CloseButton() {
  return (
    <Dialog.Close>
      <IconButton
        size={'3'}
        radius='full'
        variant='ghost'
        color='gray'
        highContrast
        ml={'2'}
      >
        <Cross1Icon height={'20'} width={'20'} />
      </IconButton>
    </Dialog.Close>
  )
}

export default CloseButton
