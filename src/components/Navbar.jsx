import { ArrowLeftIcon, AvatarIcon, Cross1Icon, DesktopIcon, ExitIcon, FileTextIcon, GearIcon, HamburgerMenuIcon, LockClosedIcon, MagicWandIcon, MagnifyingGlassIcon, MoonIcon, PersonIcon, PlusIcon, QuestionMarkCircledIcon, SunIcon } from '@radix-ui/react-icons'
import { Avatar, Button, DropdownMenu, Flex, IconButton, Text, TextField, Tooltip } from '@radix-ui/themes'
import { ListPlus, SquarePen, Upload } from 'lucide-react'
import { useTheme } from 'next-themes'
import React, { useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners'
import { useAuth } from '../context/authContext'
import useDebounce from '../hooks/useDebounce'
import { useSetSearchHistory } from '../lib/queries/searchHistoryQueries'
import { useFetchVideos } from '../lib/queries/videoQueries'
import { getInitials } from '../utils/utils'
import CreatePlaylistDialog from './CreatePlaylistDialog'
import Logo from './Logo'
import SearchHistoryDropdown from './SearchHistoryDropdown'

function Navbar({ toggleMenu, toggleDashboardSidebar }) {
  const [searchParams, setSearchParams] = useSearchParams('')
  const [query, setQuery] = useState(searchParams.get('query') || '')
  const debouncedQuery = useDebounce(query)
  const navigate = useNavigate();
  const [showSearchBar, setShowSearchBar] = useState(false)
  const { logout, isAuthenticated, user, logoutLoading } = useAuth()
  const { pathname } = useLocation()

  const dashboardRoute = pathname.startsWith('/dashboard')
  const { isFetching } = useFetchVideos(searchParams)
  const [openCreatePlaylist, setOpenCreatePlaylist] = useState(false)
  const isVideoRoute = pathname.startsWith('/watch')
  const { theme, setTheme } = useTheme()
  const [openSearchHistory, setOpenSearchHistory] = useState(false)
  const inputRef = useRef()
  const { mutate: setSearchHistory } = useSetSearchHistory()
  
  const themeIcon = {
    "light": SunIcon,
    "dark": MoonIcon,
    "system": DesktopIcon
  }
  const ThemeIcon = themeIcon[theme]

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      setSearchHistory(query)
      navigate('/results')
      searchParams.set('query', query.trim())
      setSearchParams(searchParams)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className='fixed top-0 right-0 z-40 grid w-full h-16 grid-cols-2 px-6 py-3 bg-opacity-50 border-b sm:grid-cols-12 bg-[--color-background] border-b-[--gray-a6]'>
      {openSearchHistory && (
        <div className='absolute z-[101] w-full sm:max-w-[640px] sm:left-1/2 sm:-translate-x-1/2 top-full'>
          <SearchHistoryDropdown
            setOpen={setOpenSearchHistory}
            query={debouncedQuery.toLowerCase()}
            inputRef={inputRef}
            setQuery={setQuery}
          />
        </div>
      )}
      <div className='absolute top-0 left-0 right-0'>
        <BarLoader
          color='#70b8ff'
          width={'100%'}
          height={'2px'}
          loading={logoutLoading}
        />
      </div>
      <span className='flex items-center col-span-1 gap-3 sm:col-span-3 '>
        <IconButton
          onClick={() => {
            if (dashboardRoute) {
              return toggleDashboardSidebar()
            }
            toggleMenu()
          }}
          variant='ghost'
          highContrast
          color='gray'
          radius='full'
          size={'3'}
          className={`${(isVideoRoute) ? 'hidden' : ''}`}
          title='Click to expand sidebar'
        >
          <HamburgerMenuIcon height={20} width={20} />
        </IconButton>
        <Logo />
      </span>
      <form onSubmit={handleSearch} className='hidden w-full max-w-screen-sm col-span-6 mx-auto sm:flex'>
        <TextField.Root
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onClick={() => setOpenSearchHistory(true)}
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
            type={query?.trim() ? 'submit' : 'button'}
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
        <div className='items-center justify-end hidden col-span-3 gap-4 sm:flex'>
          <DropdownMenu.Root>
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
              variant='soft'
              sideOffset={"1"}
              align='end'
              className='min-w-40'
            >
              <DropdownMenu.Item asChild>
                <Link
                  to={'/dashboard'}
                  state={{ openDialog: true }}
                  replace={true}
                >
                  <Upload strokeWidth={1.25} size={18} /> Upload videos
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <Link to={`/channel/${user?._id}/tweets`}>
                  <SquarePen strokeWidth={1.25} size={18} />Create tweet
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onClick={() => {
                  setOpenCreatePlaylist(true)
                }}
              >
                <ListPlus strokeWidth={1.25} size={18} /> New playlist
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
                  variant='solid'
                  fallback={getInitials(user?.fullName)}
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
                <DropdownMenu.Item asChild>
                  <Link to={`/channel/${user?._id}`}>
                    <PersonIcon /> View Profile
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <Link to={`/dashboard`}>
                    <MagicWandIcon /> Creator Studio
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={handleLogout}>
                  <ExitIcon /> Logout
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger>
                    < ThemeIcon /> Theme
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.SubContent className='min-w-48'>
                    <DropdownMenu.Label>
                      Theme
                    </DropdownMenu.Label>
                    <DropdownMenu.RadioGroup value={theme} onValueChange={t => setTheme(t)}>
                      <DropdownMenu.RadioItem value='light'>
                        <SunIcon /> Light
                      </DropdownMenu.RadioItem>
                      <DropdownMenu.RadioItem value='dark'>
                        <MoonIcon /> Dark
                      </DropdownMenu.RadioItem>
                      <DropdownMenu.RadioItem value='system'>
                        <DesktopIcon /> System
                      </DropdownMenu.RadioItem>
                    </DropdownMenu.RadioGroup>
                  </DropdownMenu.SubContent>
                </DropdownMenu.Sub>

                <DropdownMenu.Item asChild>
                  <Link to='/settings'>
                    <GearIcon /> Settings
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger>More options...</DropdownMenu.SubTrigger>
                  <DropdownMenu.SubContent className='min-w-48'>
                    <DropdownMenu.Item asChild>
                      <Link to='/help'>
                        <QuestionMarkCircledIcon /> Help
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link to={`/terms-of-services`}>
                        <FileTextIcon /> Terms of Service
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item asChild>
                      <Link to={`/privacy`}>
                        <LockClosedIcon /> Privacy
                      </Link>
                    </DropdownMenu.Item>
                  </DropdownMenu.SubContent>
                </DropdownMenu.Sub>
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
      <div className={`flex items-center justify-end col-span-1 sm:col-span-1 sm:hidden ${showSearchBar && 'hidden'} `}>
        <Tooltip content='Search'>
          <IconButton
            onClick={() => {
              setShowSearchBar(true)
              setOpenSearchHistory(true)
            }}
            size={'3'}
            variant='ghost'
            highContrast
            color='gray'
            radius='full'
          >
            <MagnifyingGlassIcon height="22" width="22" />
          </IconButton>
        </Tooltip>
      </div>
      {
        showSearchBar && <div className='absolute left-0 right-0 flex items-center justify-center h-16 border-b bg-[var(--color-background)]  sm:hidden border-[--gray-a6] gap-4 px-6'>
          <Tooltip content='Back'>
            <IconButton size={'3'} radius='full' color='gray' highContrast variant='ghost' onClick={() => {
              setShowSearchBar(false)
              setOpenSearchHistory(false)
            }}
            >
              <ArrowLeftIcon height={'24'} width={'24'} />
            </IconButton>
          </Tooltip>
          <form onSubmit={handleSearch} className='flex flex-1'>
            <TextField.Root
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onClick={() => setOpenSearchHistory(true)}
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
