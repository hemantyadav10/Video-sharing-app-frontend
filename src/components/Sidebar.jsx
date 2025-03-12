import { AvatarIcon, DesktopIcon, ExitIcon, HamburgerMenuIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { Box, Button, Flex, IconButton, ScrollArea, Separator, Spinner, Text } from '@radix-ui/themes'
import { ChevronRight, CircleHelp, Clapperboard, Flame, Gamepad2, GraduationCap, History, Home, ListVideo, LockKeyhole, Music, Newspaper, Podcast, ReceiptText, Settings, Shirt, ShoppingBag, ThumbsUp, Trophy, TvMinimalPlay, WandSparkles } from 'lucide-react'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import Logo from './Logo'
import { useTheme } from 'next-themes'
import { SITE_NAME } from '../constants'

const SidebarContext = createContext();

function Sidebar({ showMenu, toggleMenu }) {
  const { logout, isAuthenticated, logoutLoading } = useAuth()
  const [showCategories, setShowCategories] = useState(true)
  const topTabTrap = useRef(null)
  const bottomTabTrap = useRef(null)
  const firstFocusableElement = useRef(null)
  const lastFocusableElement = useRef(null)
  const { theme, setTheme } = useTheme()

  const sidebarItems = [
    {
      name: 'Home',
      slug: '/',
      icon: Home,
    },
    {
      name: 'Subscriptions',
      slug: '/subscriptions',
      icon: TvMinimalPlay,
      separator: true
    },
    {
      name: 'History',
      slug: '/history',
      icon: History
    },
    {
      name: 'Playlists',
      slug: '/playlists',
      icon: ListVideo,
      showWhenLoggedIn: true
    },
    {
      name: 'Liked Videos',
      slug: '/liked-videos',
      icon: ThumbsUp,
      separator: true
    },
    {
      name: 'Creator Studio',
      slug: isAuthenticated ? '/dashboard' : '/login',
      icon: WandSparkles,
      hidden: true,
      showWhenLoggedIn: true
    },
    {
      name: 'Privacy',
      slug: '/privacy',
      icon: LockKeyhole,
      hidden: true
    },
    {
      name: 'Help',
      slug: '/help',
      icon: CircleHelp,
      hidden: true
    },
    {
      name: 'Terms of Service',
      slug: '/terms-of-services',
      icon: ReceiptText,
      hidden: true
    },
    {
      name: 'Settings',
      slug: '/settings',
      icon: Settings,
      hidden: true,
      separator: true,
      showWhenLoggedIn: true
    }
  ]

  const categories = [
    {
      name: 'Trending',
      icon: Flame,
      slug: '/category/trending',
    },
    {
      name: 'Shopping',
      icon: ShoppingBag,
      slug: '/category/shopping',
    },
    {
      name: 'Music',
      icon: Music,
      slug: '/category/music',
    },
    {
      name: "Movies",
      icon: Clapperboard,
      slug: '/category/movies',
    },
    {
      name: 'Gaming',
      icon: Gamepad2,
      slug: '/category/gaming',
    },
    {
      name: 'News',
      icon: Newspaper,
      slug: '/category/news',
    },
    {
      name: 'Sports',
      icon: Trophy,
      slug: '/category/sports',
    },
    {
      name: 'Courses',
      icon: GraduationCap,
      slug: '/category/courses',
    },
    {
      name: 'Fashion',
      icon: Shirt,
      slug: '/category/fashion',
    },
    {
      name: 'Podcasts',
      icon: Podcast,
      slug: '/category/podcasts',
    },
  ]

  const handleLogout = async () => {
    await logout();

  }
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      toggleMenu()
    }
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
  }, [showMenu, toggleMenu]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      if (showMenu) {
        firstFocusableElement.current?.focus();
      }

      const trapFocus = (e) => {
        if (e.target === topTabTrap.current) {
          lastFocusableElement.current?.focus();
        } else if (e.target === bottomTabTrap.current) {
          firstFocusableElement.current?.focus();
        }
      };

      document.addEventListener('focusin', trapFocus);
      return () => {
        document.removeEventListener('focusin', trapFocus);
      };
    }
  }, [showMenu, firstFocusableElement, lastFocusableElement]);


  return (
    <aside
      className={`fixed w-64 md:w-auto top-0 md:h-[calc(100vh-64px)] h-screen transition-transform ease-in-out duration-[300ms] md:sticky md:top-16 ${showMenu ? ' translate-x-0' : ' md:translate-x-0 -translate-x-full'} z-[100] md:z-30 border-r border-[--gray-a6] bg-[--color-background]`}
    >
      <span ref={topTabTrap} tabIndex={"0"} />
      <ScrollArea
        scrollHideDelay={500}
        type="hover"
        scrollbars="vertical"
        draggable={true}
        className='md:h-[calc(100vh-64px)] h-screen'
      >
        <Box>
          <div className="sticky top-0 flex items-center h-16 gap-3 px-[26px] md:hidden bg-[--color-background] border-b border-[--gray-a6]">
            <IconButton
              autoFocus
              tabIndex={"0"}
              ref={firstFocusableElement}
              onClick={() => toggleMenu()}
              variant='ghost'
              color='gray'
              highContrast
              radius='full'
              size={'3'}
            >
              <HamburgerMenuIcon height={20} width={20} />
            </IconButton>
            <Logo />
          </div>
          <SidebarContext.Provider value={{ showMenu, toggleMenu }}>
            <ul className={`flex flex-col pt-6 pb-3 mx-6 md:mx-0`}>
              {sidebarItems.map(item => (
                <SidebarItem
                  item={item}
                  key={item.name}
                  Icon={item.icon}
                  className={`${showMenu ? "" : item.hidden ? "md:hidden" : ""} ${!isAuthenticated && item.showWhenLoggedIn && 'hidden'} `}
                >
                  {item.name}
                </SidebarItem>
              ))}
            </ul>
            <div className={`${showMenu ? "" : "md:hidden"}`}>
              <Separator size={'4'} />
              <div className='py-3'>
                <Flex>
                  <Button
                    onClick={() => setShowCategories(prev => !prev)}
                    variant='ghost'
                    color='gray'
                    highContrast
                    className='flex justify-start flex-1 p-3 mx-3 my-0'
                    size={'3'}
                    radius='large'
                  >
                    Explore
                    <ChevronRight
                      size={'18'}
                      className={`${showCategories ? "rotate-90" : ""} transition-all duration-200`}
                    />
                  </Button>
                </Flex>
                {
                  showCategories && (
                    <ul className='pt-[6px] mx-6 md:mx-0'>
                      {categories.map(category => (
                        <SidebarItem
                          item={category}
                          key={category.name}
                          Icon={category.icon}
                        >
                          {category.name}
                        </SidebarItem>
                      ))}
                    </ul>
                  )
                }
              </div>
              <Separator size={'4'} />
              <div className='w-full p-3 mb-2'>
                {isAuthenticated
                  ?
                  <Button
                    ref={lastFocusableElement}
                    onClick={handleLogout}
                    variant='soft'
                    color='gray'
                    aria-hidden='true'
                    className='flex justify-start w-full px-4 py-6 rounded-xl'
                    disabled={logoutLoading}
                    highContrast
                  >
                    <Spinner loading={logoutLoading}>
                      <ExitIcon height={'20'} width={'20'} />
                    </Spinner>

                    <span>
                      Logout
                    </span>
                  </Button>
                  :
                  <>
                    <div className='mx-auto mb-4 max-w-48'>
                      <Text
                        size={'2'}
                      >
                        Sign in to like videos, comment, and subscribe.
                      </Text>
                    </div>
                    <Link
                      ref={lastFocusableElement}
                      to={'/login'}
                      className='flex w-full rounded-full outline-none focus:ring-2'
                    >
                      <Button
                        variant='outline'
                        radius={'full'}
                        tabIndex={-1}
                        aria-hidden='true'
                        className='w-full'
                      >
                        <AvatarIcon height={'20'} width={'20'} />
                        <span>
                          Sign in
                        </span>
                      </Button>
                    </Link>
                  </>
                }
              </div>
              <Separator size={'4'} />
              <div className='flex items-center justify-between p-3 py-6 text-xs'>
                <Text as='span' color='gray'>
                  © 2025 {SITE_NAME}.
                </Text>
                <div className='flex gap-2 border border-[--gray-a6] rounded-full w-max p-1'>
                  <IconButton
                    title='Light'
                    variant='ghost'
                    color='gray'
                    size={'1'}
                    highContrast
                    radius='full'
                    onClick={() => setTheme('light')}
                    className={`${theme === "light" && "bg-[--gray-a3]"}`}
                  >
                    <SunIcon />
                  </IconButton>
                  <IconButton
                    title='Dark'
                    variant='ghost'
                    color='gray'
                    size={'1'}
                    highContrast
                    radius='full'
                    onClick={() => setTheme('dark')}
                    className={`${theme === "dark" && "bg-[--gray-a3]"}`}
                  >
                    <MoonIcon />
                  </IconButton>
                  <IconButton
                    title='System'
                    variant='ghost'
                    size={'1'}
                    color='gray'
                    highContrast
                    radius='full'
                    onClick={() => setTheme('system')}
                    className={`${theme === "system" && "bg-[--gray-a3]"}`}
                  >
                    <DesktopIcon />
                  </IconButton>
                </div>
              </div>
            </div>
          </SidebarContext.Provider>
        </Box>
      </ScrollArea>

      <span ref={bottomTabTrap} tabIndex={"0"} />
    </aside>
  )
}

export default Sidebar

export function SidebarItem({ children, Icon, className = '', item }) {
  const { showMenu, toggleMenu } = useContext(SidebarContext);
  const location = useLocation()

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      toggleMenu()
    }
  }

  return (
    <>
      <Button
        size={'3'}
        className={`p-3 mb-[6px] last:mb-0 ${className}`}
        variant='ghost'
        color='gray'
        highContrast
        radius='large'
        asChild
      >
        <NavLink
          onClick={handleLinkClick}
          title={item.name}
          to={item.slug}
          className={`${item.slug === location.pathname ? "bg-[--blue-a3] text-[--blue-12]" : ""} gap-4 flex justify-start ${showMenu ? "md:px-[11px] md:mx-3 md:gap-4" : "md:flex-col md:mx-0 md:gap-0 md:px-1"}`}
        >
          <Icon strokeWidth={1.25} size={22} />
          <Text
            as='span'
            size={'2'}
            className={`${showMenu ? "md:w-40 text-left" : "md:text-[10px] md:mt-2 "}`}
          >
            {children}
          </Text>
        </NavLink>
      </Button>
    </>
  );
}
