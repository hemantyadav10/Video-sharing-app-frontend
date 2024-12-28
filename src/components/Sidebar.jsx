import { HomeIcon, CounterClockwiseClockIcon, ListBulletIcon, HeartIcon, AvatarIcon, HamburgerMenuIcon, BookmarkFilledIcon, ChevronLeftIcon, MagicWandIcon, ExitIcon, GearIcon, QuestionMarkCircledIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { Button, IconButton, Separator, Text } from '@radix-ui/themes'
import React, { useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ThumbsUp from '../assets/ThumbsUpIcon'
import { useAuth } from '../context/authContext'

function Sidebar({ showMenu, toggleMenu }) {
  const { logout, isAuthenticated } = useAuth()
  const sidebarItems = [
    {
      name: 'Home',
      slug: '/',
      icon: HomeIcon,
    },
    {
      name: 'Subscriptions',
      slug: '/subscriptions',
      icon: AvatarIcon,
      separator: true
    },
    {
      name: 'History',
      slug: '/history',
      icon: CounterClockwiseClockIcon
    },
    {
      name: 'Playlists',
      slug: '/playlists',
      icon: ListBulletIcon,
      showWhenLoggedIn: true
    },
    {
      name: 'Creator Studio',
      slug: isAuthenticated ? '/dashboard' : '/login',
      icon: MagicWandIcon,
      hidden: true,
      showWhenLoggedIn: true
    },
    {
      name: 'Liked Videos',
      slug: '/liked-videos',
      icon: HeartIcon,
      separator: true
    },
    {
      name: 'Privacy',
      slug: '/privacy',
      icon: LockClosedIcon,
      hidden: true
    },
    {
      name: 'Help',
      slug: '/help',
      icon: QuestionMarkCircledIcon,
      hidden: true
    },
    {
      name: 'Terms of Service',
      slug: '/terms-of-services',
      icon: MagicWandIcon,
      hidden: true
    },
    {
      name: 'Settings',
      slug: '/settings',
      icon: GearIcon,
      hidden: true,
      separator: true,
      showWhenLoggedIn: true
    }
  ]


  const handleLogout = async () => {
    await logout();
  }

  useEffect(() => {
    if (!showMenu) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && window.innerWidth < 768) {
        toggleMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMenu, toggleMenu]); // Dependencies



  return (
    <>
      <div className={`border-r top-0 h-screen fixed border-[#484848] md:h-[calc(100vh-64px)] md:sticky md:top-16 ${showMenu ? 'md:w-56' : '-translate-x-full md:translate-x-0 md:w-24  md:transition-all'} transition ease-in z-[100]  w-56  flex-col flex rounded-r-2xl md:rounded-none bg-[#111113]`}
      >
        <div className='flex flex-col flex-1 gap-5 '>
          <span className='flex items-center h-16 col-span-1 gap-4 px-6 border-b border-transparent md:hidden'>
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
            Logo
          </span>
          <div className={`flex-col hidden px-1 py-7 gap-1 ${showMenu ? "" : "md:flex"} `}>
            {
              sidebarItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.slug}
                  className={({ isActive }) => `${isActive ? "bg-[#0077ff3a]  text-[#c2e6ff]" : ""} flex flex-col items-center gap-2 justify-center p-2 py-3 rounded-lg hover:bg-[#0077ff3a] transition-all focus-visible:ring-[2px] ring-[#2870bd] outline-none active:bg-[#0081fd6b] ${item.hidden && 'hidden'} ${!isAuthenticated && item.showWhenLoggedIn && 'hidden'}`}
                >
                  {<item.icon height={'20'} width={'20'} />} <Text className='text-[10px]' align={'center'} >{item.name}</Text>
                </NavLink>
              ))
            }

          </div>
          <div className={`flex flex-col gap-1 px-3 md:py-6 ${showMenu ? "" : "md:hidden"}  flex-1`}>
            {sidebarItems.map((item) => (
              <div key={item.name}>
                <NavLink
                  to={item.slug}
                  className={({ isActive }) => `${isActive ? "bg-[#0077ff3a]  text-[#c2e6ff]" : ""} flex hover:bg-[#0077ff3a]  transition-all p-3 gap-2 items-center rounded-lg text-sm focus-visible:ring-[2px] ring-[#2870bd] outline-none active:bg-[#0081fd6b] ${!isAuthenticated && item.showWhenLoggedIn && 'hidden'}`}
                >
                  {item.icon && <item.icon className={`mr-2`} height={'20'} width={"20"} />}{item.name}
                </NavLink>
                {item.separator &&
                  <Separator my={'2'} className={`w-full `} />
                }
              </div>
            ))}
            <div className='block mt-auto mb-5'>
              {
                isAuthenticated
                  ? <button
                    onClick={handleLogout}
                    className='flex hover:bg-[#0077ff3a]  transition-all p-3 gap-2 items-center rounded-lg text-sm focus-visible:ring-[2px] ring-[#2870bd] outline-none active:bg-[#0081fd6b] w-full'
                  >
                    <ExitIcon className="mr-2" height={'20'} width={"20"} />Logout
                  </button>

                  : <Link
                    to={'/login'}
                    className='flex w-full outline-none focus:ring-2'
                  >
                    <Button
                      variant='outline'
                      radius={'full'}
                      tabIndex={-1}
                      aria-hidden='true'
                      className='w-full'
                    >
                      <AvatarIcon height={'20'} width={'20'} />
                      Sign in
                    </Button>
                  </Link>
              }
            </div>
          </div>
        </div>
      </div>
      <div onClick={toggleMenu} className={`absolute inset-0 z-[90] w-full md:hidden bg-black/70 ${showMenu ? "" : "hidden"}`}></div>
    </>
  )
}

export default Sidebar
