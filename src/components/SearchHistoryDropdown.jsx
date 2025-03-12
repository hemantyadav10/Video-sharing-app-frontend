import { ArrowTopLeftIcon, Cross1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Badge, Flex, IconButton, ScrollArea, Separator, Spinner, Text } from '@radix-ui/themes'
import { ArrowDown, ArrowUp, CornerDownLeft, History, Search } from 'lucide-react'
import { useTheme } from 'next-themes'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { useClearSearchHistory, useDeleteSearchItem, useGetUserSearchHistory, useSetSearchHistory } from '../lib/queries/searchHistoryQueries'
import { useFetchVideos } from '../lib/queries/videoQueries'

function SearchHistoryDropdown({
  setOpen,
  query = '',
  inputRef,
  setQuery
}) {
  const { user, isAuthenticated } = useAuth()
  const { data, isLoading: isLoadingHistory } = useGetUserSearchHistory(user?._id)
  const { theme } = useTheme()
  const filteredData = data?.data?.searches?.filter((search) => {
    if (query?.trim() !== '') {
      return search.toLowerCase().includes(query.toLowerCase())
    }
    return true
  }) || []


  const { data: searchData, isLoading: isloadingResults } = useFetchVideos(new URLSearchParams({ query: query }), 5)
  const hasManyResults = searchData?.pages?.[0].data.totalPages > 1 || false
  const hasResult = searchData?.pages?.[0].data.totalDocs > 0 || false
  const dropDownRef = useRef()

  const [focusedIndex, setFocusedIndex] = useState(-1) // -1 means no focus
  const allItems = [
    ...filteredData,
    ...(searchData?.pages?.[0]?.data.docs?.map(item => item.title) || [])
  ];
  const totalItems = allItems.length + (hasManyResults ? 1 : 0);
  const { mutate: clearHistory, isPending: isDeletingSearchHistory } = useClearSearchHistory()
  const { mutate: setSearchHistory } = useSetSearchHistory()
  const handleDeleteHistory = async () => {
    clearHistory()
  }
  const handleSetHistory = async (searchTern) => {
    setSearchHistory(searchTern.toLowerCase())
  }


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
      if (totalItems === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex((prev) => (prev + 1) % totalItems);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex((prev) => (prev - 1 + totalItems) % totalItems);
      }
      if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault()
        if (focusedIndex === allItems.length) {
          document.getElementById('see-all-results')?.click();
        } else {
          document.getElementById(`search-item-${focusedIndex}`)?.click();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [allItems, focusedIndex])


  useEffect(() => {
    const handleClick = (e) => {
      if (!dropDownRef.current || !inputRef.current) return;

      if (!dropDownRef.current.contains(e.target) && e.target !== inputRef.current) {
        setOpen(false);
      }
    };
    // if (window.innerWidth > 768) {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
    // }
  }, []);

  useEffect(() => {
    if (focusedIndex >= 0) {
      const focusedElement = document.getElementById(`search-item-${focusedIndex}`);
      focusedElement?.scrollIntoView({ block: 'nearest' });

      if (focusedIndex === allItems.length) {
        document.getElementById('see-all-results')?.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  return (
    <div ref={dropDownRef} className={` border-y sm:border border-[--gray-a6] shadow-lg sm:rounded-xl  h-[calc(100vh-64px)] sm:h-auto bg-[--color-background] ${theme === "light" ? "" : "shadow-black/70"} sm:min-h-72 relative `}>
      <KeyboardNavigation />
      <ScrollArea type="auto" className='pt-4 sm:mb-10 pb-1 rounded-xl h-[calc(100vh-128px)] sm:h-72' scrollbars="vertical">

        <Flex mb={'1'} className='px-4' justify={'between'} align={'center'}>
          <Text as='span' size={'1'} color='gray'  >
            Recent
          </Text>
          <IconButton
            disabled={filteredData?.length === 0}
            loading={isDeletingSearchHistory}
            title='Clear history'
            aria-label='Clear history'
            variant="ghost"
            mt={'1'}
            color='gray'
            onClick={handleDeleteHistory}
            size={'1'}
          >
            <TrashIcon />
          </IconButton>
        </Flex>
        {
          isAuthenticated ? (
            <>
              {isLoadingHistory && (
                <Flex justify={'center'}>
                  <Spinner className='mx-auto' />
                </Flex>
              )}
              {!isLoadingHistory && (
                filteredData.length > 0 ? (
                  filteredData.map((search, idx) => (
                    <SearchHistoryItem
                      search={search}
                      key={idx}
                      index={idx}
                      focusedIndex={focusedIndex}
                      close={() => setOpen(false)}
                      setQuery={() => setQuery(search)}
                      handleSetHistory={handleSetHistory}
                    />
                  ))
                ) : (
                  <Text as='p' mx={'4'} size={'2'} mb={'2'} align={'center'}>
                    No recent searches.
                  </Text>
                ))}
            </>
          ) : (
            <>
              <Text as='p' mx={'4'} size={'1'} mb={'2'} align={'center'}>
              Sign in to see your recent searches.
              </Text>
              <Separator size={"4"} mb={'2'}/>
            </>
          )
        }
        {query?.trim() && (
          <>
            <Separator size={'4'} my={'1'} mb={'4'} hidden={!isAuthenticated || !filteredData} />
            <Text as='p' size={'1'} color='gray' className='px-4' mb={'1'}>
              Search Results
            </Text>
            {!isloadingResults && (
              hasResult ? (
                <>
                  {searchData?.pages?.[0].data.docs.map((result, idx) => (
                    <SearchResultItem
                      result={result}
                      key={result._id}
                      index={filteredData.length + idx}
                      focusedIndex={focusedIndex}
                      close={() => setOpen(false)}
                      handleSetHistory={handleSetHistory}
                    />
                  ))}
                  {hasManyResults && (
                    <Text asChild color='blue' size={'2'} className={`flex items-center justify-end w-full gap-2 mx-4 mb-1 cursor-pointer hover:underline ${focusedIndex === allItems.length ? "ring-2" : ""} w-max ml-auto`}>
                      <Link
                        id="see-all-results"
                        to={`/results?query=${query}`}
                        onClick={() => setOpen(false)}
                      >
                        <ArrowTopLeftIcon />  See all results
                      </Link>
                    </Text>
                  )}
                </>
              ) : (
                <Text as='p' size={'2'} align={'center'}>
                  No results for "<Text as='span' weight={'medium'}>{query}</Text>"
                </Text>
              )
            )}
          </>
        )}
      </ScrollArea>
    </div>
  )
}

export default React.memo(SearchHistoryDropdown)

export function SearchHistoryItem({ search, close, index, focusedIndex, handleSetHistory, setQuery }) {
  const { mutate, isPending } = useDeleteSearchItem()
  const navigate = useNavigate()
  const handleLinkClick = (e) => {
    handleSetHistory(search)
    navigate(`/results?query=${search}`)
    close()
    setQuery()
  }
  const handleDeletItem = async (e) => {
    e.stopPropagation()
    e.preventDefault()

    mutate(search)
  }


  return (
    <div
      id={`search-item-${index}`}
      tabIndex={0}
      onClick={handleLinkClick}
      aria-selected={index === focusedIndex}
      className={`hover:bg-[--gray-a3] hover:cursor-pointer flex items-center gap-3 p-2 mx-2 rounded-md ${index === focusedIndex ? "bg-[--accent-a3] border-l-4 border-[--focus-8]" : ""}`}
    >
      <Link
        to={`/results?query=${search}`}
        className='flex items-center flex-1 gap-3'
      >
        <History strokeWidth={1.25} size={18} />
        <Text as='div' className='flex-1' weight={'medium'} size={'2'}>
          {search}
        </Text>
      </Link>
      <IconButton
        variant='ghost'
        radius='full'
        onClick={handleDeletItem}
      >
        <Cross1Icon />
      </IconButton>
    </div>
  )
}

export function SearchResultItem({ result, close, index, focusedIndex, handleSetHistory }) {
  const { _id, title } = result
  return (
    <Link
      id={`search-item-${index}`}
      onClick={() => {
        handleSetHistory(title)
        close()
      }}
      to={`/watch/${_id}`}
      aria-selected={index === focusedIndex}
      className={`hover:bg-[--gray-a3] hover:cursor-pointer flex items-center gap-3 p-2 mx-2 rounded-md ${index === focusedIndex ? "bg-[--accent-a3] border-l-4 border-[--focus-8]" : ""}`}
    >
      <Search strokeWidth={1.25} size={18} />
      <Text as='p' className='flex-1' weight={'medium'} size={'2'}>
        {title.toLowerCase()}
      </Text>
      <ArrowTopLeftIcon />
    </Link >
  )
}

export function KeyboardNavigation() {
  return (
    <div className='absolute bottom-0 w-full px-3 border-t bg-[--color-surface] border-[--gray-a6] sm:flex items-center text-[10px] justify-between rounded-b-xl h-10 hidden'>
      <Flex align={'center'} gap={'1'}>
        <Badge color="gray" variant="soft" className=''>
          <CornerDownLeft size={'14'} />
        </Badge>
        <Text as='span' color='gray' >
          select
        </Text>
      </Flex>
      <Flex align={'center'} gap={'1'}>
        <Badge color="gray" variant="soft">
          <ArrowUp size={'14'} />
        </Badge>
        <Badge color="gray" variant="soft">
          <ArrowDown size={'14'} />
        </Badge>
        <Text as='span' color='gray' >
          navigate
        </Text>
      </Flex>
      <Flex align={'center'} gap={'1'}>
        <Badge color="gray" variant="soft" className='text-[10px]'>
          Esc
        </Badge>
        <Text as='span' color='gray' >
          close
        </Text>
      </Flex>
    </div>
  )
}
