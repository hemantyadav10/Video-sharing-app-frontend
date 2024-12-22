import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import VideoCard from '../components/VideoCard'
import FilterDialog from '../components/FilterDialog'
import { useFetchVideos } from '../lib/queries/videoQueries'
import NoContent from '../components/NoContent'
import { Spinner } from '@radix-ui/themes'
import { useInView } from 'react-intersection-observer'

const SearchResults = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const query = searchParams.get('query')
	const currentSortBy = searchParams.get('sortBy')
	const currentSortType = searchParams.get('sortType')

	const { data: result, isLoading: loadingResults, hasNextPage, fetchNextPage, isFetchingNextPage } = useFetchVideos(searchParams)
	const { ref, inView } = useInView({
		rootMargin: '100px'
	})


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
		<div className='w-full py-4 mx-auto mb-16 sm:mb-0 lg:px-16 sm:px-6'>
			<div className='mb-6 mr-4 text-end sm:mr-0'>
				<FilterDialog
					filters={filters}
					currentSortBy={currentSortBy}
					currentSortType={currentSortType}
					setSearchParams={setSearchParams}
					loading={loadingResults}
				/>
			</div>
			<div className='flex flex-col items-center gap-0 sm:gap-2'>
				{loadingResults && (
					Array.from({ length: 4 }).map((_, i) => <VideoCard key={i} list loading={loadingResults} />)
				)}
				{!loadingResults && result?.pages.length > 0 && (
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
		</div>
	)
}

export default SearchResults
