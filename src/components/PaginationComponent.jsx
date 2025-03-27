import { Flex, IconButton, Select, Separator, Text, TextField, Tooltip } from '@radix-ui/themes'
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useRef } from 'react'

function PaginationComponent({
  page,
  setPage,
  setLimit,
  hasNextPage,
  hasPrevPage,
  totalPages,
  isFetching
}) {
  const inputRef = useRef()

  return (
    <Flex
      gap={'3'}
      align={'center'}
      justify={'end'}
      wrap={'wrap'}
    >
      <Tooltip
        content="Go to first page"
      >
        <IconButton
          variant='ghost'
          mr={'2'}
          color='gray'
          onClick={() => setPage(1)}
          disabled={!hasPrevPage || page === 1 || isFetching}
          radius='full'
        >
          <ChevronFirst size={20} />
        </IconButton>
      </Tooltip>
      <Tooltip
        content="Previous page"
      >
        <IconButton
          variant='ghost'
          mr={'2'}
          color='gray'
          title='Previous page'
          onClick={() => setPage(prev => prev - 1)}
          disabled={!hasPrevPage || page === 1 || isFetching}
          radius='full'
        >
          <ChevronLeft size={20} />
        </IconButton>
      </Tooltip>
      <Tooltip
        content="Next page"
      >
        <IconButton
          variant='ghost'
          mr={'2'}
          color='gray'
          onClick={() => setPage(prev => prev + 1)}
          disabled={!hasNextPage || page === totalPages || isFetching}
          radius='full'
        >
          <ChevronRight size={20} />
        </IconButton>
      </Tooltip>
      <Tooltip
        content="Go to last page"
      >
        <IconButton
          variant='ghost'
          mr={'2'}
          color='gray'
          onClick={() => setPage(totalPages)}
          disabled={!hasNextPage || page === totalPages || isFetching}
          radius='full'
        >
          <ChevronLast size={20} />
        </IconButton>
      </Tooltip>
      <Text
        as='div'
        size={'2'}
        className='flex items-center gap-2'
      >
        Page
        <Text as='span' className=' tabular-nums'>
          {page}
        </Text>
        of
        <Text as='span' className='tabular-nums'>
          {totalPages || 1}
        </Text>

      </Text>

      <Separator orientation={'vertical'} size={'2'} />

      <Text
        as='div'
        className='flex items-center gap-2 text-nowrap'
        size={'2'}
      >
        Go to page
        <form onSubmit={(e) => {
          e.preventDefault()
          setPage(parseInt(inputRef.current.value))
        }}>
          <TextField.Root
            max={totalPages}
            min={1}
            required
            defaultValue={page}
            ref={inputRef}
            type='number'
            className='w-11'
          />
        </form>
      </Text>

      <Separator orientation={'vertical'} size={'2'} />

      <Text
        as='div'
        className='flex items-center gap-2'
        size={'2'}
      >
        Rows per page:
        <Select.Root
          onValueChange={(value) => {
            setLimit(parseInt(value))
            setPage(1)
          }}
          defaultValue={5}
        >
          <Select.Trigger />
          <Select.Content highContrast >
            <Select.Item value={5}>5</Select.Item>
            <Select.Item value={10}>10</Select.Item>
            <Select.Item value={15}>15</Select.Item>
            <Select.Item value={20}>20</Select.Item>
          </Select.Content>
        </Select.Root>
      </Text>
    </Flex>
  )
}

export default PaginationComponent
