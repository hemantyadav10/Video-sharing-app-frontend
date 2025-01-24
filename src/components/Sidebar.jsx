import { AvatarIcon, ExitIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import { Box, Button, IconButton, ScrollArea, Separator, Spinner, Text } from '@radix-ui/themes'
import { ChevronRight, CircleHelp, Clapperboard, Flame, Gamepad2, GraduationCap, History, Home, ListVideo, LockKeyhole, Music, Newspaper, Podcast, ReceiptText, Settings, Shirt, ShoppingBag, ThumbsUp, Trophy, TvMinimalPlay, WandSparkles } from 'lucide-react'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import Logo from './Logo'

const SidebarContext = createContext();


function Sidebar({ showMenu, toggleMenu }) {
  const { logout, isAuthenticated, logoutLoading } = useAuth()
  const [showCategories, setShowCategories] = useState(false)
  const topTabTrap = useRef(null)
  const bottomTabTrap = useRef(null)
  const firstFocusableElement = useRef(null)
  const lastFocusableElement = useRef(null)
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
      className={`fixed w-64 md:w-auto top-0 md:h-[calc(100vh-64px)] h-screen transition-all ease-in-out duration-[400ms] md:sticky md:top-16 ${showMenu ? ' translate-x-0' : ' md:translate-x-0 -translate-x-full'} z-[100] border-r border-[#484848] bg-[#111113]`}
    >
      <span ref={topTabTrap} tabIndex={"0"} />
      <ScrollArea
        scrollHideDelay={500}
        type="hover"
        scrollbars="vertical"
        draggable={true}
        className='md:h-[calc(100vh-64px)] h-screen'
      >
        <Box className={`${showMenu ? "pr-2" : "md:pr-0 pr-2"} `}>
          <div className="flex items-center h-16 gap-2 px-5 md:hidden">
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
            <ul className={`flex flex-col p-2  ${showMenu ? "md:p-2 md:mt-3" : "md:p-[2px] md:mt-4"}`}>
              {sidebarItems.map(item => (
                <SidebarItem
                  item={item}
                  key={item.name}
                  Icon={item.icon}
                  className={`${showMenu ? "" : item.hidden ? "md:hidden" : ""} ${!isAuthenticated && item.showWhenLoggedIn && 'hidden'}`}
                >
                  {item.name}
                </SidebarItem>
              ))}
            </ul>
          </SidebarContext.Provider>
          <div className={`${showMenu ? "" : "md:hidden"}`}>
            <Separator size={'4'} />
            <div className='px-2 py-4'>

              <div className='flex px-3'>
                <Button
                  onClick={() => setShowCategories(prev => !prev)}
                  variant='ghost'
                  color='gray'
                  highContrast
                  className='flex justify-between flex-1 px-5 py-3 rounded-xl'
                  size={'3'}
                >
                  Explore
                  <ChevronRight
                    size={'18'}
                    className={`${showCategories ? "-rotate-90" : ""} transition-all duration-200`}
                  />
                </Button>
              </div>
              <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${showCategories ? 'max-h-[468px]' : 'max-h-0'
                } pt-2`}>
                {categories.map(category => (
                  <NavLink
                    tabIndex={showCategories ? "0" : "-1"}
                    onClick={handleLinkClick}
                    key={category.name}
                    title={category.name}
                    to={category.slug}
                    className={({ isActive }) => `${isActive ? "bg-[#0077ff3a] text-[#c2e6ff]" : ""} group flex items-center  p-3 rounded-xl active:bg-[#0081fd6b] hover:bg-[rgba(0,119,255,0.18)]  text-white outline-none cursor-pointer focus-visible:ring-[2px] ring-[#2870bd] gap-3 md:gap-0 px-4 `}
                  >
                    {category.icon && <category.icon strokeWidth={1.5} size={22} />}
                    <span
                      className={`overflow-hidden text-nowrap ${showMenu ? 'md:w-36 md:ml-4' : 'md:w-0'}  text-sm`}
                    >
                      {category.name}
                    </span>
                  </NavLink>
                ))}

              </div>
            </div>
            <div className=' w-full py-4 px-2 border-t border-[#484848]'>
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
          </div>
        </Box>
      </ScrollArea>
      <span ref={bottomTabTrap} tabIndex={"0"} />

    </aside>

  )
}

export default Sidebar

export function SidebarItem({ children, Icon, className = '', item }) {
  const { showMenu, toggleMenu } = useContext(SidebarContext);

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      toggleMenu()
    }
  }

  return (
    <NavLink
      onClick={handleLinkClick}
      title={item.name}
      to={item.slug}
      className={({ isActive }) => `${isActive ? "bg-[#0077ff3a] text-[#c2e6ff]" : ""} flex items-center p-3 rounded-xl active:bg-[#0081fd6b] hover:bg-[#0077ff2e] outline-none focus-visible:ring-[2px] ring-[#2870bd] gap-3 md:gap-0 ${className}  ${showMenu ? "md:px-4" : "md:flex-col md:px-1"}`}
    >
      <Icon strokeWidth={1.5} size={22} />
      <span
        className={`overflow-hidden text-nowrap ${showMenu ? "md:w-36 md:ml-4" : "md:text-[10px] md:mt-2"}  text-sm`}
      >
        {children}
      </span>
    </NavLink>
  );
}
