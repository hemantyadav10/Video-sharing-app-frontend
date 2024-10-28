import React, { useEffect, useState } from 'react'
import { useToggleSubscription } from '../lib/queries/subscriptionQueries';
import { useAuth } from '../context/authContext';
import toast from 'react-hot-toast';
import { Button, Skeleton } from '@radix-ui/themes';

function SubscriptionButton({
  subscribed,
  userId,
  loading
}) {
  const { user, isAuthenticated } = useAuth()
  const { mutate: toggleSubscription } = useToggleSubscription(userId, user?._id)
  const [isSubscribed, setIsSubscribed] = useState(subscribed || false);


  const handleSubscription = async () => {
    if (isAuthenticated) {
      setIsSubscribed(!isSubscribed)
      toggleSubscription(userId, {
        onSuccess: () => {
          if (subscribed) return toast.success('Subscription removed')
          return toast.success('Subscription added')
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
      >
        {isSubscribed ? 'Subscribed' : 'Subscribe'}
      </Button>
    </Skeleton>
  )
}

export default SubscriptionButton
