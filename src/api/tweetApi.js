import apiClient from "./apiClient"

const getUserTweets = async (userId) => {
  const res = await apiClient.get(`/tweets/user/${userId}`)

  return res.data;
}

export {
  getUserTweets
}