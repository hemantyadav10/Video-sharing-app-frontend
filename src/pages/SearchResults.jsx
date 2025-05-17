import { Button, Spinner } from '@radix-ui/themes'
import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useSearchParams } from 'react-router-dom'
import ChannelCard from '../components/ChannelCard'
import FilterDialog from '../components/FilterDialog'
import NoContent from '../components/NoContent'
import QueryErrorHandler from '../components/QueryErrorHandler'
import VideoCard from '../components/VideoCard'
import { useAuth } from '../context/authContext'
import { useSearchUser } from '../lib/queries/userQueries'
import { useFetchVideos } from '../lib/queries/videoQueries'

const SearchResults = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const query = searchParams.get('query')
	const currentSortBy = searchParams.get('sortBy')
	const currentSortType = searchParams.get('sortType')
	const searchType = searchParams.get('type')
	const { user } = useAuth()

	const { data: result, isLoading: loadingResults, hasNextPage, fetchNextPage, isFetchingNextPage, error: errorFetchingVideos, isError: isErrorFetchingVideos, refetch: refetchVideos } = useFetchVideos(searchParams)
	const { ref, inView } = useInView({
		rootMargin: '400px'
	})

	const { data, isLoading: loadingChannelResults, isError, isFetching, error, refetch } = useSearchUser(query, searchType, user?._id)

	useEffect(() => {
		if (!query) {
			searchParams.set('query', '')
			setSearchParams(searchParams)
		}
	}, [query, searchParams, setSearchParams])

	useEffect(() => {
		if (inView && hasNextPage) {
			fetchNextPage();
		}
	}, [inView, hasNextPage]);

	const filters = [
		{
			title: 'UPLOAD DATE',
			options: [
				{ label: 'Latest', sortBy: 'createdAt', sortType: 'desc' },
				{ label: 'Oldest', sortBy: 'createdAt', sortType: 'asc' }
			]
		},
		{
			title: 'VIEW COUNT',
			options: [
				{ label: 'Low to High', sortBy: 'views', sortType: 'asc' },
				{ label: 'High to Low', sortBy: 'views', sortType: 'desc' }
			]
		},
		{
			title: 'DURATION',
			options: [
				{ label: 'Low to High', sortBy: 'duration', sortType: 'asc' },
				{ label: 'High to Low', sortBy: 'duration', sortType: 'desc' }
			]
		}
	]

	return (
		<div className='w-full max-w-screen-xl py-4 mx-auto mb-16 sm:mb-0 lg:px-16 sm:px-6'>
			<div className='flex items-center justify-between px-4 mb-6 sm:px-0'>
				<div className='flex gap-2'>
					<Button
						onClick={() => {
							searchParams.set('type', 'videos')
							setSearchParams(searchParams)
						}}
						variant={searchType ? searchType === "videos" ? "solid" : "soft" : "solid"}
						color='gray'
						highContrast
						radius='large'
					>
						Videos
					</Button>
					<Button
						onClick={() => {
							searchParams.set('type', 'channels')
							setSearchParams(searchParams)
						}}
						variant={searchType === "channels" ? "solid" : "soft"}
						color='gray'
						highContrast
						radius='large'
					>
						Channels
					</Button>
				</div>
				{searchType !== "channels" && (
					<FilterDialog
						filters={filters}
						currentSortBy={currentSortBy}
						currentSortType={currentSortType}
						setSearchParams={setSearchParams}
						loading={loadingResults}
					/>
				)
				}
			</div>
			{(!searchType || searchType === "videos") ? <div className='flex flex-col items-center gap-0 sm:gap-2'>
				{loadingResults && (
					Array.from({ length: 4 }).map((_, i) => <VideoCard key={i} list loading={loadingResults} />)
				)}
				{isErrorFetchingVideos && (
					<div className='border border-[--gray-a6] rounded-xl p-6 pt-0 w-full'>
						<QueryErrorHandler error={errorFetchingVideos} onRetry={refetchVideos} />
					</div>
				)}
				{!loadingResults && !isErrorFetchingVideos && result?.pages.length > 0 && (
					result.pages.map((page, pageIndex) => (
						<div key={pageIndex} className="flex flex-col items-center w-full gap-0 sm:gap-2">
							{page.data.totalDocs > 0 ? (
								page.data.docs.map((video) => (
									<VideoCard key={video._id} list videoData={video} loading={loadingResults} />
								))
							) : (
								<NoContent
									title='No results found'
									description='Try different keywords or remove search filters'
								/>
							)}
						</div>
					))
				)}
				{isFetchingNextPage && <Spinner className='my-2 size-6' />}
				{(hasNextPage && !isFetchingNextPage) && <div ref={ref}></div>}
				{!query && <NoContent
					title='No results found'
					description='Try different keywords or remove search filters'
				/>}
			</div>
				: (
					<div className='flex flex-col px-6'>
						{loadingChannelResults &&
							Array.from({ length: 3 }).fill(1).map((_, i) => (
								<ChannelCard
									key={i}
									loading={loadingChannelResults}
								/>
							))
						}
						{isError && (
							<div className='border border-[--gray-a6] rounded-xl p-6 pt-0'>
								<QueryErrorHandler error={error} onRetry={refetch} />
							</div>
						)}
						{!isError && !loadingChannelResults && (data?.data.length > 0
							? data?.data.map((subscription, i) => (
								<ChannelCard
									key={subscription?._id}
									channel={subscription}
									loading={loadingChannelResults}
									isFetching={isFetching}
								/>
							)) : (
								<NoContent
									title='No results found'
									description='Try different keywords.'
								/>
							))}
					</div>
				)
			}
		</div>
	)
}

export default SearchResults
