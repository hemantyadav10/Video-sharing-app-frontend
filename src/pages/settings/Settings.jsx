import { Button, Heading, IconButton, Text } from '@radix-ui/themes';
import { Camera } from 'lucide-react';
import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import placeholder from '../../assets/bannerPlaceholder.webp';
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
          src={user?.coverImage || placeholder}
          // src="https://storage.googleapis.com/support-kms-prod/Ch5HG5RGzGnfHhvVSD93gdoEvWm5IPGUkOnS"
          alt="A house in a forest"
          className='object-cover object-center w-full h-32 cursor-pointer sm:h-40 md:h-48 lg:h-52'
        />
        <span className='absolute flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-full pointer-events-none bottom-2 right-2 bg-black/70'><Camera size={20} /> Edit</span>

      </label>

      {/* user information */}
      <div className='flex flex-wrap justify-between w-full gap-0 px-4 pt-16 mx-auto md:py-8 xl:px-20 lg:px-10 max-w-screen-2xl'>
        <div className='flex items-start gap-4'>
          {/* profile image */}
          <label
            htmlFor='profile_picture'
            className='relative rounded-full shadow-md cursor-pointer size-24 shadow-black/50 md:size-36 group'>
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
            <span className='absolute inset-0 flex items-center justify-center text-white transition-opacity duration-200 rounded-full opacity-0 group-hover:opacity-100 bg-black/40'>
              <Camera size={20} />
            </span>
            <IconButton
              radius='full'
              highContrast
              size={'2'}
              className='absolute bottom-0 right-0'
            >
              <Camera size={20} />
            </IconButton>
          </label>

          <div>
            <Heading as='h3' className='capitalize '>
              {user?.fullName}
            </Heading>
            <Text as='p' size={'2'} className='pb-5' color='gray'>
              @{user?.username}
            </Text>
          </div>
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
      <div className='border-t border-t-[--color-background] border-b border-[--gray-a6] mt-2 sticky top-[63px] z-30 bg-[--color-background]'>
        <div className='grid w-full grid-cols-2 px-4 mx-auto text-sm font-medium max-w-screen-2xl sm:flex xl:px-20 lg:px-10 gap-x-1'>
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
      </div>
      <div className='flex-1 w-full px-4 py-6 mx-auto mb-16 max-w-screen-2xl lg:px-10 xl:px-20'>
        <Outlet />
      </div>
    </div>
  )

}

export default Settings
