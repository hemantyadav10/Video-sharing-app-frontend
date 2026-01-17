import { Button } from "@radix-ui/themes";
import { BellRing } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { useToggleSubscription } from "../lib/queries/subscriptionQueries";

function SubscriptionButton({ subscribed = false, userId, className = "" }) {
  const { user, isAuthenticated } = useAuth();
  const { mutate: toggleSubscription, isPending } = useToggleSubscription(
    userId,
    user?._id,
  );

  const handleSubscription = async () => {
    if (isAuthenticated) {
      toggleSubscription(userId, {
        onSuccess: () => {
          if (subscribed) return toast.success("Subscription removed");
          return toast.success("Subscription added");
        },
        onError: (error) => {
          const errorMessage =
            error?.response?.data?.message ||
            "Something went wrong. Please try again later";
          toast.error(errorMessage);
        },
      });
    } else {
      toast("Login to subscribe");
    }
  };

  return (
    <Button
      onClick={handleSubscription}
      variant={subscribed && "soft"}
      color={subscribed ? "gray" : "blue"}
      highContrast
      radius="full"
      className={className}
      disabled={isPending}
    >
      {subscribed ? (
        <>
          <BellRing size={18} />{" "}
          {isPending ? " Unsubscribing..." : "Subscribed"}
        </>
      ) : isPending ? (
        "Subscribing..."
      ) : (
        "Subscribe"
      )}
    </Button>
  );
}

export default SubscriptionButton;
