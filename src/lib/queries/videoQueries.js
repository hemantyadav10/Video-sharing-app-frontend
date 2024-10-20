import { useQuery } from "@tanstack/react-query"
import { fetchAllVideos } from "../../api/videoApi"

const useFetchVideos = () => {
  return useQuery({
    queryKey: ['vidoes'],
    queryFn: fetchAllVideos
  })
}



export {
  useFetchVideos
}