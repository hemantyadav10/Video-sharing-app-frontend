import apiClient from "./apiClient";

const fetchAllVideos = async () => {
  const response = await apiClient.get('/videos');
  return response.data;
};

const fetchRandomVideos = async () => {
  const res = await apiClient(`/videos/random-videos`)
  return res.data;
}

const fetchVideoById = async (videoId) => {
  const res = await apiClient.get(`/videos/${videoId}`)
  return res.data;
}

const togglePublishStatus = async (videoId) => {
  const res = await apiClient.patch(`videos/toggle/publish/${videoId}`)
  return res.data
}


export {
  fetchAllVideos,
  fetchVideoById,
  fetchRandomVideos,
  togglePublishStatus
}