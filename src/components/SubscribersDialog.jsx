import { Dialog, Flex, ScrollArea, Table, Text } from '@radix-ui/themes'
import React, { useState } from 'react'
import { BarLoader } from 'react-spinners'
import { useGetSubscribers } from '../lib/queries/subscriptionQueries'
import { ArrowTopRightIcon, TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons';
import PaginationComponent from './PaginationComponent';
import { Link } from 'react-router-dom';
import no_content from '../assets/no_content.svg'
import QueryErrorHandler from './QueryErrorHandler';


const SORT_FIELDS = {
  date: 'createdAt',
  subscribers: 'subscribersCount',
};

const SORT_ORDERS = {
  asc: 'asc',
  desc: 'desc',
};

function SubscribersDialog({
  open = false,
  setOpen
}) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [sortField, setSortField] = useState(SORT_FIELDS.date)
  const [sortOrder, setSortOrder] = useState(SORT_ORDERS.desc)

  const { data, isFetching, isError, refetch, error } = useGetSubscribers(limit, page, sortField, sortOrder)

  const { hasNextPage = false, hasPrevPage = false, totalDocs = 0, totalPages = 1 } = data?.data || {}

  const paginationInfo = { hasNextPage, hasPrevPage, totalDocs, totalPages }

  const toggleSort = (field) => {
    setSortField(field);
    setSortOrder((prev) => (prev === SORT_ORDERS.desc ? SORT_ORDERS.asc : SORT_ORDERS.desc));
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={setOpen}
    >
      <Dialog.Content
        onOpenAutoFocus={(e) => e.preventDefault()}
        maxWidth={"800px"}
        aria-describedby={undefined}
        className='flex flex-col p-0'
      >
        <Dialog.Title size={'6'} className='p-6 mb-0 border-b border-[--gray-a6]'>
          Subscribers
        </Dialog.Title>
        <Flex direction={'column'} justify={'between'} className='relative flex-1'>
          <div className='absolute left-0 right-0 z-10 top-11'>
            <BarLoader
              color='#70b8ff'
              width={'100%'}
              height={'4px'}
              loading={isFetching}
              className='rounded-full'
            />
          </div>
          <ScrollArea type="auto" scrollbars="both" style={{ height: 384, minWidth: 300 }}>
            <div>
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell >
                      <Text as='span' weight={'regular'} color='gray' size={'1'} >
                        Channel
                      </Text>
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>
                      <Text
                        as='span'
                        weight={'regular'}
                        color='gray'
                        size={'1'}
                        onClick={() => toggleSort(SORT_FIELDS.date)}
                        className={`flex gap-2 cursor-pointer hover:text-[--gray-12]  ${sortField === SORT_FIELDS.date ? "font-medium text-[--gray-12]" : ""}`}
                      >
                        Date subscribed
                        {sortField === SORT_FIELDS.date && (sortOrder === SORT_ORDERS.desc ? <TriangleDownIcon /> : <TriangleUpIcon />)}
                      </Text>
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>
                      <Text
                        as='span'
                        weight={'regular'}
                        color='gray'
                        size={'1'}
                        onClick={() => toggleSort(SORT_FIELDS.subscribers)}
                        className={`flex gap-2 cursor-pointer hover:text-[--gray-12]  ${sortField === SORT_FIELDS.subscribers ? "font-medium text-[--gray-12]" : ""}`}
                      >
                        Subscriber count
                        {sortField === SORT_FIELDS.subscribers && (sortOrder === SORT_ORDERS.desc ? <TriangleDownIcon /> : <TriangleUpIcon />)}
                      </Text>
                    </Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {data?.data.docs.map(({ _id, subscriber, createdAt }) => (
                    <Table.Row key={_id} className='hover:bg-[--gray-1] transition'>
                      <Table.RowHeaderCell className='group'>
                        <Link
                          to={`/channel/${subscriber._id}`}
                          className='flex items-center gap-2'
                        >
                          <img
                            src={subscriber.avatar}
                            alt="channel image"
                            className='object-cover object-center rounded-full size-10 aspect-square'
                          />
                          <Text as='span' className='flex items-center gap-2 line-clamp-1'>
                            {subscriber.fullName} <ArrowTopRightIcon className='invisible transition group-hover:visible' />
                          </Text>
                        </Link>
                      </Table.RowHeaderCell>
                      <Table.Cell>
                        {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                      </Table.Cell>
                      <Table.Cell>
                        {subscriber.subscribersCount}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </div>
            {!isFetching && isError && (
              <QueryErrorHandler error={error} onRetry={refetch} className='mt-0' />
            )}
            {!isFetching && !isError && totalDocs === 0 && (
              <section className="flex flex-col items-center justify-center py-6">
                <img src={no_content} alt="no content" className="size-52" />
                <Text color="gray" size="2">No subscribers found</Text>
              </section>
            )}

          </ScrollArea>
          <div className='py-[6px] items-center flex justify-end border-y border-[--gray-a6] px-4 mb-4'>
            <PaginationComponent
              page={page}
              limit={limit}
              setLimit={setLimit}
              setPage={setPage}
              hasNextPage={paginationInfo.hasNextPage}
              hasPrevPage={paginationInfo.hasPrevPage}
              totalDocs={paginationInfo.totalDocs}
              totalPages={paginationInfo.totalPages}
              isFetching={isFetching}
            />
          </div>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default SubscribersDialog
