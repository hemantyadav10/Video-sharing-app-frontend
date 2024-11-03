import apiClient from "./apiClient"

const getUserLikedVideos = async () => {
  const res = await apiClient.get('/likes/videos')
  return res.data
}

const toggleVideoLike = async (videoId) => {
  const res = await apiClient.post(`/likes/toggle/v/${videoId}`)
  return res.data;
}

const toggleCommentLike = async (commentId) => {
  const res = await apiClient.post(`/likes/toggle/c/${commentId}`)
  return res.data;
}

const toggleTweetLike = async (tweetId) => {
  const res = await apiClient.post(`/likes/toggle/t/${tweetId}`)
  return res.data;
}

export {
  getUserLikedVideos,
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike
}