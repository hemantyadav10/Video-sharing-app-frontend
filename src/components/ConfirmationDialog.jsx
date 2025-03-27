import { AlertDialog, Button, Flex } from '@radix-ui/themes'
import React from 'react'

export default function ConfirmationDialog({
  action,
  open,
  setOpen,
  title = "Delete",
  descripion = "Are you sure you want to delete this?",
  maxWidth = '350px'
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Content maxWidth={maxWidth}>
        <AlertDialog.Title size={'3'} weight={'medium'}>{title}</AlertDialog.Title>
        <AlertDialog.Description size="2">
          {descripion}
        </AlertDialog.Description>

        <Flex gap="5" mt="6" justify="end" >
          <AlertDialog.Cancel>
            <Button variant="ghost" highContrast color="gray" radius='full' className='font-medium'>
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant='ghost' onClick={action} radius='full' className='font-medium'>
              Delete
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
