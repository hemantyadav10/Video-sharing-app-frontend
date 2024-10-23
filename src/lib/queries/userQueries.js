import { useMutation, useQuery } from "@tanstack/react-query"
import {
  getCurrentUser,
  getUserChannelInfo,
  getUserVideos,
  getUserWatchHistory,
  loginUser,
  logoutUser
} from "../../api/userApi"

const useFetchUserChannelInfo = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserChannelInfo(userId)
  })
}

const useFetchUserVideos = (userId) => {
  return useQuery({
    queryKey: ['video', userId],
    queryFn: () => getUserVideos(userId),
  })
}

const useLoginUser = () => {
  return useMutation({
    mutationFn: (data) => loginUser(data)
  })
}

const userLogoutUser = () => {
  return useMutation({
    mutationFn: logoutUser
  })
}

const useGetCurrentUser = (token) => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    enabled: !!token,
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

export {
  useFetchUserChannelInfo,
  useFetchUserVideos,
  useLoginUser,
  userLogoutUser,
  useGetCurrentUser,
  useFetchUserWatchHistory
}