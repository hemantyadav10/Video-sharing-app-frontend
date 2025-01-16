import { InfoCircledIcon, ReloadIcon } from '@radix-ui/react-icons';
import { Button, Callout, Text } from '@radix-ui/themes';
import React from 'react';


const QueryErrorHandler = ({ error, onRetry, className = '', }) => {

  let errorMessage = 'An unexpected error occurred. Please try again later.';

  if (error?.response) {
    errorMessage = error.response.data?.message || error.response.statusText || errorMessage;
  } else if (error?.message) {
    errorMessage = error.message;
  }


  return (
    <div className={`flex flex-col items-center mx-auto mt-6 ${className}`}>
      <Callout.Root
        color="red"
        variant='surface'
        highContrast
        className='rounded-xl'
      >
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text >
          <Text weight={'medium'}>Error:</Text> {errorMessage}
        </Callout.Text>
      </Callout.Root>
      <Button
        onClick={() => {
          onRetry()
        }}
        radius='full'
        mt={'4'}
        color='blue'
        highContrast
      >
        <ReloadIcon />
        Retry
      </Button>
    </div>
  );
};

export default QueryErrorHandler;
