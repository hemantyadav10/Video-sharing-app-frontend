import { ExternalLinkIcon } from '@radix-ui/react-icons'
import { Button, Flex, IconButton, Separator, Text, Tooltip } from '@radix-ui/themes'
import { Clapperboard, LayoutDashboard, LogOut } from 'lucide-react'
import React from 'react'
import { Link, NavLink, useLocation, useOutletContext } from 'react-router-dom'
import { useAuth } from '../../context/authContext'

export default function DashboardSidebar() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const showSidebar = useOutletContext()[1]
  const toggleSidebar = useOutletContext()[2]
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar()
    }
  }

  return (
    <div className={` h-screen lg:sticky lg:top-16  lg:h-[calc(100vh-64px)] fixed border-r min-w-64 w-64  top-0 z-[100] py-6 border-[--gray-a6] transition-transform ease-in-out duration-[300ms] ${showSidebar ? "translate-x-0 w-64" : "lg:w-[72px] lg:min-w-[72px] lg:translate-x-0 -translate-x-full"} overflow-hidden bg-[--color-background]`}>
      <div className={`${showSidebar ? "" : "lg:hidden"}`}>

        <Flex direction={'column'} align={'center'} gap={'4'}>
          <Link
            onClick={handleLinkClick}
            to={`/channel/${user?._id}`}
            className='mx-auto overflow-hidden transition rounded-full size-28 hover:brightness-75'
          >
            <img src={user?.avatar} alt="profile image" className='object-cover object-center w-full h-full' />
          </Link>
          <div>
            <Text as='p' size={'2'} weight={'medium'} align={'center'}>
              Your channel
            </Text>
            <NavLink
              to={`/channel/${user?._id}`}
              onClick={handleLinkClick}
            >
              <Text as='p' mt={'1'} size={'1'} color='gray' className='flex items-center justify-center gap-2'>
                {user?.fullName} <ExternalLinkIcon />
              </Text>
            </NavLink>
          </div>
        </Flex>

        <Flex direction={'column'} p={'4'} gap={'2'} mt={'6'} >
          <SidebarButton
            to="/dashboard"
            icon={<LayoutDashboard size="20" strokeWidth={1.25} />}
            label="Dashboard"
            handleClick={handleLinkClick}
          />
          <SidebarButton
            to="/dashboard/content"
            icon={<Clapperboard size="20" strokeWidth={1.25} />}
            label="Content"
            handleClick={handleLinkClick}
          />
        </Flex>

        <Separator size={'4'} />

        <Flex p={'4'} className={``}>
          <SidebarButton
            to="/"
            icon={<LogOut size="20" strokeWidth={1.25} />}
            label="Exit studio"
            handleClick={handleLinkClick}
          />
        </Flex>
      </div>

      <div className={`${showSidebar ? "lg:hidden" : "lg:block"} hidden `}>
        <CompactSidebar handleLinkClick={handleLinkClick} />
      </div>
    </div>
  )
}

function SidebarButton({ to, icon, label, handleClick, }) {
  const { pathname } = useLocation();

  let isActive = false;

  if (to.startsWith("/dashboard/content")) {
    isActive = pathname.startsWith("/dashboard/content");
  } else {
    isActive = pathname === to;
  }

  return (
    <Button
      color='gray'
      highContrast
      variant='ghost'
      className={`flex justify-start flex-1 gap-4 p-3 px-6 rounded-xl `}
      asChild
    >
      <Link
        to={to}
        onClick={handleClick}
        className={`${isActive ? "bg-[--blue-a3] text-[--blue-12]" : ""}`}>
        {icon} {label}
      </Link>
    </Button>
  )
}


function CompactSidebar({ handleLinkClick }) {
  const { user } = useAuth()
  const { pathname } = useLocation()

  const links = [
    { to: "/dashboard", icon: <LayoutDashboard size="20" strokeWidth={1.25} />, tooltip: "Dashboard", active: pathname === "/dashboard" },
    { to: "content", icon: <Clapperboard size="20" strokeWidth={1.25} />, tooltip: "Content", active: pathname.startsWith("/dashboard/content") },
    { to: "/", icon: <LogOut size="20" strokeWidth={1.25} />, tooltip: "Exit studio" },
  ];


  return (
    <Flex className='' direction={'column'} align={'center'} gap={'5'}>
      <Tooltip content='Your channel' side='right' delayDuration={0}>
        <Link
          onClick={handleLinkClick}
          to={`/channel/${user?._id}`}
        >
          <img src={user?.avatar} alt="" className='object-cover object-center rounded-full size-10' />
        </Link>
      </Tooltip>

      {links.map(({ to, icon, tooltip, active }) => (
        <Tooltip key={to} content={tooltip} side="right" delayDuration={0}>
          <IconButton
            asChild
            variant="ghost"
            color="gray"
            highContrast
            size="4"
            radius="large"
            className={active ? "bg-[--blue-a3] text-[--blue-12]" : ""}
          >
            <Link
              onClick={handleLinkClick}
              to={to}
            >
              {icon}
            </Link>
          </IconButton>
        </Tooltip>
      ))}

    </Flex>
  )
}