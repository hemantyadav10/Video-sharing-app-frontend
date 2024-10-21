import { useQuery } from "@tanstack/react-query"
import { fetchVideoComments } from "../../api/commentApi"

const useGetVideoComments = (videoId) => {
  return useQuery({
    queryKey: ['comments', videoId],
    queryFn: () => fetchVideoComments(videoId)
  })
}


export {
  useGetVideoComments
}