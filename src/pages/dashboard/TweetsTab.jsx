import {
  DotsHorizontalIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  Button,
  Dialog,
  DropdownMenu,
  Flex,
  IconButton,
  Skeleton,
  Table,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { formatDate, formatDistanceToNow } from "date-fns";
import { ThumbsUpIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import no_tweet from "../../assets/no_tweet.svg";
import CloseButton from "../../components/CloseButton";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import QueryErrorHandler from "../../components/QueryErrorHandler";
import { useAuth } from "../../context/authContext";
import { useAutoResize } from "../../hooks/useAutoResize";
import {
  useDeleteTweet,
  useFetchUserTweets,
  useUpdateTweet,
} from "../../lib/queries/tweetQueries";

function TweetsTab() {
  const { user } = useAuth();
  const {
    data: userTweets,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchUserTweets(user?._id, user?._id);

  return (
    <div>
      {isLoading ? (
        <SkeletonLoader />
      ) : isError ? (
        <QueryErrorHandler error={error} onRetry={refetch} className="mt-0" />
      ) : userTweets?.data.length === 0 ? (
        <NoContent />
      ) : (
        <Table.Root>
          <TableHeader />
          <Table.Body>
            {userTweets?.data.map((tweet) => (
              <Table.Row
                key={tweet._id}
                className="bg-[--color-background] transition-all even:bg-[--gray-2] hover:bg-[--color-surface]"
              >
                <Table.RowHeaderCell className="min-w-[320px] max-w-[320px]">
                  <TweetContentDialog tweet={tweet}>
                    <Text
                      as="p"
                      className="break-words whitespace-pre-wrap line-clamp-3 "
                    >
                      {tweet.content}
                    </Text>
                  </TweetContentDialog>
                </Table.RowHeaderCell>
                <Table.Cell className="text-nowrap">
                  {tweet?.createdAt &&
                    formatDate(tweet.createdAt, "dd MMM yyyy")}
                </Table.Cell>
                <Table.Cell>{tweet.likesCount}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </div>
  );
}

export default TweetsTab;

export function TweetContentDialog({ children, tweet }) {
  const { user } = useAuth();
  const [isEditable, setIsEditable] = useState(false);
  const [content, setContent] = useState(tweet?.content);
  const textareaRef = useRef(null);
  const autoResizeTextArea = useAutoResize(content, textareaRef);
  const { mutate: updateTweet, isPending: updatingTweet } = useUpdateTweet(
    tweet?._id,
    user?._id,
  );

  const handleUpdateTweet = async () => {
    updateTweet(content, {
      onSuccess: () => {
        setIsEditable(false);
        toast("Tweet updated");
      },
      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message ||
          "Something went wrong. Please try again later";
        toast.error(errorMessage);
      },
    });
  };

  useEffect(() => {
    if (isEditable && textareaRef.current) {
      autoResizeTextArea();
    }
  }, [isEditable]);

  return (
    <Dialog.Root
      onOpenChange={(o) => {
        if (!o) {
          setIsEditable(false);
          setContent(tweet?.content);
        }
      }}
    >
      <Dialog.Trigger className="cursor-pointer">{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title size={"4"} className="flex justify-between ">
          <Text className="mr-auto">Tweet</Text>
          <Dialog.Close>
            <CloseButton />
          </Dialog.Close>
        </Dialog.Title>
        <Dialog.Description
          size={"2"}
          className="break-words whitespace-pre-wrap"
        >
          {isEditable && (
            <div className="flex-1">
              <TextArea
                autoFocus
                ref={textareaRef}
                placeholder="Add a tweet..."
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                disabled={updatingTweet}
                onFocus={(e) =>
                  e.target.setSelectionRange(content.length, content.length)
                }
              />
              <div className="flex justify-end gap-2 mt-2 ">
                <Button
                  onClick={() => {
                    setIsEditable(false);
                    setContent(tweet?.content);
                  }}
                  variant="surface"
                  color="gray"
                  className="px-4"
                  radius="full"
                  disabled={updatingTweet}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateTweet}
                  disabled={
                    !content?.trim() ||
                    content?.trim() === tweet?.content ||
                    updatingTweet
                  }
                  loading={updatingTweet}
                  highContrast
                  className="px-4"
                  radius="full"
                >
                  Save
                </Button>
              </div>
            </div>
          )}
          {!isEditable && (
            <div className="flex flex-col gap-2">
              <Text as="span" size={"1"} color="gray">
                {tweet?.createdAt &&
                  formatDistanceToNow(new Date(tweet.createdAt), {
                    addSuffix: true,
                  })}
              </Text>
              <Text as="p" className="break-words whitespace-pre-wrap">
                {tweet.content}
              </Text>
              <Flex align={"center"} justify={"between"}>
                <Text as="span" className="flex items-center gap-1">
                  <ThumbsUpIcon size={18} strokeWidth={1.25} />{" "}
                  {tweet.likesCount}
                </Text>
                <MoreOptionsMenu
                  tweetData={tweet}
                  setIsEditable={setIsEditable}
                />
              </Flex>
            </div>
          )}
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export function MoreOptionsMenu({ tweetData, setIsEditable }) {
  const { user } = useAuth();
  const { mutateAsync: deleteComment, isPending: deletingComment } =
    useDeleteTweet(tweetData?._id, user?._id);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const handleDeleteTweet = async () => {
    toast.promise(deleteComment(tweetData?._id), {
      loading: "Deleting tweet...",
      success: "Tweet deleted",
      error: (error) =>
        error?.response?.data?.message ||
        "Something went wrong, please try again.",
    });
  };

  return (
    <>
      {openConfirmation && (
        <ConfirmationDialog
          open={openConfirmation}
          setOpen={setOpenConfirmation}
          action={handleDeleteTweet}
          title={`Permanently delete this tweet?`}
          descripion={`Note: Deleting tweet is a permanent action and cannot be undone.`}
          maxWidth="480px"
        />
      )}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger disabled={deletingComment}>
          <IconButton
            variant="ghost"
            highContrast
            color="gray"
            radius="full"
            size={"3"}
            title="More options"
            aria-label="More options"
          >
            <DotsHorizontalIcon width="18" height="18" />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content variant="soft" highContrast className="w-48">
          <DropdownMenu.Item onClick={() => setIsEditable(true)}>
            <Pencil1Icon /> Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item
            color="red"
            onClick={() => setOpenConfirmation(true)}
          >
            <TrashIcon /> Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
}

export function SkeletonLoader() {
  return (
    <Table.Root>
      <TableHeader />
      <Table.Body>
        {Array.from({ length: 3 }).map((_, idx) => (
          <Table.Row key={idx}>
            <Table.RowHeaderCell className="min-w-[312px] max-w-[312px]">
              <Flex direction={"column"} gap={"2"} className="w-full">
                <Skeleton className="h-5" />
                <Skeleton className="w-2/3 h-5" />
              </Flex>
            </Table.RowHeaderCell>
            <Table.Cell>
              <Skeleton className="w-[70px] h-5" />
            </Table.Cell>
            <Table.Cell>
              <Skeleton className="w-6 h-5" />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}

const NoContent = () => (
  <section className="flex flex-col items-center justify-center">
    <img src={no_tweet} alt="no content" className="size-52" />
    <Text color="gray" size="2">
      No content available
    </Text>
  </section>
);

function TableHeader() {
  return (
    <Table.Header className="bg-[--gray-2]">
      <Table.Row>
        <Table.ColumnHeaderCell>
          <Text color="gray" size={"1"} weight={"medium"}>
            Tweet
          </Text>
        </Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>
          <Text color="gray" size={"1"} weight={"medium"}>
            Date
          </Text>
        </Table.ColumnHeaderCell>
        <Table.ColumnHeaderCell>
          <Text color="gray" size={"1"} weight={"medium"}>
            Likes
          </Text>
        </Table.ColumnHeaderCell>
      </Table.Row>
    </Table.Header>
  );
}
