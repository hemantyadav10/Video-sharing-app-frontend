import { Text } from '@radix-ui/themes'
import React from 'react'
import { BarLoader } from 'react-spinners'
import no_content from '../../assets/no_content.svg'
import PaginationComponent from '../../components/PaginationComponent'
import QueryErrorHandler from '../../components/QueryErrorHandler'
import VideoTable, { VideoTableSkeleton } from '../../components/VideoTable'
import { useAuth } from '../../context/authContext'
import { useGetChannleVideos } from '../../lib/queries/dashboardQueries'
import { usePaginationContext } from './DashboardLayout'

function VideosTab() {
  const { user, isAuthenticated } = useAuth()
  const {limit, page, setPage, setLimit} = usePaginationContext()
  const {
    data: videoData,
    isPending: loadingVideos,
    error,
    isError,
    refetch,
    isFetching
  } = useGetChannleVideos(isAuthenticated, limit, page)
  const paginationInfo = {
    hasNextPage: videoData?.data?.hasNextPage ?? false,
    hasPrevPage: videoData?.data?.hasPrevPage ?? false,
    totalDocs: videoData?.data?.totalDocs ?? 0,
    totalPages: videoData?.data?.totalPages ?? 1
  }


  return (
    <div>
      <div className='fixed left-0 right-0 z-[60] top-16'>
        <BarLoader
          color='#70b8ff'
          width={'100%'}
          height={'4px'}
          loading={isFetching}
          className='rounded-full'
        />
      </div>
      {loadingVideos ? (
        <VideoTableSkeleton />
      ) : isError ? (
        <QueryErrorHandler error={error} onRetry={refetch} className='mt-0' />
      ) : paginationInfo.totalDocs === 0 ? (
        <NoContent />
      ) : (
        <div className=''>
          <VideoTable
            videos={videoData?.data}
            limit={limit}
            page={page}
          />
          <div className='px-4 py-2 border-[--gray-a6] border-b '>
            <PaginationComponent
              page={page}
              setPage={setPage}
              setLimit={setLimit}
              hasNextPage={paginationInfo.hasNextPage}
              hasPrevPage={paginationInfo.hasPrevPage}
              totalPages={paginationInfo.totalPages}
              isFetching={isFetching}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default VideosTab

const NoContent = () => (
  <section className="flex flex-col items-center justify-center">
    <img src={no_content} alt="no content" className="size-52" />
    <Text color="gray" size="2">No content available</Text>
  </section>
);