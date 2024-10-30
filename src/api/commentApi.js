import apiClient from "./apiClient"

const fetchVideoComments = async (videoId) => {
  const res = await apiClient.get(`/comments/${videoId}`)
  return res.data;
}

const addComment = async (content, videoId) => {
  const res = await apiClient.post(`/comments/${videoId}`, { content: content })
  return res.data;
}

const deleteComment = async (commentId) => {
  const res = await apiClient.delete(`/comments/c/${commentId}`)
  return res.data;
}

export {
  fetchVideoComments,
  addComment,
  deleteComment
}