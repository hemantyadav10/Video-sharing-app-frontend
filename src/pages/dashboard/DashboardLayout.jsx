import { Flex, Text } from '@radix-ui/themes'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BarLoader } from 'react-spinners'
import DashboardSidebar from './DashboardSidebar'

const PaginationContext = createContext()
export const usePaginationContext = () => useContext(PaginationContext)

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate()
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)

  useEffect(() => {
    if (location.state?.openDialog) {
      setDialogOpen(true);

    }

    if (location.state) {
      navigate(location.pathname, { replace: true }); // Clear state from history after using it
    }
  }, [location.state, navigate]);

  return (
    <>
      <div className='fixed left-0 right-0 z-[100] top-16 '>
        <BarLoader
          color='#70b8ff'
          width={'100%'}
          height={'4px'}
          loading={false}
        />
      </div>
      <DashboardSidebar />
      <Flex direction={'column'} justify={'between'} className='flex-1 w-full'>
        <div className='py-6 '>
          <PaginationContext.Provider value={{ page, limit, setPage, setLimit }}>
            <Outlet />
          </PaginationContext.Provider>
        </div>
        <DashboardFooter />
      </Flex>
    </ >
  )
}

export default DashboardLayout

export function DashboardFooter() {
  return (
    <div className='flex flex-wrap-reverse items-center justify-center w-full gap-4 py-8'>
      <Text as='span' color='gray' size={'1'} className='text-nowrap'>
        © 2024 VidNova. All rights reserved.
      </Text>
      <div className='flex items-center gap-4'>
        <Text asChild color='gray' size={'1'} className='hover:underline'>
          <Link to={'/privacy'} >
            Privacy
          </Link>
        </Text>
        <Text asChild color='gray' size={'1'} className='hover:underline'>
          <Link to={'/help'} >
            Help
          </Link>
        </Text>
        <Text asChild color='gray' size={'1'} className='hover:underline'>
          <Link to={'/terms-of-services'} >
            Terms
          </Link>
        </Text>
      </div>
    </div>

  )
}
