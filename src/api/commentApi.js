import apiClient from "./apiClient"

const fetchVideoComments = async (videoId) => {
  const res = await apiClient.get(`/comments/${videoId}`)
  return res.data;
}

export {
  fetchVideoComments
}