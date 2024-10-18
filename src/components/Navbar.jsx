import { ArrowBottomLeftIcon, ArrowLeftIcon, Cross1Icon, ExitIcon, FileTextIcon, GearIcon, HamburgerMenuIcon, LockClosedIcon, MagicWandIcon, MagnifyingGlassIcon, PersonIcon, PlusIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { Avatar, Button, Dialog, DropdownMenu, Flex, IconButton, Text, TextField, Tooltip } from '@radix-ui/themes'
import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

function Navbar({ toggleMenu }) {
  const [searchParams, setSearchParams] = useSearchParams('')
  const [query, setQuery] = useState(searchParams.get('search_query') || '')
  const navigate = useNavigate();
  const [showSearchBar, setShowSearchBar] = useState(false)


  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate('/results')
      searchParams.set('search_query', query.trim())
      setSearchParams(searchParams)
    }
  }


  return (
    <div className='sticky top-0 right-0 z-40 grid w-full grid-cols-2 sm:grid-cols-3 px-6 py-3 backdrop-blur-md bg-[#0c0c0d]/80  border-b border-[#484848]  h-16'>
      <span className='flex items-center col-span-1 gap-4 '>
        <IconButton
          onClick={toggleMenu}
          variant='ghost'
          highContrast
          color='gray'
          radius='full'
          size={'3'}
        >
          <HamburgerMenuIcon height='20' width='20' />
        </IconButton>
        <Link to='/'>
          Logo
        </Link>
      </span>
      <form onSubmit={handleSearch} className='hidden col-span-1 sm:flex'>
        <TextField.Root
          value={query}
          onChange={e => setQuery(e.target.value)}
          className='w-full rounded-l-full'
          size={'3'}
          placeholder="Search">
          <TextField.Slot >
            <MagnifyingGlassIcon height="18" width="18" />
          </TextField.Slot >
          {query && <TextField.Slot side='right' className='pl-3'>
            <IconButton
              radius='full'
              type='button'
              size="2"
              variant="ghost"
              color='gray'
              highContrast
              onClick={() => setQuery('')}
            >
              <Cross1Icon height="16" width="16" />
            </IconButton>
          </TextField.Slot>}
        </TextField.Root>
        <Tooltip content="Search">
          <IconButton
            aria-label='Search'
            type={query.trim() ? 'submit' : 'button'}
            highContrast
            variant='soft'
            size={'4'}
            className='w-16 h-full rounded-r-full'
          >
            <MagnifyingGlassIcon height="22" width="22" />
          </IconButton>
        </Tooltip>
      </form>
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
              <Link to='/channel/hemant'>
                <DropdownMenu.Item >
                  <PersonIcon /> View Profile
                </DropdownMenu.Item>
              </Link>
              <DropdownMenu.Item >
                <MagicWandIcon /> Creator Studio
              </DropdownMenu.Item>
              <DropdownMenu.Item >
                <QuestionMarkCircledIcon /> Help
              </DropdownMenu.Item>
              <Link to='/settings'>
                <DropdownMenu.Item >
                  <GearIcon /> Settings
                </DropdownMenu.Item>
              </Link>
              <DropdownMenu.Separator />
              <DropdownMenu.Item >
                <FileTextIcon /> Terms of Service
              </DropdownMenu.Item>
              <DropdownMenu.Item >
                <LockClosedIcon /> Privacy
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <Link to='/login'>
                <DropdownMenu.Item >
                  <ExitIcon /> Logout
                </DropdownMenu.Item>
              </Link>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <div className={`flex items-center justify-end cols-span-1 sm:hidden ${showSearchBar && 'hidden'}`}>
        <Tooltip content='Search'>
          <IconButton onClick={() => setShowSearchBar(true)} size={'3'} variant='ghost' highContrast color='gray' radius='full'>
            <MagnifyingGlassIcon height={'20'} width={'20'} />
          </IconButton>
        </Tooltip>
      </div>
      {showSearchBar && <div className='absolute left-0 right-0 flex items-center justify-center h-16 border-b bg-[#0c0c0d]  sm:hidden border-[#484848] gap-4 px-6'>
        <Tooltip content='Back'>
          <IconButton size={'3'} radius='full' highContrast variant='ghost' onClick={() => setShowSearchBar(false)}>
            <ArrowLeftIcon height={'24'} width={'24'} />
          </IconButton>
        </Tooltip>
        <form onSubmit={handleSearch} className='flex flex-1'>
          <TextField.Root
            autoFocus 
            value={query}
            onChange={e => setQuery(e.target.value)}
            className='w-full rounded-l-full'
            size={'3'}
            placeholder="Search">
            <TextField.Slot >
              <MagnifyingGlassIcon height="18" width="18" />
            </TextField.Slot >
            {query && <TextField.Slot side='right' className='pl-3'>
              <IconButton
                radius='full'
                type='button'
                size="2"
                variant="ghost"
                color='gray'
                highContrast
                onClick={() => setQuery('')}
              >
                <Cross1Icon height="16" width="16" />
              </IconButton>
            </TextField.Slot>}
          </TextField.Root>
          <Tooltip content="Search">
            <IconButton
              aria-label='Search'
              type={query.trim() ? 'submit' : 'button'}
              highContrast
              variant='soft'
              size={'4'}
              className='w-16 h-auto rounded-r-full'
            >
              <MagnifyingGlassIcon height="22" width="22" />
            </IconButton>
          </Tooltip>
        </form>
      </div>
      }
    </div>
  )
}

export default Navbar
