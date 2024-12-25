import { ChevronDownIcon, PlayIcon } from '@radix-ui/react-icons';
import { Button, SegmentedControl, Separator, Spinner } from '@radix-ui/themes';
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import EmptyLibrary from '../../components/EmptyLibrary';
import VideoCard from '../../components/VideoCard';
import { useFetchUserVideos } from '../../lib/queries/userQueries';

function ChannelVideos() {
  const [filters, setFilters] = useState('sortBy=createdAt&sortType=desc'); // Initial filter query
  const [currentFilter, setCurrentFilter] = useState('Latest'); // Current filter state   

  const { userId } = useOutletContext()
  const { data: videoData, isLoading: loadingVideos, isFetchingNextPage, hasNextPage, fetchNextPage, isFetching } = useFetchUserVideos(userId, filters, 6)
  const filterOptions = [
    { label: 'Latest', value: 'Latest', query: 'sortBy=createdAt&sortType=desc' },
    { label: 'Popular', value: 'Popular', query: 'sortBy=views&sortType=desc' },
    { label: 'Oldest', value: 'Oldest', query: 'sortBy=createdAt&sortType=asc' },
  ];

  const handleFilterChange = (value) => {
    const selectedFilter = filterOptions.find((filter) => filter.value === value);
    if (selectedFilter) {
      setFilters(selectedFilter.query);
      setCurrentFilter(value);
    }
  };

  return (
    <div
      tabIndex={isFetching ? -1 : 0}
      className={`${(isFetching && !loadingVideos && !isFetchingNextPage) ? 'pointer-events-none opacity-30 ' : ''}`}
    >

      {/* Filter Section */}
      {videoData?.pages[0]?.data.totalDocs > 0 && <>
        <SegmentedControl.Root
          variant='surface'
          mx={'4'}
          className='sm:mx-0'
          value={currentFilter}
          onValueChange={handleFilterChange}
          radius="full"
        >
          {filterOptions.map((filter) => (
            <SegmentedControl.Item key={filter.value} value={filter.value}>
              {filter.label}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </>}

      {loadingVideos && <Spinner className='mx-auto my-4 size-6' />}
      {!loadingVideos && videoData?.pages[0]?.data.totalDocs === 0 &&
        <EmptyLibrary
          Icon={PlayIcon}
          title='No videos uploaded'
          description='This page is yet to upload a video. Search another page in order to find more videos,'
        />
      }
      <div className='flex flex-col pt-4 gap-y-6 gap-x-2 sm:grid sm:grid-cols-2 lg:grid-cols-3'>
        {videoData?.pages?.length > 0 && (
          videoData?.pages.map((page, pageIndex) => (
            <React.Fragment key={pageIndex}>
              {page.data.totalDocs > 0 && (
                page.data.docs.map((video) => (
                  <VideoCard
                    key={video._id}
                    videoData={video}
                    loading={loadingVideos}
                    hideAvatar
                    hideUsername
                  />
                ))
              )}
            </React.Fragment>
          ))
        )}
      </div>
      {isFetchingNextPage && <div className='flex items-center h-8 my-4'><Spinner className='h-6 mx-auto' /></div>}
      {/* Load More Button */}
      {(hasNextPage && !isFetchingNextPage) ?
        < div className='flex items-center my-4'>
          <Separator className='flex-1' />
          <Button
            className='flex flex-1'
            color='gray'
            variant='outline'
            radius='full'
            onClick={fetchNextPage}
            loading={isFetchingNextPage}
          >
            Show more<ChevronDownIcon className='size-5' />
          </Button>
          <Separator className='flex-1' />
        </div> : <div className='h-8 my-4'></div>
      }
    </div >
  )
}

export default ChannelVideos
