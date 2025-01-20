import { BellIcon } from '@radix-ui/react-icons';
import { Button } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/authContext';
import { useToggleSubscription } from '../lib/queries/subscriptionQueries';
import { BellRing } from 'lucide-react';

function SubscriptionButton({
  subscribed = false,
  userId,
  className = ''
}) {
  const { user, isAuthenticated } = useAuth()
  const { mutate: toggleSubscription, isPending, } = useToggleSubscription(userId, user?._id)

  const handleSubscription = async () => {
    if (isAuthenticated) {
      toggleSubscription(userId, {
        onSuccess: () => {
          if (subscribed) return toast.success('Subscription removed')
          return toast.success('Subscription added')
        },
        onError: (error) => {
          const errorMessage = error?.response?.data?.message || 'Something went wrong. Please try again later';
          toast.error(errorMessage);
        },
      })
    }
    else {
      toast('Login to subscribe')
    }
  }

  return (
    <Button
      onClick={handleSubscription}
      variant={subscribed && "soft"}
      color={subscribed ? "gray" : "blue"}
      highContrast
      radius='full'
      style={{
        transition: 'width 0.3s ease', // Smooth transition for width changes
      }}
      className={className}
      disabled={isPending}
    >
      {
        subscribed ?
          <>
            <BellRing size={18} /> {isPending ? " Unsubscribing..." : "Subscribed"}
          </> :
          isPending ? "Subscribing..." : "Subscribe"
      }
    </Button>
  )
}

export default SubscriptionButton
