import apiClient from "./apiClient";

const VIDEO_BASE_URL = '/videos'

const fetchAllVideos = async () => {
  const response = await apiClient.get(VIDEO_BASE_URL);
  return response.data;
};

const fetchRandomVideos = async () => {
  const res = await apiClient(`${VIDEO_BASE_URL}/random-videos`)
  return res.data;
}

const fetchVideoById = async (videoId) => {
  const res = await apiClient.get(`${VIDEO_BASE_URL}/${videoId}`)
  return res.data;
}

const togglePublishStatus = async (videoId) => {
  const res = await apiClient.patch(`${VIDEO_BASE_URL}/toggle/publish/${videoId}`)
  return res.data
}

const updateVideo = async (videoId, formData) => {
  const res = await apiClient.patch(`${VIDEO_BASE_URL}/${videoId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

const publishVideo = async (formData) => {
  const res = await apiClient.post(VIDEO_BASE_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data;
}


export {
  fetchAllVideos,
  fetchVideoById,
  fetchRandomVideos,
  togglePublishStatus,
  updateVideo,
  publishVideo
}