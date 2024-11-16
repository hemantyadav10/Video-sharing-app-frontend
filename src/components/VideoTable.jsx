import React from 'react'
import { toIndianDateFormat } from '../utils/utils'
import { AlertDialog, Badge, Button, Flex, IconButton, Skeleton, Switch, Table, Text, Tooltip } from '@radix-ui/themes'
import { Link } from 'react-router-dom'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'

function VideoTable({
  videos,
  publishedVideos,
  onTogglePublish,
  loadingVideos
}) {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Skeleton loading={loadingVideos}>
          <Table.Row >
            <Table.Cell minWidth={'100px'}>
              <Text color='gray' size={'1'}>
                Toggle status
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text color='gray' size={'1'}>
                Status
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text color='gray' size={'1'}>
                Video
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text color='gray' size={'1'}>
                Views
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text color='gray' size={'1'}>
                Likes
              </Text>
            </Table.Cell>
            <Table.Cell >
              <Text color='gray' size={'1'}>
                Date
              </Text>
            </Table.Cell>
            <Table.Cell>
              <Text color='gray' size={'1'}>
                Edit/Delete
              </Text>
            </Table.Cell>
          </Table.Row>
        </Skeleton>
      </Table.Header>
      <Table.Body >
        {loadingVideos || !publishedVideos ?
          Array.from({ length: 3 }).map(() =>
            <Table.Row className='h-12 bg-[#111113]'>
              <Table.Cell >
                <Skeleton>
                  <Switch />
                </Skeleton>
              </Table.Cell>
              <Table.Cell>
                <Skeleton className='w-24 h-6'>
                  <Badge
                    size={'2'}
                    radius='full'
                  >
                  </Badge>
                </Skeleton>
              </Table.Cell>
              <Table.Cell>
                <Skeleton maxWidth={'460px'} width={'460px'} minWidth={'200px'} height={'16px'}>
                </Skeleton>
              </Table.Cell>
              <Table.Cell>
                <Skeleton width={'48px'} height={'16px'}>
                </Skeleton>
              </Table.Cell>
              <Table.Cell>
                <Skeleton width={'48px'} height={'16px'}>
                </Skeleton>
              </Table.Cell>
              <Table.Cell >
                <Skeleton width={'100px'} height={'16px'}>
                </Skeleton>
              </Table.Cell>
              <Table.Cell>
                <Flex>
                  <Skeleton width={'20px'} height={'20px'} className='mr-2 rounded-full'>
                  </Skeleton>
                  <Skeleton width={'20px'} height={'20px'} className='rounded-full'>
                  </Skeleton>
                </Flex>
              </Table.Cell>
            </Table.Row>) :
          (videos?.data.map((video) => (

            <Table.Row key={video._id} className='bg-[#111113] hover:bg-[#0c0c0d] transition-all'>
              <Table.Cell>
                <Switch
                  variant='surface'
                  color='sky'
                  checked={publishedVideos?.includes(video._id)}
                  onCheckedChange={(checked) => onTogglePublish(video._id, checked)}
                />
              </Table.Cell>
              <Table.Cell minWidth={'110px'}>
                <Badge
                  color={publishedVideos?.includes(video._id) ? 'green' : 'orange'}
                  size={'2'}
                  radius='full'
                  variant='surface'
                  className='font-normal'
                >
                  {publishedVideos?.includes(video._id) ? 'Published' : 'Unpublished'}
                </Badge>
              </Table.Cell>
              <Table.Cell
                title={video.title}
                minWidth={'268px'}
                maxWidth={'620px'}
                width={'620px'}
              >
                <Link
                  to={`/watch/${video._id}`}
                  className='hover:underline hover:text-[#4493f8]'>
                  <Text as='p'>
                    {video.title}
                  </Text>
                  {/* <Text as='p' size={'1'} className='line-clamp-1' color='gray'>
                        {video.description}
                      </Text> */}
                </Link>
              </Table.Cell>
              <Table.Cell>
                {video.views}
              </Table.Cell>
              <Table.Cell>
                {video.likes}
              </Table.Cell>
              <Table.Cell minWidth={'108px'}>
                {toIndianDateFormat(video.createdAt)}
              </Table.Cell>
              <Table.Cell >
                <AlertDialog.Root>
                  <Tooltip content='Delete video' side='bottom'>
                    <AlertDialog.Trigger>
                      <IconButton variant='ghost' color='gray' highContrast radius='full' mr={'2'}>
                        <TrashIcon height={'20px'} width={'20'} />
                      </IconButton>
                    </AlertDialog.Trigger>
                  </Tooltip>
                  <AlertDialog.Content maxWidth="450px">
                    <AlertDialog.Title>Delete video</AlertDialog.Title>
                    <AlertDialog.Description size="2">
                      Are you sure you want to delete this video ?
                      Once its deleted, you will not be able to recover it.
                    </AlertDialog.Description>
                    <Flex gap="3" mt="4" justify="end">
                      <AlertDialog.Cancel>
                        <Button variant="soft" highContrast color="gray" radius='full'>
                          Cancel
                        </Button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action>
                        <Button highContrast radius='full'>
                          Delete
                        </Button>
                      </AlertDialog.Action>
                    </Flex>
                  </AlertDialog.Content>
                </AlertDialog.Root>
                <Tooltip content='Edit video' side='bottom'>
                  <IconButton variant='ghost' color='gray' highContrast radius='full'>
                    <Pencil1Icon height={'20px'} width={'20'} />
                  </IconButton>
                </Tooltip>
              </Table.Cell>
            </Table.Row>
          )))
        }
      </Table.Body>
    </Table.Root>
  )
}

export default VideoTable
