import React, { useEffect, useState } from 'react'
import { useToggleSubscription } from '../lib/queries/subscriptionQueries';
import { useAuth } from '../context/authContext';
import toast from 'react-hot-toast';
import { Button, Skeleton } from '@radix-ui/themes';
import { BellIcon } from '@radix-ui/react-icons';

function SubscriptionButton({
  subscribed,
  userId,
  loading = false,
  className = ''
}) {
  const { user, isAuthenticated } = useAuth()
  const { mutate: toggleSubscription, isPending } = useToggleSubscription(userId, user?._id)
  const [isSubscribed, setIsSubscribed] = useState(subscribed || false);


  const handleSubscription = async () => {
    if (isAuthenticated) {

      // Optimistically update the subscription state
      setIsSubscribed((prev) => !prev);

      toggleSubscription(userId, {
        onSuccess: () => {
          if (subscribed) return toast.success('Subscription removed')
          return toast.success('Subscription added')
        },
        onError: () => {
          // Revert the optimistic update in case of an error
          setIsSubscribed((prev) => !prev);
          toast.error('Something went wrong. Please try again.');
        }
      })
    }
    else {
      toast('Login to subscribe')
    }
  }

  useEffect(() => {
    if (subscribed !== undefined) {
      setIsSubscribed(subscribed);
    }
  }, [subscribed]);


  return (
    <Skeleton loading={loading}>
      <Button
        onClick={handleSubscription}
        variant={isSubscribed && 'soft'}
        color='blur'
        highContrast
        radius='full'
        style={{
          transition: 'width 0.3s ease', // Smooth transition for width changes
        }}
        className={className}
        disabled={isPending}
      >
        {
          isSubscribed ?
            <>
              <BellIcon height={'18'} width={'18'} /> Subscribed
            </> :
            'Subscribe'
        }
      </Button>
    </Skeleton>
  )
}

export default SubscriptionButton
