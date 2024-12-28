import { Pencil1Icon } from '@radix-ui/react-icons';
import { Button, Heading, IconButton, Text } from '@radix-ui/themes';
import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import CameraIcon from '../../assets/CameraIcon';
import UpdatePictureDialog from '../../components/UpdatePictureDialog';
import { useAuth } from '../../context/authContext';

function Settings() {
  const location = useLocation();
  const isVideosActive = location.pathname === '/settings' || location.pathname === '/settings/personalInfo';
  const { user } = useAuth()
  const navigate = useNavigate()

  const [openDialog, setOpenDialog] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatar, setAvatar] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')

  const clearImages = () => {
    setAvatarUrl('')
    setCoverImageUrl('')
    setAvatar('')
    setCoverImage('')
  }


  return (
    <div className='flex flex-col flex-1'>
      <UpdatePictureDialog
        type={avatarUrl ? 'avatar' : 'coverImage'}
        image={avatarUrl || coverImageUrl}
        imageFile={avatar || coverImage}
        open={openDialog}
        setOpenDialog={setOpenDialog}
        title={avatarUrl ? 'Update profile picture' : coverImageUrl && 'Update cover image'}
        clearImages={clearImages}
      />

      {/* cover image and profile image */}
      <label htmlFor='cover_picture' className='relative'>
        <input
          type="file"
          id="cover_picture"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0]
            console.log(file)
            const url = URL.createObjectURL(file)
            setCoverImage(file)
            setCoverImageUrl(url)
            setOpenDialog(true)
            e.target.value = null
          }}
          accept=".jpg, .jpeg, .png, .webp"
        />
        <img
          src={user?.coverImage}
          // src="https://storage.googleapis.com/support-kms-prod/Ch5HG5RGzGnfHhvVSD93gdoEvWm5IPGUkOnS"
          alt="A house in a forest"
          className='object-cover object-center w-full h-32 cursor-pointer sm:h-40 md:h-48 lg:h-52'
        />
        <span className='absolute flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full pointer-events-none bottom-2 right-2 bg-black/70'><CameraIcon /> Edit</span>

        {/* profile image */}
        <label
          htmlFor='profile_picture'
          className='absolute bottom-0 translate-y-1/2 rounded-full shadow-md cursor-pointer size-24 left-4 shadow-black/50 md:size-36 md:translate-y-3/4 xl:left-20 lg:left-10 group'>
          <input
            type="file"
            hidden
            id='profile_picture'
            onChange={(e) => {
              const file = e.target.files?.[0]
              console.log(file)
              const url = URL.createObjectURL(file)
              setAvatarUrl(url)
              setAvatar(file)
              setOpenDialog(true)
              e.target.value = null
            }}
            accept=".jpg, .jpeg, .png, .webp"
          />
          <img
            src={user?.avatar}
            alt="Profile"
            className='object-cover w-full rounded-full aspect-square object-square '
          />
          <span className='absolute inset-0 flex items-center justify-center transition-opacity duration-200 rounded-full opacity-0 group-hover:opacity-100 bg-black/40'>
            <CameraIcon />
          </span>
          <IconButton
            highContrast
            radius='full'
            size={'2'}
            className='absolute bottom-0 right-0'
          >
            <Pencil1Icon height={'16'} width={'16'} />
          </IconButton>
        </label>
      </label>

      {/* user information */}
      <div className='flex flex-wrap justify-between gap-0 px-4 pt-16 md:py-8 md:ml-40 xl:px-20 lg:px-10'>
        <div>
          <Heading as='h3' className='capitalize '>
            {user?.fullName}
          </Heading>
          <Text as='p' size={'2'} className='pb-5' color='gray'>
            @{user?.username}
          </Text>
        </div>
        <Button
          onClick={() => navigate(`/channel/${user?._id}`)}
          variant='soft'
          highContrast
          className='my-4 md:my-0'
          radius='full'
        >
          View Channel
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className=' grid grid-cols-2 sm:flex px-4 text-sm border-b border-[#484848] font-medium mt-2 border-t border-t-[#111113] xl:px-20 sticky top-[63px] z-30 bg-[#111113] lg:px-10 gap-x-1'>
        <NavLink
          to='/settings/personalInfo'
          className={() => `tabNav ${isVideosActive ? "tabNav_active" : "tabNav_inactive"} px-6`}
        >
          Personal Information
        </NavLink>
        <NavLink
          to={'/settings/change-password'}
          className={({ isActive }) => `tabNav ${isActive ? "tabNav_active" : "tabNav_inactive"} px-6`}
        >
          Change Password
        </NavLink>
      </div>
      <div className='flex-1 px-4 py-6 mb-16 lg:px-10 xl:px-20'>
        <Outlet />
      </div>
    </div>
  )

}

export default Settings
