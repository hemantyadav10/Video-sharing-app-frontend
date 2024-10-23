import apiClient from "./apiClient"

const getUserLikedVideos = async() => {
  const res = await apiClient.get('/likes/videos')
  return res.data
}

export {
  getUserLikedVideos
}