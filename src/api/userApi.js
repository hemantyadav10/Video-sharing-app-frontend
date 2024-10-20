import apiClient from "./apiClient"

const getUserChannelInfo = async (userId) => {
  const response = await apiClient.get(`users/channel/${userId}`)
  return response.data;
}

const getUserVideos = async (userId) => {
  const res = await apiClient.get(`videos?userId=${userId}`)
  return res.data
}

export {
  getUserChannelInfo,
  getUserVideos
}