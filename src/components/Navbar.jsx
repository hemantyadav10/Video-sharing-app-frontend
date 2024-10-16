import { ExitIcon, FileTextIcon, GearIcon, HamburgerMenuIcon, LockClosedIcon, MagicWandIcon, MagnifyingGlassIcon, PersonIcon, PlusIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { Avatar, Button, Dialog, DropdownMenu, Flex, IconButton, Text, TextField } from '@radix-ui/themes'
import React from 'react'

function Navbar({ toggleMenu }) {

  return (
    <div className='sticky top-0 right-0 z-40 grid w-full grid-cols-2 sm:grid-cols-3 px-6 py-3 backdrop-blur-md bg-[#0c0c0d]/80  border-b border-[#484848]  h-16'>
      <span className='flex items-center col-span-1 gap-4 '>
        <IconButton
          onClick={toggleMenu}
          variant='ghost'
          highContrast
          color='gray'
          radius='full'
        >
          <HamburgerMenuIcon height='20' width='20' />
        </IconButton>
        Logo
      </span>
      <div className='hidden col-span-1 sm:flex'>
        <TextField.Root
          className='w-full'
          radius='full'
          size={'3'}
          placeholder="Search">
          <TextField.Slot>
            <MagnifyingGlassIcon height="18" width="18" />
          </TextField.Slot>
        </TextField.Root>
      </div>
      <div className='items-center justify-end hidden col-span-1 gap-4 sm:flex'>
        <Dialog.Root>
          <Dialog.Trigger>
            <Button
              variant='soft'
              highContrast
              radius='full'
            >
              <PlusIcon height="20" /> Create
            </Button>
          </Dialog.Trigger>
          <Dialog.Content maxWidth="450px">
            <Dialog.Title>Upload Video</Dialog.Title>
            <Dialog.Description size="2" mb="4">
              Make changes to your profile.
            </Dialog.Description>
            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Name
                </Text>
                <TextField.Root
                  defaultValue="Freja Johnsen"
                  placeholder="Enter your full name"
                />
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Email
                </Text>
                <TextField.Root
                  defaultValue="freja@example.com"
                  placeholder="Enter your email"
                />
              </label>
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button>Save</Button>
              </Dialog.Close>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
        <DropdownMenu.Root >
          <DropdownMenu.Trigger>
            <IconButton radius='full' className='hover:brightness-75'>
              <Avatar
                radius='full'
                size={'2'}
                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                alt='avatar'
                fallback="A"
              />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content variant='soft' sideOffset={"1"} alignOffset={'3'} align='start'>
            <div className='w-52'>
              <Flex gap="2">
                <Avatar
                  ml={"3"}
                  mb={'2'}
                  radius='full'
                  size={'3'}
                  src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                  alt='avatar'
                  fallback="A"
                />
                <Flex
                  direction='column'
                >
                  <Text size={'2'}>John Wick</Text>
                  <Text size={'1'}>@johnwick</Text>
                </Flex>
              </Flex>
              <DropdownMenu.Separator />
              <DropdownMenu.Item >
                <PersonIcon /> View Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item >
                <MagicWandIcon /> Creator Studio
              </DropdownMenu.Item>
              <DropdownMenu.Item >
                <QuestionMarkCircledIcon /> Help
              </DropdownMenu.Item>
              <DropdownMenu.Item >
                <GearIcon /> Settings
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item >
                <FileTextIcon /> Terms of Service
              </DropdownMenu.Item>
              <DropdownMenu.Item >
                <LockClosedIcon /> Privacy
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item >
                <ExitIcon /> Logout
              </DropdownMenu.Item>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <div className='flex items-center justify-end cols-span-1 sm:hidden'>
        <IconButton variant='ghost' highContrast color='gray' radius='full'>
          <MagnifyingGlassIcon height={'20'} width={'20'} />
        </IconButton>
      </div>
    </div>
  )
}

export default Navbar
