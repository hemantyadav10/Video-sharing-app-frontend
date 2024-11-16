import { Button, Heading, Separator, Text } from '@radix-ui/themes'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/authContext'
import { EyeOpenIcon, HeartIcon, PersonIcon } from '@radix-ui/react-icons'
import UploadVideoIcon from '../assets/UploadVideoIcon'
import ChannelStatsCard from '../components/ChannelStatsCard'
import VideoIcon from '../assets/VideoIcon'
import { useGetChannelStats, useGetChannleVideos } from '../lib/queries/dashboardQueries'
import { useTogglePublishStatus } from '../lib/queries/videoQueries'
import toast from 'react-hot-toast'
import VideoTable from '../components/VideoTable'

function Dashboard() {
  const { user } = useAuth()
  const { data: videoData, isLoading: loadingVideos } = useGetChannleVideos(user?._id)
  const { data: stats, isLoading: loadingStats } = useGetChannelStats(user?._id)

  const [publishedVideos, setPublishedVideos] = useState(() => {
    if (!loadingVideos && videoData) {
      return videoData?.data.filter((video) => video.isPublished).map((video) => video._id);
    }
    return null;
  })

  const { mutate: toggleStatus } = useTogglePublishStatus(user?._id)
  const statsData = [
    {
      statType: "Videos",
      Icon: VideoIcon,
      statNumbers: stats?.data.totalVideos || 0,
    },
    {
      statType: "Views",
      Icon: EyeOpenIcon,
      statNumbers: stats?.data.totalViews || 0,
    },
    {
      statType: "Subscribers",
      Icon: PersonIcon,
      statNumbers: stats?.data.totalSubscribers || 0,
    },
    {
      statType: "Likes",
      Icon: HeartIcon,
      statNumbers: stats?.data.totalLikes || 0,
    },
  ];

  useEffect(() => {

    if (!loadingVideos) {
      const published = videoData?.data.filter((video) => video.isPublished).map((video) => video._id)

      setPublishedVideos(published)
    }
  }, [loadingVideos, videoData])


  const handleTogglePublish = async (videoId, checked) => {
    const updatedList = checked
      ? [...publishedVideos, videoId]
      : publishedVideos.filter(id => id !== videoId)

    setPublishedVideos(updatedList)

    toggleStatus(videoId, {
      onSuccess: () => {
        toast(checked ? 'Video published' : 'Video unpublished')
      },
      onError: () => {
        toast('')
      }
    })
  }


  return (
    <div className='flex flex-col w-full gap-6 p-6 py-12 mb-16 md:px-24'>

      {/* Top section */}
      <section className='flex flex-col gap-6 sm:flex-row sm:justify-between'>
        <div>
          <Heading mb={'1'}>
            Welcome back, {user?.fullName}
          </Heading>
          <Text
            as='p'
            color='gray'
            weight={'light'}
            size={'2'}
          >
            Seamless Video Management, Elevated Results
          </Text>
        </div>
        <Button
          highContrast
          radius='full'
          className='w-max'
        >
          <UploadVideoIcon width='20px' height='20px' fill='#111113' /> Upload video
        </Button>
      </section>

      {/*Section Separator */}
      <Separator size={'4'} />

      {/* Stats cards section */}
      <section className='flex flex-col flex-wrap gap-4 sm:grid-cols-2 sm:grid md:grid-cols-3 lg:grid-cols-4'>
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
        />
      </section>
    </div >
  )
}

export default Dashboard
