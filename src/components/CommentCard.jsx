import {
  ChatBubbleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DotsVerticalIcon,
  DrawingPinFilledIcon,
  DrawingPinIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  Button,
  DropdownMenu,
  Flex,
  IconButton,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { formatDistanceToNow } from "date-fns";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import ThumbsUp from "../assets/ThumbsUpIcon";
import ThumbsUpSolidIcon from "../assets/ThumbsUpSolidIcon";
import { useAuth } from "../context/authContext";
import { useAutoResize } from "../hooks/useAutoResize";
import { useReadMore } from "../hooks/useReadMore";
import {
  useDeleteComment,
  usePinComment,
  useUnpinComment,
  useUpdateComment,
} from "../lib/queries/commentQueries";
import { useToggleCommentLike } from "../lib/queries/likeQueries";
import ConfirmationDialog from "./ConfirmationDialog";
import Loader from "./Loader";
import ReplyCommentCard from "./ReplyCommentCard";
import ReplyCommentInput from "./ReplyCommentInput";
import ReplyCommentSection from "./ReplyCommentSection";

function CommentCard({ comment, videoId, sortBy, ownerId }) {
  const { user, isAuthenticated } = useAuth();
  const [commentLikesCount, setCommentLikesCount] = useState(
    comment?.likesCount || 0,
  );
  const [isCommentLiked, setIsCommentLiked] = useState(
    comment?.isLiked || false,
  );
  const navigate = useNavigate();

  const { mutate: toggleLike, isPending: isToggleLikePending } =
    useToggleCommentLike(comment?._id, videoId);
  const { mutate: deleteComment, isPending: deletingComment } =
    useDeleteComment(videoId, sortBy, comment?._id, user?._id);
  const [isEditable, setIsEditable] = useState(false);
  const [content, setContent] = useState(comment?.content || "");
  const { mutate: updateComment, isPending: updatingComment } =
    useUpdateComment(videoId, sortBy, user);

  const pinMutation = usePinComment({ userId: user?._id, sortBy });
  const unpinMutation = useUnpinComment({ userId: user?._id, sortBy });

  const {
    contentRef,
    isExpanded,
    isLongContent,
    toggleExpand,
    setIsExpanded,
    setIsLongContent,
  } = useReadMore(content);
  const textareaRef = useRef(null);
  const autoResizeTextArea = useAutoResize(content, textareaRef);
  const [openReplyInput, setOpenReplyInput] = useState(false);
  const [openReplySection, setOpenReplySection] = useState(false);
  const [open, setOpen] = useState(false);
  const [replyList, setReplyList] = useState([]);
  const [hasMorePages, setHasMorePages] = useState(true);
  const handleHasNextPage = (value) => {
    setHasMorePages(value); // Update state in the parent
  };

  const handleToggleLike = async () => {
    if (isAuthenticated) {
      setIsCommentLiked((prev) => !prev);
      setCommentLikesCount((prev) => {
        return isCommentLiked ? prev - 1 : prev + 1;
      });
      toggleLike(comment?._id, {
        onError: () => {
          // Revert the optimistic update in case of an error
          setIsCommentLiked((prev) => !prev);
          setCommentLikesCount(comment?.likesCount);
          toast.error("Something went wrong. Please try again.");
        },
      });
    } else {
      navigate("/login");
    }
  };

  const handleDeleteComment = useCallback(async () => {
    deleteComment(comment?._id, {
      onSuccess: () => {
        return toast("Comment deleted");
      },
      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message ||
          "Something went wrong. Please try again later";
        toast.error(errorMessage);
      },
    });
  }, []);

  const handleUpdateComment = async () => {
    updateComment(
      { commentId: comment?._id, content },
      {
        onSuccess: () => {
          setIsEditable(false);
          toast("Comment updated");
          setIsExpanded(true);
          setIsLongContent(false);
        },
        onError: (error) => {
          const errorMessage =
            error?.response?.data?.message ||
            "Something went wrong. Please try again later";
          toast.error(errorMessage);
        },
      },
    );
  };

  const handlePinUnpin = (isPinned) => {
    const commentId = comment?._id;

    if (isPinned) {
      unpinMutation.mutate(
        { commentId, videoId, userId: user?._id, sortBy },
        {
          onSuccess: () => {
            toast.success("Comment unpinned successfully.");
          },
          onError: (error) => {
            const errorMessage =
              error?.response?.data?.message ||
              "Something went wrong. Please try again later";
            toast.error(errorMessage);
          },
        },
      );
    } else {
      pinMutation.mutate(
        { commentId, videoId, userId: user?._id, sortBy },
        {
          onSuccess: () => {
            toast.success(`Pinned ${comment?.owner?.username}'s comment.`);
          },
          onError: (error) => {
            const errorMessage =
              error?.response?.data?.message ||
              "Something went wrong. Please try again later";
            toast.error(errorMessage);
          },
        },
      );
    }
  };

  useEffect(() => {
    if (isEditable && textareaRef.current) {
      autoResizeTextArea();
    }
  }, [isEditable]);

  if (updatingComment || deletingComment) return <Loader center />;

  return (
    <div>
      <div className={`flex gap-4`}>
        <Link to={`/channel/${comment?.owner._id}`} className="w-10 ">
          <img
            src={comment?.owner.avatar}
            alt=""
            className="object-cover object-center w-full rounded-full aspect-square"
          />
        </Link>
        {isEditable && (
          <div className="flex-1">
            <TextArea
              ref={textareaRef}
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={(e) =>
                e.target.setSelectionRange(content.length, content.length)
              }
              resize={"vertical"}
            />
            <div className="flex justify-end gap-2 mt-2 ">
              <Button
                onClick={() => {
                  setIsEditable(false);
                  setContent(comment?.content);
                }}
                radius="full"
                variant="surface"
                color="gray"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateComment}
                disabled={
                  !content?.trim() || content?.trim() === comment?.content
                }
                radius="full"
                highContrast
              >
                Save
              </Button>
            </div>
          </div>
        )}
        {!isEditable && (
          <div className="flex flex-col flex-1 gap-1 text-sm">
            {comment?.isPinned && (
              <Text
                as="p"
                className="flex items-center gap-1"
                color="gray"
                size={"1"}
              >
                <DrawingPinIcon /> Pinned
              </Text>
            )}
            <div className="flex items-center justify-between gap-3 text-sm">
              <Link to={`/channel/${comment?.owner._id}`}>
                <div className={`flex items-center gap-1 text-sm  flex-wrap `}>
                  <div
                    className={`font-medium ${comment?.owner._id === ownerId ? "bg-[--gray-a12] px-1 rounded text-[--gray-1]" : ""}`}
                  >
                    @{comment?.owner.username}
                  </div>
                  <Text as="span" color="gray" size={"1"}>
                    {comment?.createdAt &&
                      formatDistanceToNow(new Date(comment?.createdAt), {
                        addSuffix: true,
                        includeSeconds: true,
                      })}
                    {comment?.isEdited && " (edited)"}
                  </Text>
                </div>
              </Link>

              {isAuthenticated &&
                (user?._id === ownerId || user?._id === comment?.owner._id) && (
                  <>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <IconButton
                          variant="ghost"
                          highContrast
                          color="gray"
                          radius="full"
                          size={"3"}
                        >
                          <DotsVerticalIcon width="18" height="18" />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content variant="soft" className="w-48">
                        {user?._id === ownerId && (
                          <>
                            <DropdownMenu.Item
                              onClick={() => handlePinUnpin(comment?.isPinned)}
                            >
                              {comment?.isPinned ? (
                                <>
                                  <DrawingPinIcon /> Unpin
                                </>
                              ) : (
                                <>
                                  <DrawingPinFilledIcon /> Pin
                                </>
                              )}
                            </DropdownMenu.Item>
                          </>
                        )}
                        {user?._id === comment?.owner._id && (
                          <>
                            <DropdownMenu.Item
                              onClick={() => setIsEditable(true)}
                            >
                              <Pencil1Icon /> Edit
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              onClick={() => setOpen(true)}
                              color="red"
                            >
                              <TrashIcon /> Delete
                            </DropdownMenu.Item>
                          </>
                        )}
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                    {setOpen && (
                      <ConfirmationDialog
                        open={open}
                        setOpen={setOpen}
                        action={handleDeleteComment}
                        title="Delete comment"
                        descripion="Delete your comment permanently?"
                      />
                    )}
                  </>
                )}
            </div>
            <p
              ref={contentRef}
              className={`pr-4 break-words whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-3"}`}
            >
              {renderContentWithLinks(comment?.content)}
            </p>
            {isLongContent && (
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  color="gray"
                  radius="full"
                  onClick={() => {
                    toggleExpand();
                  }}
                  className="font-medium transition bg-transparent hover:text-[--gray-12] hover:underline"
                >
                  {isExpanded ? "Show less" : "Read more"}
                </Button>
              </div>
            )}
            <Flex align={"center"} gapX={"5"} mt={"2"}>
              <div className="flex items-center gap-1 text-xs">
                <IconButton
                  onClick={handleToggleLike}
                  variant="ghost"
                  color="gray"
                  highContrast
                  radius="full"
                  disabled={isToggleLikePending}
                  className="text-[--gray-12]"
                >
                  {isCommentLiked ? <ThumbsUpSolidIcon /> : <ThumbsUp />}
                </IconButton>
                <Text as="span" color="gray" size={"1"}>
                  {commentLikesCount}
                </Text>
              </div>
              <Button
                color="gray"
                variant="ghost"
                className="text-xs font-medium"
                highContrast
                radius="full"
                size={"3"}
                onClick={() => {
                  if (!isAuthenticated) {
                    return navigate("/login");
                  }
                  setOpenReplyInput(true);
                }}
              >
                <ChatBubbleIcon height={16} width={16} /> Reply
              </Button>
            </Flex>
            {openReplyInput && (
              <ReplyCommentInput
                closeInput={() => setOpenReplyInput(false)}
                username={comment?.owner.username}
                commentId={comment?._id}
                videoId={videoId}
                setReplyList={setReplyList}
                sortBy={sortBy}
              />
            )}
          </div>
        )}
      </div>
      {comment?.repliesCount > 0 && (
        <div className="ml-14">
          <Button
            variant="ghost"
            mt={"4"}
            radius="full"
            onClick={() => setOpenReplySection((prev) => !prev)}
            className="flex gap-2 font-medium"
          >
            {openReplySection ? <ChevronUpIcon /> : <ChevronDownIcon />}{" "}
            {openReplySection
              ? "Hide replies"
              : `${comment?.repliesCount} ${comment?.repliesCount === 1 ? "reply" : "replies"}`}
          </Button>
          {openReplySection && (
            <ReplyCommentSection
              commentId={comment?._id}
              ownerId={ownerId}
              setReplyList={setReplyList}
              replyList={replyList}
              sendHasNextPage={handleHasNextPage}
              videoId={videoId}
              sortBy={sortBy}
            />
          )}
        </div>
      )}

      {replyList?.length > 0 && (hasMorePages || !openReplySection) && (
        <Flex direction="column" className="ml-14" mt={"4"} gapY={"4"}>
          {replyList.map((reply) => (
            <ReplyCommentCard
              key={reply._id}
              reply={reply}
              videoOwnerId={ownerId}
              commentId={comment?._id}
              setReplyList={setReplyList}
              replyList={replyList}
              videoId={videoId}
              sortBy={sortBy}
            />
          ))}
        </Flex>
      )}
    </div>
  );
}

export default React.memo(CommentCard);

const urlRegex = /(https?:\/\/[^\s]+)/g;

const renderContentWithLinks = (text) => {
  return text.split(urlRegex).map((part, index) =>
    urlRegex.test(part) ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[--accent-a11] hover:underline"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
};
