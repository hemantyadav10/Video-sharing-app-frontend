import apiClient from "./apiClient"

const getChannelVideos = async () => {
  const res = await apiClient.get('/dashboard/videos')
  return res.data
}

const getChannelStats = async () => {
  const res = await apiClient.get('/dashboard/stats')
  return res.data
}

export {
  getChannelVideos, 
  getChannelStats
}