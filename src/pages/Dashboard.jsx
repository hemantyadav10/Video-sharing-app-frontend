import { Button, Heading, Separator, Text } from '@radix-ui/themes'
import { Eye, ThumbsUp, TvMinimalPlay, Upload, UsersRound } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import no_content from '../assets/no_content.svg'
import ChannelStatsCard from '../components/ChannelStatsCard'
import PaginationComponent from '../components/PaginationComponent'
import QueryErrorHandler from '../components/QueryErrorHandler'
import UploadVideoDialog from '../components/UploadVideoDailog'
import VideoTable from '../components/VideoTable'
import { useAuth } from '../context/authContext'
import { useGetChannelStats, useGetChannleVideos } from '../lib/queries/dashboardQueries'

function Dashboard() {
  const { user, isAuthenticated } = useAuth()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const {
    data: videoData,
    isPending: loadingVideos,
    error,
    isError,
    refetch,
    isFetching
  } = useGetChannleVideos(isAuthenticated, limit, page)
  const paginationInfo = {
    hasNextPage: videoData?.data?.hasNextPage ?? false,
    hasPrevPage: videoData?.data?.hasPrevPage ?? false,
    totalDocs: videoData?.data?.totalDocs ?? 0,
    totalPages: videoData?.data?.totalPages ?? 1
  }

  const { data: stats, isFetching: loadingStats, error: errorfetchingStats, refetch: retryFetchStats, isError: isFetchStatsError } = useGetChannelStats(user?._id)
  const location = useLocation();
  const navigate = useNavigate()
  const [isDialogOpen, setDialogOpen] = useState(false);


  const statsData = [
    {
      statType: "Videos",
      Icon: TvMinimalPlay,
      statNumbers: stats?.data.totalVideos || 0,
    },
    {
      statType: "Views",
      Icon: Eye,
      statNumbers: stats?.data.totalViews || 0,
    },
    {
      statType: "Subscribers",
      Icon: UsersRound,
      statNumbers: stats?.data.totalSubscribers || 0,
    },
    {
      statType: "Likes",
      Icon: ThumbsUp,
      statNumbers: stats?.data.totalLikes || 0,
    },
  ];

  useEffect(() => {
    if (location.state?.openDialog) {
      setDialogOpen(true); // Set dialog open first

    }

    if (location.state) {
      navigate(location.pathname, { replace: true }); // Clear state from history after using it
    }
  }, [location.state, navigate]);

  return (
    <div className='flex flex-col w-full gap-6 p-6 py-12 lg:px-20'>

      {/* Top section */}
      <section className={`flex flex-col gap-6 p-6  rounded-r-lg sm:justify-between border-[--gray-6] relative bg-dashboard_bg `}>
        <div className='absolute inset-0 bg-gradient-to-r from-[--color-background] to-[--gray-a6] rounded-r-lg'></div>
        <div className='z-10'>
          <Heading mb={'1'}>
            Welcome back, {user?.fullName}
          </Heading>
          <Text
            as='p'
            weight={'light'}
            size={'2'}
            className='lg:w-1/2'
          >
            Experience a smarter, faster way to manage your videos, designed to save time, enhance productivity, and deliver superior outcomes.
          </Text>
        </div>

        {/* Upload video button that opens a dialog */}
        <UploadVideoDialog
          isDialogOpen={isDialogOpen}
          setDialogOpen={setDialogOpen}
          limit={limit}
          page={page}
        >
          <Button
            highContrast
            radius='full'
            className='z-10 w-max'
          >
            <Upload size={16} /> Upload video
          </Button>
        </UploadVideoDialog>

      </section>

      {/* Stats cards section */}
      {isFetchStatsError &&
        <div className='border rounded-lg border-[--gray-a6] p-4'>
          <QueryErrorHandler error={errorfetchingStats} onRetry={retryFetchStats} className='mt-0' />
        </div>
      }
      {!isFetchStatsError && <section className='flex flex-col flex-wrap gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4'>
        {statsData.map((stat, index) => (
          <ChannelStatsCard
            key={index}
            statType={stat.statType}
            Icon={stat.Icon}
            loading={loadingStats}
            statNumbers={stat.statNumbers}
          />
        ))}
      </section>}

      {/* video details table */}
      <section>
        {isError &&
          <div className='border rounded-lg border-[--gray-a6] p-4 '>
            <QueryErrorHandler error={error} onRetry={refetch} className='mt-0' />
          </div>
        }

        {!isError && (
          <VideoTable
            videos={videoData?.data}
            loadingVideos={loadingVideos}
            limit={limit}
            page={page}
          />
        )}
        {!loadingVideos && (paginationInfo.totalDocs === 0) &&
          <>
            <section className='flex flex-col items-center justify-center'>
              <img
                src={no_content}
                alt="no content"
                className='size-52'
              />
              <Text color='gray' size={'2'}>
                No content available
              </Text>
            </section>
            <Separator size={'4'} mt={'4'} />
          </>
        }
      </section>

      {/* pagination for videos */}
      {!loadingVideos && (paginationInfo.totalDocs > 0) &&
        <PaginationComponent
          page={page}
          limit={limit}
          setLimit={setLimit}
          setPage={setPage}
          hasNextPage={paginationInfo.hasNextPage}
          hasPrevPage={paginationInfo.hasPrevPage}
          totalDocs={paginationInfo.totalDocs}
          totalPages={paginationInfo.totalPages}
          isFetching={isFetching}
        />
      }

      <div className='flex flex-wrap-reverse items-center justify-center w-full gap-4 pt-12 mt-auto'>
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
    </div >
  )
}

export default Dashboard
