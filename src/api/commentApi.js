import apiClient from "./apiClient"

const fetchVideoComments = async (videoId, page = 1, limit = 6, sortBy = 'newest') => {
  const res = await apiClient.get(`/comments/${videoId}?page=${page}&limit=${limit}&sortBy=${sortBy}`)
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

const updateComment = async (commentId, newComment) => {
  const res = await apiClient.patch(`/comments/c/${commentId}`, { newComment: newComment })
  return res.data;
}



export {
  fetchVideoComments,
  addComment,
  deleteComment,
  updateComment
}