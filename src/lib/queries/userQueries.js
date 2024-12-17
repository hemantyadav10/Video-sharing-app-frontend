import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import {
  changePassword,
  getCurrentUser,
  getUserChannelInfo,
  getUserVideos,
  getUserWatchHistory,
  loginUser,
  logoutUser,
  updateAccountDetails
} from "../../api/userApi"
import { queryClient } from "../../main"

const useFetchUserChannelInfo = (channelId, userId) => {
  return useQuery({
    queryKey: ['user', channelId, userId],
    queryFn: () => getUserChannelInfo(channelId, userId),
  })
}

const useFetchUserVideos = (userId, filters = '', limit = 12) => {
  return useInfiniteQuery({
    queryKey: ['video', userId, filters || ''],
    queryFn: ({ pageParam = 1 }) => getUserVideos(userId, `${filters}&page=${pageParam}&limit=${limit}`),
    getNextPageParam: (lastPage) => lastPage?.data?.nextPage || null,
    keepPreviousData: true,
    placeholderData: (prevData) => prevData,
  })
}

const useLoginUser = () => {
  return useMutation({
    mutationFn: (data) => loginUser(data)
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

const useGetCurrentUser = (token, userId) => {
  return useQuery({
    queryKey: ['currentUser', userId],
    queryFn: getCurrentUser,
    enabled: !!token && !!userId,
    retry: false
  })
}

const useFetchUserWatchHistory = (user) => {
  return useQuery({
    queryKey: ['watch_history', user],
    queryFn: getUserWatchHistory,
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

export {
  useFetchUserChannelInfo,
  useFetchUserVideos,
  useLoginUser,
  userLogoutUser,
  useGetCurrentUser,
  useFetchUserWatchHistory,
  useChangePassword,
  useUpdateAccountDetails
}