import apiClient from "./apiClient"

const getUserSubscribedChannels = async (subscriberId) => {
  const res = await apiClient.get(`/subscriptions/u/${subscriberId}`)
  return res.data
}

const getVideosFromSubscribedChannels = async () => {
  const res = await apiClient.get('/subscriptions/videos')
  return res.data
}

const toggleSubscription = async (channelId) => {
  const res = await apiClient.post(`/subscriptions/c/${channelId}`)

  return res.data;
}

export {
  getUserSubscribedChannels,
  getVideosFromSubscribedChannels,
  toggleSubscription
}