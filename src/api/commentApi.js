import { asyncHandler } from "../utils/asyncHandler";
import apiClient from "./apiClient";

const COMMENTS_BASE_URL = '/comments';

// Fetches comments for a specific video
const fetchVideoComments = (videoId, page = 1, limit = 6, sortBy = 'newest') => asyncHandler(async () => {
  const res = await apiClient.get(`${COMMENTS_BASE_URL}/${videoId}?page=${page}&limit=${limit}&sortBy=${sortBy}`);
  return res.data;
});

const fetchCommentReplies = (commentId, page = 1, limit = 5) => asyncHandler(async () => {
  const res = await apiClient.get(`${COMMENTS_BASE_URL}/replies/${commentId}?page=${page}&limit=${limit}`)
  return res.data
})

// Adds a new comment to a specific video
const addComment = (content, videoId) => asyncHandler(async () => {
  const res = await apiClient.post(`${COMMENTS_BASE_URL}/${videoId}`, { content });
  return res.data;
});

const addReply = (content, videoId, commentId) => asyncHandler(async () => {
  const res = await apiClient.post(`${COMMENTS_BASE_URL}/${videoId}/${commentId}`, { content })
  return res.data;
})

// Deletes a specific comment by its ID
const deleteComment = (commentId) => asyncHandler(async () => {
  const res = await apiClient.delete(`${COMMENTS_BASE_URL}/c/${commentId}`);
  return res.data;
});

// Updates an existing comment by its ID
const updateComment = (commentId, newComment) => asyncHandler(async () => {
  const res = await apiClient.patch(`${COMMENTS_BASE_URL}/c/${commentId}`, { newComment });
  return res.data;
});

export {
  fetchVideoComments,
  addComment,
  deleteComment,
  updateComment,
  fetchCommentReplies, 
  addReply
};
