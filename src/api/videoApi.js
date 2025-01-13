import apiClient from "./apiClient";

const VIDEO_BASE_URL = '/videos'

const fetchAllVideos = async (queryString = '') => {
  const url = `${VIDEO_BASE_URL}?${queryString}`;

  const response = await apiClient.get(url);

  return response.data;
};

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

const deleteVideo = async (videoId) => {
  const res = await apiClient.delete(`${VIDEO_BASE_URL}/${videoId}`)
  return res.data
}

const getVideosByTag = async (tag) => {
  const res = await apiClient.get(`${VIDEO_BASE_URL}/tags/${tag}`)
  return res.data;
}

const getRelatedVideos = async (videoId, page = 1, limit = 10) => {
  const res = await apiClient.get(`${VIDEO_BASE_URL}/related/${videoId}?page=${page}&limit=${limit}`)
  return res.data
}


export {
  fetchAllVideos,
  fetchVideoById,
  togglePublishStatus,
  updateVideo,
  publishVideo,
  deleteVideo,
  getVideosByTag,
  getRelatedVideos
}