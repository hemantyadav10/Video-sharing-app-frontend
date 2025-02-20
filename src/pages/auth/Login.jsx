import { EyeNoneIcon, EyeOpenIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { Button, Callout, IconButton, Spinner, Text, TextField } from '@radix-ui/themes';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { useAuth } from '../../context/authContext';
import Logo from '../../components/Logo';
import { SITE_NAME } from '../../constants';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [showPassword, setShowPassword] = useState(false)
  const { login, user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')


  const handleLogin = async (data) => {
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const isEmail = emailPattern.test(data.username)
    let formData = isEmail ?
      {
        email: data.username,
        password: data.password
      } : data;
    setError('')
    try {
      setError('')
      await login(formData)
      navigate(-1)
      toast('Logged in successfully')
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 404) {
        setError('Invalid credentials. Please check your username or password.')
      }
    }
  }


  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-screen p-4 ">
        <span className='mr-auto'>
          <Logo />
        </span>
        <p className="mt-32 mb-4 text-3xl font-semibold text-center capitalize">Sign in to your account</p>
        <div className="relative w-full max-w-sm p-6  bg-[--color-panel-solid]  shadow-md rounded-xl ">
          <div className='absolute top-0 left-6 right-6 '>
            <BarLoader
              color='#70b8ff'
              width={'100%'}
              height={'2px'}
              loading={isLoading}
            />
          </div>
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="flex flex-col gap-4"
          >
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
                Username or email address <Text as='span' color='red' weight={'medium'}>*</Text>
              </Text>
              <TextField.Root
                autoFocus
                color={errors.username ? 'red' : 'blue'}
                {...register('username', {
                  required: 'Username or Email is required'
                })}
                size={'3'}
                placeholder="Username or email"
                className={`${errors.username && 'shadow-inset-custom'}`}
              />
              {errors.username &&
                <Text as='p' size={'1'} mt={'2'} color='red' className='flex items-center gap-1 '>
                  <InfoCircledIcon height={"16"} width={"16"} />{errors.username.message}
                </Text>
              }
            </label>
            <label>
              <div className='flex items-center justify-between'>
                <Text as="span" size="2" mb="2" weight={'medium'}>
                  Password <Text as='span' color='red' weight={'medium'}>*</Text>
                </Text>
                <Text as='span' color='blue' size={'1'} align={'right'} weight={'medium'} className='ml-auto cursor-pointer hover:underline'>
                  Forgot password?
                </Text>
              </div>
              <TextField.Root
                type={showPassword ? 'text' : 'password'}
                color={errors.password ? 'red' : 'blue'}
                {...register('password', {
                  required: 'Password is required'
                })}
                size={'3'}
                placeholder="Password"
                className={`${errors.username && 'shadow-inset-custom'}`}
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

            <Button
              disabled={isLoading}
              type='submit'
              size={'3'}
              highContrast
              className='text-sm font-bold '
              radius='full'
            >
              <Spinner loading={isLoading} />
              {isLoading ? " Loading..." : "SIGN IN"}
            </Button>
          </form>
        </div>
        <Text
          size={'2'}
          mt={'4'}
        >
          Don't have an account?
          <Link
            className='ml-1 text-sm hover:opacity-80 active:opacity-100'
            to={'/signup'}
          >
            <Text as='span' color='blue' weight={'medium'} className='hover:underline'>
              Create an account
            </Text>
          </Link>
        </Text>
        <div className='flex flex-col items-center w-full mt-auto sm:flex-row sm:justify-between'>
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

export default Login;
