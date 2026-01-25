import {
  Avatar,
  Box,
  Button,
  Flex,
  HoverCard,
  Skeleton,
  Text,
} from "@radix-ui/themes";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useFetchUserChannelInfo } from "../lib/queries/userQueries";
import { formatVideoDuration } from "../utils/formatVideoDuration";
import { getInitials } from "../utils/utils";
import SaveToPlaylistButton from "./SaveToPlaylistButton";
import SubscriptionButton from "./SubscriptionButton";

function VideoCard({
  hideAvatar = false,
  list = false,
  moreOptionsButton = true,
  videoData,
  loading,
  hideUsername = false,
}) {
  const { isAuthenticated, user } = useAuth();

  const {
    data,
    isLoading: loadingProfileInfo,
    refetch,
  } = useFetchUserChannelInfo(videoData?.owner?._id, user?._id, false);

  return (
    <div
      className={`flex gap-4 mb-4 sm:rounded-xl ${list ? "sm:grid sm:grid-cols-12 w-full sm:mb-0 flex-col" : "flex-col "}  line-clamp-1 sm:p-1 w-full`}
    >
      <Skeleton loading={loading}>
        <Link
          to={`/watch/${videoData?._id}`}
          state={{ thumbnail: videoData?.thumbnail }}
          className={`relative sm:rounded-xl aspect-video  ${list ? "sm:col-span-5" : ""} overflow-hidden`}
        >
          <img
            src={
              videoData?.thumbnail ||
              "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
            }
            alt={videoData?.title || "Video thumbnail"}
            className={`object-cover object-center w-full sm:rounded-xl aspect-video hover:scale-105 transition-transform duration-300`}
          />
          <Text
            className="absolute bottom-2 right-2 p-[2px] px-1 text-xs bg-black/70 font-medium rounded-md text-white"
            as="span"
          >
            {formatVideoDuration(videoData?.duration)}
          </Text>
        </Link>
      </Skeleton>
      <Flex className={`relative ${list ? "sm:col-span-7" : ""} px-2 sm:p-0`}>
        {/* hidden={loading || !isAuthenticated} */}

        {!hideAvatar && (
          <HoverCard.Root
            openDelay={500}
            onOpenChange={(open) => {
              if (open && !data) {
                refetch();
              }
            }}
          >
            <Skeleton loading={loading}>
              <HoverCard.Trigger>
                <Link
                  to={`/channel/${videoData?.owner?._id}`}
                  className={`w-10 h-10 transition-all rounded-full aspect-square hover:brightness-90 ${list && " sm:hidden"} mr-3 `}
                >
                  <Avatar
                    radius="full"
                    size={"3"}
                    src={videoData?.owner?.avatar}
                    className={` w-full h-full object-cover object-center`}
                    alt="profile image"
                  />
                </Link>
              </HoverCard.Trigger>
            </Skeleton>
            <HoverCard.Content size="1" minWidth={"320px"}>
              <Flex gap="4">
                <Skeleton loading={loadingProfileInfo}>
                  <Avatar
                    size="5"
                    fallback={getInitials(videoData?.owner?.fullName)}
                    radius="full"
                    src={videoData?.owner?.avatar}
                    alt="profile image"
                  />
                </Skeleton>
                <Box className="w-full">
                  <Text size="2" as="div" weight={"medium"} mb={"1"}>
                    <Skeleton loading={loadingProfileInfo}>
                      {videoData?.owner?.fullName}
                    </Skeleton>
                  </Text>
                  <Text as="div" size="1">
                    <Skeleton loading={loadingProfileInfo}>
                      @{videoData?.owner?.username}
                    </Skeleton>
                  </Text>
                  <Text as="span" size={"1"} color="gray">
                    <Skeleton loading={loadingProfileInfo}>
                      {videoData?.owner?.createdAt &&
                        `Joined ${formatDistanceToNow(
                          new Date(videoData.owner.createdAt),
                          {
                            addSuffix: true,
                          },
                        )}`}
                    </Skeleton>{" "}
                    <Skeleton loading={loadingProfileInfo}>
                      • {data?.data?.subscribersCount} subscribers
                    </Skeleton>
                  </Text>
                </Box>
              </Flex>
              <Flex mt={"4"} gap={"2"}>
                {isAuthenticated ? (
                  user?._id === videoData?.owner?._id ? null : (
                    <Skeleton loading={loadingProfileInfo}>
                      <SubscriptionButton
                        className="flex-1"
                        userId={videoData?.owner?._id}
                        subscribed={data?.data.isSubscribed}
                      />
                    </Skeleton>
                  )
                ) : null}
                <Skeleton loading={loadingProfileInfo}>
                  <Link
                    to={`/channel/${videoData?.owner?._id}`}
                    className="flex-1 rounded-full"
                  >
                    <Button
                      radius="full"
                      variant="soft"
                      color="gray"
                      highContrast
                      className="w-full text-nowrap"
                    >
                      View Channel
                    </Button>
                  </Link>
                </Skeleton>
              </Flex>
            </HoverCard.Content>
          </HoverCard.Root>
        )}
        <Flex direction={"column"} gapY={"2"} className="flex-1">
          <Skeleton loading={loading} height={"20px"} className="w-[90%]">
            <Link
              title={videoData?.title}
              to={`/watch/${videoData?._id}`}
              className={`text-sm line-clamp-2 ${list ? "md:text-base lg:text-lg" : ""} font-medium`}
            >
              {videoData?.title}
            </Link>
          </Skeleton>
          {!hideUsername && (
            <Link to={`/channel/${videoData?.owner?._id}`} className="">
              <Text
                as="p"
                size={"1"}
                color="gray"
                className={`${list && "sm:order-2 flex items-center gap-3"} hover:text-[--gray-12]`}
              >
                {list && (
                  <Skeleton loading={loading}>
                    <Avatar
                      radius="full"
                      src={videoData?.owner?.avatar}
                      fallback="A"
                      className={`  object-cover object-center hidden  size-6 sm:block`}
                      alt="profile image"
                    />
                  </Skeleton>
                )}
                <Skeleton loading={loading} className="w-1/4 h-4">
                  <Text as="span" size={"1"} title={videoData?.owner?.fullName}>
                    {videoData?.owner?.fullName}
                  </Text>
                </Skeleton>
              </Text>
            </Link>
          )}
          <Flex
            gap={"1"}
            align={"center"}
            className={`${list && "sm:order-1"}`}
            wrap={"wrap"}
          >
            <Skeleton loading={loading}>
              <Text as="span" color="gray" size={"1"}>
                {videoData?.views} views
              </Text>
              <Text as="span" color="gray" size={"1"}>
                •
              </Text>
              <Text as="span" color="gray" size={"1"}>
                {videoData?.createdAt &&
                  formatDistanceToNow(new Date(videoData.createdAt), {
                    addSuffix: true,
                    includeSeconds: true,
                  })}
              </Text>
            </Skeleton>
          </Flex>
          {list && (
            <div className={`${list && "hidden sm:block sm:order-3"}`}>
              <Skeleton loading={loading} className="w-3/4 h-4">
                <Text as="p" size={"1"} color="gray" className="line-clamp-1">
                  {videoData?.description}
                </Text>
              </Skeleton>
            </div>
          )}
        </Flex>
        {moreOptionsButton && !loading && (
          <div>
            <SaveToPlaylistButton videoData={videoData} />
          </div>
        )}
      </Flex>
    </div>
  );
}

export default VideoCard;
