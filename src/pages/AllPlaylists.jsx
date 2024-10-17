import React from 'react'
import PlaylistCard from '../components/PlaylistCard'

function AllPlaylists() {
  return (
    <div className='w-full p-6 '>
      <h1 className='text-3xl font-semibold'>Playlists</h1>
      <div className='flex flex-col py-6 gap-y-8 gap-x-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {Array.from({ length: 10 }).fill(1).map((_, i) => (
          <PlaylistCard key={i} />
        ))}
      </div>
    </div>
  )
}

export default AllPlaylists
