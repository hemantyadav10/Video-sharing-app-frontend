import apiClient from "./apiClient";

const fetchAllVideos = async () => {
  const response = await apiClient.get('/videos');
  return response.data;
};


export {
  fetchAllVideos
}