import { Button, Separator, Skeleton, Text } from '@radix-ui/themes'
import React from 'react'
import { Bell, BellRing } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/authContext'

function ChannelCard({ channel, loading, isFetching }) {
  const { user, isAuthenticated } = useAuth()

  return (
    <div>
      {loading ? (
        // Render a non-clickable container when loading
        <div className="flex items-center gap-6 p-4 transition-colors rounded-xl">
          <Skeleton loading={loading}>
            <div className="rounded-full size-24 md:size-32 w-max aspect-square">
              <div className="w-full h-full bg-gray-200 rounded-full"></div>
            </div>
          </Skeleton>
          <div className="flex-1">
            <Skeleton loading={loading} className="w-32 h-5">
              <Text as="span" size="5" mb="2"></Text>
            </Skeleton>
            <div className="flex items-center gap-1">
              <Skeleton loading={loading} className="w-24">
                <Text as="p" color="gray" size="1"></Text>
              </Skeleton>
              <Skeleton loading={isFetching} className="w-24">
                <Text as="p" color="gray" size="1"></Text>
              </Skeleton>
            </div>
          </div>
        </div>
      ) : (
        // Render the clickable Link component when not loading
        <Link
          to={`/channel/${channel?._id}`}
          className="flex items-center gap-6 hover:bg-[#ddeaf814] active:bg-[#d9edfe25] p-4 rounded-xl transition-colors"
        >
          <div className="rounded-full size-24 md:size-32 w-max aspect-square">
            <img
              src={channel?.avatar}
              alt=""
              className="object-cover object-center w-full h-full rounded-full"
            />
          </div>
          <div className="flex-1">
            <Text as="span" size="5" mb="2">
              {channel?.fullName}
            </Text>
            <div className="flex items-center gap-1">
              <Text as="p" color="gray" size="1">
                @{channel?.username} •
              </Text>
              <Text as="p" color="gray" size="1">
                {channel?.subscribersCount} subscribers
              </Text>
            </div>
          </div>
          {channel?._id !== user?._id && isAuthenticated && (
            <div className="hidden sm:block">
              <Button
                radius="full"
                variant={channel?.isSubscribed ? "soft" : "solid"}
                highContrast
                color={channel?.isSubscribed ? "gray" : "sky"}
              >
                {channel?.isSubscribed && <BellRing size={18} />}{" "}
                {channel?.isSubscribed ? `Subscribed` : "Subscribe"}
              </Button>
            </div>
          )}
        </Link>
      )}
      <Separator size="4" />
    </div>
  )
}

export default ChannelCard
