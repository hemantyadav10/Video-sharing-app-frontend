import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import {
  changePassword,
  clearWatchHistory,
  getCurrentUser,
  getUserChannelInfo,
  getUserVideos,
  getUserWatchHistory,
  loginUser,
  logoutUser,
  registerUser,
  searchUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage
} from "../../api/userApi"
import { queryClient } from "../../main"
import toast from "react-hot-toast"

const useFetchUserChannelInfo = (channelId, userId, fetchOnMount = true) => {
  return useQuery({
    queryKey: ['user', channelId, userId],
    queryFn: () => getUserChannelInfo(channelId, userId),
    enabled: fetchOnMount
  })
}

const useFetchUserVideos = (userId, filters = '', limit = 12) => {
  return useInfiniteQuery({
    queryKey: ['video', userId, filters || ''],
    queryFn: ({ pageParam = 1 }) => getUserVideos(userId, `${filters}&page=${pageParam}&limit=${limit}`),
    getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
    keepPreviousData: true,
    placeholderData: (prevData) => {
      if (!prevData?.pages?.[0]?.data?.docs?.length) return undefined;
      return prevData.pages[0].data.docs[0].owner._id === userId ? prevData : undefined;
    },
    enabled: !!userId
  })
}

const useLoginUser = () => {
  return useMutation({
    mutationFn: (data) => loginUser(data)
  })
}
const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUser
  })
}

const userLogoutUser = () => {
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear()
    }
  })
}

const useGetCurrentUser = (userId) => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    enabled: !!userId,
    retry: false
  })
}

const useFetchUserWatchHistory = (user, limit = 3) => {
  return useInfiniteQuery({
    queryKey: ['watch_history'],
    queryFn: ({ pageParam = 1 }) => getUserWatchHistory(limit, pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextPage || null
    },
    keepPreviousData: true,
    enabled: !!user
  })
}

const useChangePassword = () => {
  return useMutation({
    mutationFn: (data) => changePassword(data)
  })
}

const useUpdateAccountDetails = () => {
  return useMutation({
    mutationFn: (data) => updateAccountDetails(data)
  })
}

const useClearWatchHistory = () => {
  return useMutation({
    mutationFn: clearWatchHistory,
    onSuccess: () => {
      queryClient.setQueryData(['watch_history'], prev => {
        if (!prev || !prev.pages || !prev.pages[0] || !prev.pages[0].data) return prev;
        return {
          ...prev,
          pages: [
            {
              ...prev.pages[0],
              data: {
                ...prev.pages[0].data,
                docs: [],
                totalDocs: 0,
                hasPrevPage: false,
                hasNextPage: false,
                nextPage: null
              }
            }
          ]
        }
      })
    }
  })
}

const useUpdateAvatar = () => {
  return useMutation({
    mutationFn: updateAvatar,
    onSuccess: () => {
      queryClient.clear()
    }
  })
}

const useUpdateCoverImage = () => {
  return useMutation({
    mutationFn: updateCoverImage,
    onSuccess: () => {
      queryClient.clear()
    }
  })
}

const useSearchUser = (query, searchType, userId) => {
  console.log(query, searchType)
  return useQuery({
    queryKey: ["search", 'channels', { query, userId}],
    queryFn: () => searchUser(query),
    enabled: !!query && searchType === "channels"
  })
}

export {
  useFetchUserChannelInfo,
  useFetchUserVideos,
  useLoginUser,
  userLogoutUser,
  useGetCurrentUser,
  useFetchUserWatchHistory,
  useChangePassword,
  useUpdateAccountDetails,
  useClearWatchHistory,
  useRegisterUser,
  useUpdateAvatar,
  useUpdateCoverImage,
  useSearchUser
}