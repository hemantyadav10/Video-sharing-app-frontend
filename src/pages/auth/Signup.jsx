import { Cross1Icon, EyeNoneIcon, EyeOpenIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { Button, Callout, IconButton, Spinner, Text, TextField } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import noThumbnail from '../../assets/noThumbnail.webp';
import placeholderProfile from '../../assets/profileImage.jpg';
import Logo from '../../components/Logo';
import { MAX_IMAGE_SIZE, SITE_NAME } from '../../constants';
import { useAuth } from '../../context/authContext';
import { useTheme } from 'next-themes';

function Signup() {
  const { register, handleSubmit, formState: { errors }, watch, resetField } = useForm({
    mode: "onChange"
  })
  const [showPassword, setShowPassword] = useState(false)
  const { register: registerUser, isLoading } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const coverImage = watch("coverImage");
  const coverImgUrl = coverImage?.[0] ? URL.createObjectURL(coverImage[0]) : null
  const avatar = watch("avatar");
  console.log(avatar?.[0])
  const profileImgUrl = avatar?.[0] ? URL.createObjectURL(avatar[0]) : null;
  const { theme } = useTheme()


  const handleCreateAccount = async (data) => {
    const formData = new FormData()
    formData.append("fullName", data.fullName)
    formData.append("username", data.username)
    formData.append("email", data.email)
    formData.append("password", data.password)
    formData.append("avatar", data.avatar?.[0])
    if (data.coverImage?.[0]) {
      formData.append("coverImage", data.coverImage[0])
    }

    try {
      setError('')
      await registerUser(formData)
      navigate('/login')
      toast('Account created successfully')
    } catch (error) {
      console.log(error)
      setError(error.response.data.message)
      console.log(error.response.data.message)
    }
  }

  useEffect(() => {
    return () => {
      if (coverImgUrl) URL.revokeObjectURL(coverImgUrl);
      if (profileImgUrl) URL.revokeObjectURL(profileImgUrl);
    };
  }, [coverImgUrl, profileImgUrl]);


  return (
    <>

      <div className="flex flex-col items-center justify-center w-full min-h-screen p-4">
        <span className='mr-auto'>
          <Logo />
        </span>
        <p className="mt-12 mb-4 text-3xl font-semibold text-center capitalize">
          Create Your Account
        </p>
        <form
          onSubmit={handleSubmit(handleCreateAccount)}
          className="relative w-full max-w-5xl md:p-6  md:bg-[#d8f4f609] md:shadow-lg rounded-xl flex gap-6 flex-col-reverse md:flex-row pt-6 "
        >
          <div className='absolute top-0 mb-6 -left-4 -right-4 md:left-6 md:right-6 '>
            <BarLoader
              color='#70b8ff'
              width={'100%'}
              height={'2px'}
              loading={isLoading}
            />
          </div>
          <div className='flex flex-col justify-between flex-1 gap-4 '>

            <label
              htmlFor='cover_image'
              className=''
            >
              <Text as="div" size="2" mb="2" weight={'medium'}>
                Banner Image
              </Text>
              <div className={`h-32 border hover:cursor-pointer ${errors.coverImage ? "border-[#b54548]" : "border-[--gray-a6]"} rounded-lg relative hover:brightness-90 transition-all`}>
                <input
                  {...register("coverImage", {
                    validate: {
                      acceptedFormats: files => {
                        if (files.length === 0) return true
                        return ['image/jpeg', 'image/png', 'image/webp'].includes(
                          files[0]?.type
                        ) || 'Only JPEG, PNG, and WEBP formats are supported.'
                      },
                      maxThumbnailSize: files => {
                        if (files.length === 0) return true
                        return files[0]?.size < MAX_IMAGE_SIZE * 1024 * 1024 || `The image size must not exceed ${MAX_IMAGE_SIZE}MB.`
                      },
                    }
                  })}
                  id='cover_image'
                  type="file"
                  hidden
                  accept=".jpg, .jpeg, .png, .webp"
                />
                {
                  coverImgUrl ? (
                    <img
                      src={coverImgUrl}
                      alt=""
                      className="object-cover object-center w-full h-full rounded-lg "
                    />
                  ) : (
                    <img
                      src={noThumbnail}
                      alt=""
                      className={`${theme === "dark" ? "brightness-[.06] md:brightness-[0.09]" : ""} object-cover object-center w-full h-full rounded-lg filter grayscale`}
                    />
                  )
                }
                {
                  coverImgUrl &&
                  <IconButton
                    type='button'
                    radius='full'
                    size={'1'}
                    variant='surface'
                    color='gray'
                    highContrast
                    onClick={(e) => {
                      e.preventDefault()
                      resetField("coverImage")
                    }}
                    className='absolute top-0 right-0 z-20 translate-x-1/2 -translate-y-1/2'
                  >
                    <Cross1Icon />
                  </IconButton>
                }
              </div>


              <Text as='p' size={'1'} color='gray' mt={'1'}>
                This image will appear across the top of your channel.
              </Text>
              {errors.coverImage &&
                <Text as='p' size={'1'} mt={'2'} color='red' className='flex items-center gap-1 '>
                  <InfoCircledIcon height={"16"} width={"16"} />{errors.coverImage.message}
                </Text>
              }

            </label>
            <label>
              <Text as="div" size="2" mb="2" weight={'medium'}>
                Avatar <Text as='span' color='red' weight={'medium'}>*</Text>
              </Text>
              <div className={`flex justify-center p-2 border ${errors.avatar ? "border-[#b54548]" : "border-[--gray-a6]"} rounded-lg bg-[--color-surface]`}>
                <div className='rounded-full size-32 border border-[--gray-a6] hover:brightness-90 hover:cursor-pointer transition-all'>
                  <input
                    {...register("avatar", {
                      required: "Avatar is required",
                      validate: {
                        acceptedFormats: files =>
                          ['image/jpeg', 'image/png', 'image/webp'].includes(
                            files[0]?.type
                          ) || '"Only JPEG, PNG, and WEBP formats are supported.',
                        maxThumbnailSize: files => files[0]?.size < MAX_IMAGE_SIZE * 1024 * 1024 || `The image size must not exceed ${MAX_IMAGE_SIZE}MB.`,
                      }
                    })}
                    id='profile_image'
                    type="file"
                    hidden
                    accept=".jpg, .jpeg, .png, .webp"
                  />
                  {
                    profileImgUrl
                      ? <img
                        src={profileImgUrl}
                        alt="profile image"
                        className={`object-cover object-center w-full h-full rounded-full`}
                      />
                      : <img
                        src={placeholderProfile}
                        alt="profile image"
                        className={`${theme === 'dark' ? "brightness-[.20]" : "brightness-150"} object-cover object-center w-full h-full rounded-full filter grayscale `}
                      />
                  }

                </div>
              </div>
              <Text as='p' size={'1'} color='gray' mt={'1'}>
                Your profile picture will appear where your channel is presented.
              </Text>
              {errors.avatar &&
                <Text as='p' size={'1'} mt={'2'} color='red' className='flex items-center gap-1 '>
                  <InfoCircledIcon height={"16"} width={"16"} />{errors.avatar.message}
                </Text>
              }
            </label>
            <div>
              <Button
                disabled={isLoading}
                type='submit'
                size={'3'}
                highContrast
                className='w-full text-sm font-bold'
                radius='full'
              >
                <Spinner loading={isLoading} />
                {isLoading ? " Loading..." : "CREATE ACCOUNT"}
              </Button>
            </div>

          </div>
          <div className="flex flex-col flex-1 gap-4 md:max-w-sm" >
            {error && <Callout.Root variant='surface' color="red">
              <Callout.Icon>
                <InfoCircledIcon />
              </Callout.Icon>
              <Callout.Text>
                {error}
              </Callout.Text>
            </Callout.Root>}
            <label>
              <Text as="div" size="2" mb="2" weight={'medium'}>
                Name <Text as='span' color='red' weight={'medium'}>*</Text>
              </Text>
              <TextField.Root
                autoFocus
                color={errors.fullName ? 'red' : 'blue'}
                {...register('fullName', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Full name must be atleast 2 character(s).'
                  }
                })}
                size={'3'}
                placeholder="Full name"
                className={`${errors.fullName && 'shadow-inset-custom'}`}
              />
              <Text as='p' size={'1'} color='gray' mt={'1'}>
                Choose a channel name that represents you and your content.
              </Text>
              {errors.fullName &&
                <Text as='p' size={'1'} mt={'2'} color='red' className='flex items-center gap-1 '>
                  <InfoCircledIcon height={"16"} width={"16"} />{errors.fullName.message}
                </Text>
              }
            </label>
            <label>
              <Text as="div" size="2" mb="2" weight={'medium'}>
                Username <Text as='span' color='red' weight={'medium'}>*</Text>
              </Text>
              <TextField.Root
                color={errors.username ? 'red' : 'blue'}
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 2,
                    message: 'Username must be atleast 2 character(s).'
                  }
                })}
                size={'3'}
                placeholder="Username"
                className={`${errors.username && 'shadow-inset-custom'}`}
              />
              <Text as='p' size={'1'} color='gray' mt={'1'}>
                Choose your unique handle by adding letters and numbers.
              </Text>
              {errors.username &&
                <Text as='p' size={'1'} mt={'2'} color='red' className='flex items-center gap-1 '>
                  <InfoCircledIcon height={"16"} width={"16"} />{errors.username.message}
                </Text>
              }
            </label>
            <label>
              <Text as="div" size="2" mb="2" weight={'medium'}>
                Email <Text as='span' color='red' weight={'medium'}>*</Text>
              </Text>
              <TextField.Root
                color={errors.email ? 'red' : 'blue'}
                {...register('email', {
                  required: 'Email is required.',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Invalid Email.',
                  }
                })}
                size={'3'}
                placeholder="Email"
                className={`${errors.email && 'shadow-inset-custom'}`}
              />
              {errors.email &&
                <Text as='p' size={'1'} mt={'2'} color='red' className='flex items-center gap-1 '>
                  <InfoCircledIcon height={"16"} width={"16"} />{errors.email.message}
                </Text>
              }
            </label>
            <label>
              <Text as="div" size="2" mb="2" weight={'medium'}>
                Password <Text as='span' color='red' weight={'medium'}>*</Text>
              </Text>
              <TextField.Root
                type={showPassword ? 'text' : 'password'}
                color={errors.password ? 'red' : 'blue'}
                {...register('password', {
                  required: 'Password is required.',
                  minLength: {
                    value: 8,
                    message: 'Password must be atleast 8 character(s).'
                  },
                })}
                size={'3'}
                placeholder="Password"
                className={`${errors.password && 'shadow-inset-custom'}`}
              >
                <TextField.Slot side='right'>
                  <IconButton
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    variant='ghost'
                    highContrast
                    radius='full'
                  >
                    {showPassword
                      ? < EyeNoneIcon height="16" width="16" />
                      : < EyeOpenIcon height="16" width="16" />
                    }

                  </IconButton>
                </TextField.Slot>
              </TextField.Root>
              {errors.password &&
                <Text as='p' size={'1'} mt={'2'} color='red' className='flex items-center gap-1 '>
                  <InfoCircledIcon height={"16"} width={"16"} />{errors.password.message}
                </Text>
              }
            </label>
          </div>
        </form>
        <Text
          size={'2'}
          mt={'4'}
        >
          Already have an account?
          <Link
            className='ml-1 text-sm hover:opacity-80 active:opacity-100'
            to={'/login'}
          >
            <Text as='span' color='blue' weight={'medium'} className='hover:underline'>
              Sign In
            </Text>
          </Link>
        </Text>
        <div className='flex flex-col items-center w-full mt-12 sm:flex-row sm:justify-between'>
          <Text as='span' color='gray' size={'2'} className='min-w-min'>
            © 2025 {SITE_NAME}. All rights reserved.
          </Text>
          <div className='flex gap-2'>
            <Link to={'/privacy'} >
              <Text color='gray' size={'2'} className='hover:underline'>
                Privacy
              </Text>
            </Link>
            <Link to={'/help'} >
              <Text color='gray' size={'2'} className='hover:underline'>
                Help
              </Text>
            </Link>
            <Link to={'/terms-of-services'} >
              <Text color='gray' size={'2'} className='hover:underline'>
                Terms
              </Text>
            </Link>
          </div>
        </div>
      </div>
    </>
  );

}

export default Signup



