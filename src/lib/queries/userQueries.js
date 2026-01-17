import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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

const useLogoutUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear()
    }
  })
}

const useGetCurrentUser = (options = {}) => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
    ...options
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
  const queryClient = useQueryClient()
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
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateAvatar,
    onSuccess: () => {
      queryClient.clear()
    }
  })
}

const useUpdateCoverImage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateCoverImage,
    onSuccess: () => {
      queryClient.clear()
    }
  })
}

const useSearchUser = (query, searchType, userId) => {
  return useQuery({
    queryKey: ["search", 'channels', { query, userId }],
    queryFn: () => searchUser(query),
    enabled: !!query && searchType === "channels"
  })
}

export {
  useChangePassword, useClearWatchHistory, useFetchUserChannelInfo,
  useFetchUserVideos, useFetchUserWatchHistory, useGetCurrentUser, useLoginUser, useRegisterUser, useLogoutUser, useSearchUser, useUpdateAccountDetails, useUpdateAvatar,
  useUpdateCoverImage
}

