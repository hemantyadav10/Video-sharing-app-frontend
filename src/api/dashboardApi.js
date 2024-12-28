import apiClient from "./apiClient"

const getChannelVideos = async () => {
  const res = await apiClient.get('/dashboard/videos')
  return res.data
}

const getChannelStats = async (channelId, allVideos = true) => {
  const res = await apiClient.get(`/dashboard/stats/${channelId}?allVideos=${allVideos}`)
  return res.data
}

export {
  getChannelVideos,
  getChannelStats
}