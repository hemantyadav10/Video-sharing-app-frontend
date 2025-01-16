import { Button, Heading, Separator, Text } from '@radix-ui/themes'
import { Eye, ThumbsUp, TvMinimalPlay, Upload, UsersRound } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import no_content from '../assets/no_content.svg'
import ChannelStatsCard from '../components/ChannelStatsCard'
import UploadVideoDialog from '../components/UploadVideoDailog'
import VideoTable from '../components/VideoTable'
import { useAuth } from '../context/authContext'
import { useGetChannelStats, useGetChannleVideos } from '../lib/queries/dashboardQueries'
import { useTogglePublishStatus } from '../lib/queries/videoQueries'

function Dashboard() {
  const { user, isAuthenticated } = useAuth()
  const { data: videoData, isLoading: loadingVideos } = useGetChannleVideos(isAuthenticated)
  const { data: stats, isFetching: loadingStats } = useGetChannelStats(user?._id)
  const location = useLocation();
  const navigate = useNavigate()
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [publishedVideos, setPublishedVideos] = useState(() => {
    if (!loadingVideos && videoData) {
      return videoData?.data.filter((video) => video.isPublished).map((video) => video._id);
    }
    return null;
  })

  const { mutateAsync: toggleStatus, isPending } = useTogglePublishStatus(user?._id)
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

    if (!loadingVideos) {
      const published = videoData?.data.filter((video) => video.isPublished).map((video) => video._id)

      setPublishedVideos(published)
    }
  }, [loadingVideos, videoData])

  useEffect(() => {
    if (location.state?.openDialog) {
      setDialogOpen(true); // Set dialog open first
    }

    if (location.state) {
      navigate(location.pathname, { replace: true }); // Clear state from history after using it
    }
  }, [location.state, navigate]);


  const handleTogglePublish = async (videoId, checked) => {
    const updatedList = checked
      ? [...publishedVideos, videoId]
      : publishedVideos.filter(id => id !== videoId)

    setPublishedVideos(updatedList)

    toast.promise(
      toggleStatus(videoId, {
        onError: () => {
          const updatedList = checked
            ? publishedVideos.filter(id => id !== videoId)
            : [...publishedVideos, videoId]

          setPublishedVideos(updatedList)
        }
      }),
      {
        loading: checked ? 'Publishing...' : 'Unpublishing...',
        success: checked ? 'Video published' : 'Video unpublished',
        error: (error) => error?.response?.data?.message || 'Something went wrong, please try again.',
      }
    );
  }


  return (
    <div className='flex flex-col w-full gap-6 p-6 py-12 lg:px-20'>

      {/* Top section */}
      <section className={`flex flex-col gap-6 p-6 border rounded-lg sm:justify-between border-[#484848] relative bg-dashboard_bg`}>
        <div className='absolute inset-0 bg-gradient-to-r from-[#111111] to-[rgba(17,17,17,0.75)] rounded-lg'></div>
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

      {/*Section Separator */}
      {/* <Separator size={'4'} /> */}

      {/* Stats cards section */}
      <section className='flex flex-col flex-wrap gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4'>
        {statsData.map((stat, index) => (
          <ChannelStatsCard
            key={index}
            statType={stat.statType}
            Icon={stat.Icon}
            loading={loadingStats}
            statNumbers={stat.statNumbers}
          />
        ))}
      </section>

      {/* video details table */}
      <section>
        <VideoTable
          videos={videoData}
          publishedVideos={publishedVideos}
          onTogglePublish={handleTogglePublish}
          loadingVideos={loadingVideos}
          togglePublishingLoading={isPending}
        />
        {(videoData?.data.length === 0) &&
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
      <div className='flex flex-wrap-reverse items-center justify-center w-full gap-4 pt-12 mt-auto'>
        <Text as='span' color='gray' size={'1'} className='text-nowrap'>
          © 2024 ViewTube. All rights reserved.
        </Text>
        <div className='flex items-center gap-4'>
          <Text as='span' color='gray' size={'1'} className='hover:underline'>
            <Link to={'/privacy'} >
              Privacy
            </Link>
          </Text>
          <Text as='span' color='gray' size={'1'} className='hover:underline'>
            <Link to={'/help'} >
              Help
            </Link>
          </Text>
          <Text as='span' color='gray' size={'1'} className='hover:underline'>
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
