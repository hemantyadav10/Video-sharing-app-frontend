import apiClient from "./apiClient";

const fetchAllVideos = async () => {
  const response = await apiClient.get('/videos');
  return response.data;
};

const fetchVideoById = async (videoId) => {
  const res = await apiClient.get(`/videos/${videoId}`)
  return res.data;
}


export {
  fetchAllVideos, 
  fetchVideoById,
}