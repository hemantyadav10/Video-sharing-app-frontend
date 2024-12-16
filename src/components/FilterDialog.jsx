import React from 'react'
import { Button, Dialog, Skeleton, Text } from '@radix-ui/themes'
import { Cross1Icon } from '@radix-ui/react-icons'
import FilterIcon from '../assets/FilterIcon'
import CloseButton from './CloseButton'

const FilterDialog = ({ filters, currentSortBy, currentSortType, setSearchParams, loading, }) => {
  const getButtonClass = (isActive) => isActive && 'text-white font-semibold';

  return (
    <Dialog.Root>
        <Skeleton loading={loading}>
          <Dialog.Trigger >
            <Button
              size={'2'}
              radius='full'
              variant='ghost'
              highContrast
              color='gray'
            >
              Filters<FilterIcon width='24' height='24' />
            </Button>
          </Dialog.Trigger>
        </Skeleton>
      <Dialog.Content maxWidth={'500px'}>
        <Dialog.Title mb={'6'} weight={'medium'} size={'5'} className='flex items-center'>
          <Text className='mr-auto'>Search Filter</Text>
          <CloseButton />
        </Dialog.Title>
        <div className='grid w-full grid-cols-2 gap-8 mb-10 sm:grid-cols-3 '>
          {filters.map(({ title, options }) => (
            <div key={title} className='space-y-4 text-xs'>
              <h3 className='pb-4 font-medium border-b border-[#484848]'>
                {title}
              </h3>
              <div className='flex flex-col text-[#f1f7feb5] gap-4 text-sm'>
                {options.map(({ label, sortBy, sortType }) => (
                  <Dialog.Close key={label}>
                    <button
                      onClick={() => {
                        setSearchParams((params) => {
                          if (currentSortBy === sortBy && currentSortType === sortType) {
                            params.delete('sortBy')
                            params.delete('sortType')
                          } else {
                            params.set('sortBy', sortBy)
                            params.set('sortType', sortType)
                          }
                          return params
                        })
                      }}
                      className={`transition-all hover:text-white active:text-opacity-80 ${getButtonClass(
                        currentSortBy === sortBy && currentSortType === sortType
                      )} flex items-center gap-4 `}
                    >
                      {label}
                      <Cross1Icon
                        className={`${!(currentSortBy === sortBy && currentSortType === sortType) && 'hidden'}`}
                      />
                    </button>
                  </Dialog.Close>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default FilterDialog


{/* <div className='flex flex-col items-center gap-6 sm:gap-0'>
        {loadingResults && Array.from({ length: 2 }).fill(1).map((_, i) => (
          <VideoCard key={i} list loading={loadingResults} />
        ))}
        {result?.data?.totalDocs > 0
          ? result?.data?.docs.map((video) => (
            <VideoCard key={video._id} list videoData={video} loading={loadingResults} />
          ))
          : <NoContent
            title='No results found'
            description='Try different keywords or remove search filters'
          />
        }
      </div> */}