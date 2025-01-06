import { ArrowLeftIcon, AvatarIcon, Cross1Icon, ExitIcon, FileTextIcon, GearIcon, HamburgerMenuIcon, LockClosedIcon, MagicWandIcon, MagnifyingGlassIcon, Pencil2Icon, PersonIcon, PlusIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons'
import { Avatar, Button, DropdownMenu, Flex, IconButton, Text, TextField, Tooltip } from '@radix-ui/themes'
import React, { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners'
import PlaylistIcon from '../assets/PlaylistIcon'
import VideoIcon from '../assets/VideoIcon'
import { useAuth } from '../context/authContext'
import { useFetchVideos } from '../lib/queries/videoQueries'
import CreatePlaylistDialog from './CreatePlaylistDialog'

function Navbar({ toggleMenu }) {
  const [searchParams, setSearchParams] = useSearchParams('')
  const [query, setQuery] = useState(searchParams.get('query') || '')
  const navigate = useNavigate();
  const [showSearchBar, setShowSearchBar] = useState(false)
  const { logout, isAuthenticated, user, logoutLoading } = useAuth()
  const { pathname } = useLocation()
  const dashboardRoute = pathname === '/dashboard'
  const { isFetching } = useFetchVideos(searchParams)
  const [openCreatePlaylist, setOpenCreatePlaylist] = useState(false)
  const isVideoRoute = pathname.startsWith('/watch')



  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate('/results')
      searchParams.set('query', query.trim())
      setSearchParams(searchParams)
    }
  }

  const handleLogout = async () => {
    await logout()
  }


  return (
    <div className='fixed top-0 right-0 z-40 grid w-full grid-cols-2 sm:grid-cols-3 px-6 py-3 border-[#484848] border-b bg-[#111113]/80 backdrop-blur-md h-16'>
      <div className='absolute top-0 left-0 right-0 '>
        <BarLoader
          color='#70b8ff'
          width={'100%'}
          height={'2px'}
          loading={logoutLoading}
        />
      </div>
      <span className='flex items-center col-span-1 gap-4 '>
          <IconButton
            onClick={toggleMenu}
            variant='ghost'
            highContrast
            color='gray'
            radius='full'
            size={'3'}
            className={`${(dashboardRoute || isVideoRoute) ? 'hidden' : ''}`}
          >
            <HamburgerMenuIcon height={20} width={20}/>
          </IconButton>
        <Link
          to='/'
          className='text-xl font-medium'
        >
          <span className='text-sky-300'>View</span>
          <span>Tube</span>
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
            loading={isFetching}
          >
            <MagnifyingGlassIcon height="22" width="22" />
          </IconButton>
        </Tooltip>
      </form>
      {isAuthenticated &&
        <div className='items-center justify-end hidden col-span-1 gap-4 sm:flex'>
          <DropdownMenu.Root >
            <DropdownMenu.Trigger>
              <Button
                variant='soft'
                highContrast
                radius='full'
              >
                <PlusIcon height="20" /> Create
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              variant='soft' sideOffset={"1"} align='end'
              className='min-w-40'
            >
              <Link
                to={'/dashboard'}
                state={{ openDialog: true }}
                replace:true
              >
                <DropdownMenu.Item >
                  <VideoIcon /> Upload video
                </DropdownMenu.Item>
              </Link>
              <Link to={`/channel/${user?._id}/tweets`}>
                <DropdownMenu.Item >
                  <Pencil2Icon />Create tweet
                </DropdownMenu.Item>
              </Link>
              <DropdownMenu.Item
                onClick={() => {
                  setOpenCreatePlaylist(true)
                }}
              >
                <PlaylistIcon /> New playlist
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          {/* Profile dropdown menu */}
          <DropdownMenu.Root >
            <DropdownMenu.Trigger>
              <IconButton radius='full' className='hover:brightness-75'>
                <Avatar
                  radius='full'
                  size={'2'}
                  src={user?.avatar}
                  alt='avatar'
                  fallback="A"
                />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content variant='soft' sideOffset={"1"} align='end'>
              <div className='w-60'>
                <Flex gap="2">
                  <Avatar
                    ml={"3"}
                    mb={'2'}
                    radius='full'
                    size={'3'}
                    src={user?.avatar}
                    alt='avatar'
                    fallback="A"
                  />
                  <Flex
                    direction='column'
                  >
                    <Text size={'2'} weight={'medium'} className='capitalize'>{user?.fullName}</Text>
                    <Text size={'2'} color='gray'>@{user?.username}</Text>
                  </Flex>
                </Flex>
                <DropdownMenu.Separator />
                <Link to={`/channel/${user?._id}`}>
                  <DropdownMenu.Item >
                    <PersonIcon /> View Profile
                  </DropdownMenu.Item>
                </Link>
                <Link to={`/dashboard`}>
                  <DropdownMenu.Item >
                    <MagicWandIcon /> Creator Studio
                  </DropdownMenu.Item>
                </Link>
                <DropdownMenu.Item onClick={handleLogout}>
                  <ExitIcon /> Logout
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <Link to='/settings'>
                  <DropdownMenu.Item >
                    <GearIcon /> Settings
                  </DropdownMenu.Item>
                </Link>
                <DropdownMenu.Separator />
                <Link to='/help'>
                  <DropdownMenu.Item >
                    <QuestionMarkCircledIcon /> Help
                  </DropdownMenu.Item>
                </Link>
                <Link to={`/terms-of-services`}>
                  <DropdownMenu.Item >
                    <FileTextIcon /> Terms of Service
                  </DropdownMenu.Item>
                </Link>
                <Link to={`/privacy`}>
                  <DropdownMenu.Item >
                    <LockClosedIcon /> Privacy
                  </DropdownMenu.Item>
                </Link>
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>}
      {
        !isAuthenticated &&
        <Link
          to={'/login'}
          className='items-center justify-end hidden ml-auto text-right rounded-md outline-none w-max focus:ring-2 sm:flex'
        >
          <Button
            variant='outline'
            radius={'full'}
            tabIndex={-1}
            aria-hidden='true'
          >
            <AvatarIcon height={'20'} width={'20'} />
            Sign in
          </Button>
        </Link>
      }
      <div className={`flex items-center justify-end cols-span-1 sm:hidden ${showSearchBar && 'hidden'} `}>
        <Tooltip content='Search'>
          <IconButton onClick={() => setShowSearchBar(true)} size={'3'} variant='ghost' highContrast color='gray' radius='full'>
            <MagnifyingGlassIcon height="22" width="22" />
          </IconButton>
        </Tooltip>
      </div>
      {
        showSearchBar && <div className='absolute left-0 right-0 flex items-center justify-center h-16 border-b bg-[#0c0c0d]  sm:hidden border-[#484848] gap-4 px-6'>
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
                loading={isFetching}
              >
                <MagnifyingGlassIcon height="22" width="22" />
              </IconButton>
            </Tooltip>
          </form>
        </div>
      }
      {/* Create new playlist */}
      <CreatePlaylistDialog
        open={openCreatePlaylist}
        toggleOpen={setOpenCreatePlaylist}
      />
    </div >
  )
}

export default Navbar
