import { EyeNoneIcon, EyeOpenIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { Button, Callout, IconButton, Text, TextField } from '@radix-ui/themes';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [showPassword, setShowPassword] = useState(true)
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
      await login(formData)
      setError('')
    } catch (error) {
      if (error.response.status === 401) {
        setError('Invalid credentials. Please check your username or password.')
        console.log('Invalid credentials')
      } else if (error.response.status === 404) {
        setError('User not found with the provided username or email')
        console.log('User does not exist')
      }
    }
  }


  return (
    <div className="flex items-center justify-center w-full h-screen ">
      <div className="w-full max-w-sm p-6">
        <h2 className="mb-4 text-2xl font-medium text-center capitalize">Sign in to your account</h2>
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="flex flex-col gap-4"
        >
          <Text
            mb={'2'}
            className='flex items-baseline justify-center gap-1 '
            size={'2'}
          >
            Don't have an account?
            <Link
              className='text-xs font-medium hover:opacity-80 active:opacity-100'
              to={'/signup'}
            >
              <Text as='span' color='blue'>
                SIGN UP
              </Text>
            </Link>
          </Text>
          {error && <Callout.Root variant='surface' color="red">
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>
              {error}
            </Callout.Text>
          </Callout.Root>}
          <label>
            <Text as="div" size="2" mb="2" >
              Username/Email*
            </Text>
            <TextField.Root
              color={errors.username ? 'red' : 'blue'}
              {...register('username', {
                required: 'Username or Email is required'
              })}
              size={'3'}
              placeholder="Enter username or email"
            />
            {errors.username &&
              <Text as='p' size={'1'} mt={'2'} color='red' className='flex items-center gap-1 '>
                <InfoCircledIcon height={"16"} width={"16"} />{errors.username.message}
              </Text>
            }
          </label>
          <label>
            <Text as="div" size="2" mb="2">
              Password*
            </Text>
            <TextField.Root
              type={showPassword ? 'text' : 'password'}
              color={errors.password ? 'red' : 'blue'}
              {...register('password', {
                required: 'Password is required'
              })}
              size={'3'}
              placeholder="Enter your password"
            >
              <TextField.Slot side='right'>
                <IconButton
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  variant='ghost'
                  highContrast
                  radius='full'
                >
                  {showPassword ?
                    < EyeOpenIcon height="16" width="16" /> :
                    < EyeNoneIcon height="16" width="16" />
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
            loading={isLoading}
            type='submit'
            size={'3'}
            highContrast
            className='text-sm font-bold'
            color='blue'
          >
            SIGN IN
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
