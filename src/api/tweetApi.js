import apiClient from "./apiClient"

const getUserTweets = async (userId) => {
  const res = await apiClient.get(`/tweets/user/${userId}`)

  return res.data;
}

const createTweet = async (content) => {
  const res = await apiClient.post(`/tweets`, { content: content })
  return res.data;
}

const deleteTweet = async (tweetId) => {
  const res = await apiClient.delete(`/tweets/${tweetId}`)
  return res.data;
}


export {
  getUserTweets,
  createTweet, 
  deleteTweet
}