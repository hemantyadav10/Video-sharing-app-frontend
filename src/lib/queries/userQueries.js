import { useMutation, useQuery } from "@tanstack/react-query"
import {
  changePassword,
  getCurrentUser,
  getUserChannelInfo,
  getUserVideos,
  getUserWatchHistory,
  loginUser,
  logoutUser
} from "../../api/userApi"

const useFetchUserChannelInfo = (channelId, userId) => {
  return useQuery({
    queryKey: ['user', channelId, userId],
    queryFn: () => getUserChannelInfo(channelId, userId),
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

export {
  useFetchUserChannelInfo,
  useFetchUserVideos,
  useLoginUser,
  userLogoutUser,
  useGetCurrentUser,
  useFetchUserWatchHistory, 
  useChangePassword
}