import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import VideoCard from '../components/VideoCard'
import {  Dialog, IconButton, Text, Tooltip } from '@radix-ui/themes'
import FilterIcon from '../assets/FilterIcon'
import { Cross1Icon } from '@radix-ui/react-icons'

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('search_query')
  // Get the current sortBy and sortType parameters from the URL
  const currentSortBy = searchParams.get('sortBy')
  const currentSortType = searchParams.get('sortType')

  // Button class logic
  const getButtonClass = (isActive) => isActive && 'text-white font-semibold';

  useEffect(() => {
    if (!query) {
      searchParams.set('search_query', '')
      setSearchParams(searchParams)
    }
  }, [])


  return (
    <div className='w-full px-4 py-6 mx-auto lg:px-16 sm:px-6'>
      <div className='mb-6 text-end'>
        <Dialog.Root>
          <Tooltip content='Search filters'>
            <Dialog.Trigger>
              <IconButton size={'4'} radius='full' variant='ghost' highContrast>
                <FilterIcon width='20' height='20' />
              </IconButton>
            </Dialog.Trigger>
          </Tooltip>
          <Dialog.Content>
            <Dialog.Title mb={'6'} weight={'medium'} size={'5'} className='flex items-center'>
              <Text>
                Search Filter
              </Text>
              <Dialog.Close>
                <IconButton
                  size={'3'}
                  radius='full'
                  variant='ghost'
                  color='gray'
                  highContrast
                  className='ml-auto border'
                >
                  <Cross1Icon height={'20'} width={'20'} />
                </IconButton>
              </Dialog.Close>
            </Dialog.Title>
            <Dialog.Description>
            </Dialog.Description>
            <div className='grid w-full grid-cols-2 gap-8 mb-10 sm:grid-cols-4 '>
              <div className='space-y-4 text-xs '>
                <h3 className='pb-4 font-medium border-b border-[#484848]'>
                  UPLOAD DATE
                </h3>
                <div className='flex flex-col text-[#f1f7feb5] gap-4 text-sm'>
                  <Dialog.Close>
                  <button
                      onClick={() => {
                        setSearchParams(params => {
                          if (currentSortBy === 'createdAt' && currentSortType === 'desc') {
                            params.delete('sortBy');
                            params.delete('sortType');
                          } else {
                            params.set('sortBy', 'createdAt');
                            params.set('sortType', 'desc');
                          }
                          return params
                        }
                        )
                      }}
                      className={`text-left transition-all hover:text-white active:text-opacity-80 ${getButtonClass(currentSortBy === 'createdAt' && currentSortType === 'desc')} flex items-center gap-4`}>Latest<Cross1Icon className={`${!(currentSortBy === 'createdAt' && currentSortType === 'desc') && 'hidden'}`} /></button>
                  </Dialog.Close>
                  <Dialog.Close>
                    <button
                      onClick={() => {
                        setSearchParams(params => {
                          if (currentSortBy === 'createdAt' && currentSortType === 'asc') {
                            params.delete('sortBy');
                            params.delete('sortType');
                          } else {
                            params.set('sortBy', 'createdAt');
                            params.set('sortType', 'asc');
                          }
                          return params
                        }
                        )
                      }}
                      className={`text-left transition-all hover:text-white active:text-opacity-80 ${getButtonClass(currentSortBy === 'createdAt' && currentSortType === 'asc')} flex items-center gap-4`}>Oldest<Cross1Icon className={`${!(currentSortBy === 'createdAt' && currentSortType === 'asc') && 'hidden'}`} /></button>
                  </Dialog.Close>
                </div>
              </div>
              <div className='space-y-4 text-xs '>
                <h3 className='pb-4 font-medium border-b border-[#484848]'>
                  TYPE
                </h3>
                <div className='flex flex-col text-[#f1f7feb5] gap-4 text-sm'>
                  <Dialog.Close>
                    <button className='text-left transition-all hover:text-white active:text-opacity-80'>Video</button>
                  </Dialog.Close>
                  <Dialog.Close>
                    <button className='text-left transition-all hover:text-white active:text-opacity-80'>Channel</button>
                  </Dialog.Close>
                  <Dialog.Close>
                    <button className='text-left transition-all hover:text-white active:text-opacity-80'>Playlist</button>
                  </Dialog.Close>
                </div>
              </div>
              <div className='space-y-4 text-xs '>
                <h3 className='pb-4 font-medium border-b border-[#484848]'>
                  VIEW COUNT
                </h3>
                <div className='flex flex-col text-[#f1f7feb5] gap-4 text-sm'>
                  <Dialog.Close>
                    <button
                      onClick={() => {
                        setSearchParams(params => {
                          if (currentSortBy === 'views' && currentSortType === 'asc') {
                            params.delete('sortBy');
                            params.delete('sortType');
                          } else {
                            params.set('sortBy', 'views');
                            params.set('sortType', 'asc');
                          }
                          return params
                        }
                        )
                      }}
                      className={`text-left transition-all hover:text-white active:text-opacity-80 ${getButtonClass(currentSortBy === 'views' && currentSortType === 'asc')} flex items-center gap-4`}>Low to High<Cross1Icon className={`${!(currentSortBy === 'views' && currentSortType === 'asc') && 'hidden'}`} /></button>
                  </Dialog.Close>
                  <Dialog.Close>
                    <button
                      onClick={() => {
                        setSearchParams(params => {
                          if (currentSortBy === 'views' && currentSortType === 'desc') {
                            params.delete('sortBy');
                            params.delete('sortType');
                          } else {
                            params.set('sortBy', 'views');
                            params.set('sortType', 'desc');
                          }
                          return params
                        }
                        )
                      }}
                      className={`text-left transition-all hover:text-white active:text-opacity-80 ${getButtonClass(currentSortBy === 'views' && currentSortType === 'desc')} flex items-center gap-4`}>High to Low <Cross1Icon className={`${!(currentSortBy === 'views' && currentSortType === 'desc') && 'hidden'}`} /></button>
                  </Dialog.Close>
                </div>
              </div>
              <div className='space-y-4 text-xs '>
                <h3 className='pb-4 font-medium border-b border-[#484848]'>
                  DURATION
                </h3>
                <div className='flex flex-col text-[#f1f7feb5] gap-4 text-sm'>
                  <Dialog.Close>
                    <button
                      onClick={() => {
                        setSearchParams(params => {
                          if (currentSortBy === 'duration' && currentSortType === 'asc') {
                            params.delete('sortBy');
                            params.delete('sortType');
                          } else {
                            params.set('sortBy', 'duration');
                            params.set('sortType', 'asc');
                          }
                          return params
                        }
                        )
                      }}
                      className={`text-left transition-all hover:text-white active:text-opacity-80 ${getButtonClass(currentSortBy === 'duration' && currentSortType === 'asc')} flex items-center gap-4`}>Low to High <Cross1Icon className={`${!(currentSortBy === 'duration' && currentSortType === 'asc') && 'hidden'}`} /></button>
                  </Dialog.Close>
                  <Dialog.Close>
                    <button
                      onClick={() => {
                        setSearchParams(params => {
                          if (currentSortBy === 'duration' && currentSortType === 'desc') {
                            params.delete('sortBy');
                            params.delete('sortType');
                          } else {
                            params.set('sortBy', 'duration');
                            params.set('sortType', 'desc');
                          }
                          return params
                        }
                        )
                      }}
                      className={`text-left transition-all hover:text-white active:text-opacity-80 ${getButtonClass(currentSortBy === 'duration' && currentSortType === 'desc')} flex items-center gap-4`}>High to Low <Cross1Icon className={`${!(currentSortBy === 'duration' && currentSortType === 'desc') && 'hidden'}`} /></button>
                  </Dialog.Close>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Root>

      </div>
      <div className='flex flex-col items-center gap-6 sm:gap-0'>
        {Array.from({ length: 10 }).fill(1).map((_, i) => (
          <VideoCard key={i} list />
        ))}
      </div>
    </div>
  )
}

export default SearchResults
