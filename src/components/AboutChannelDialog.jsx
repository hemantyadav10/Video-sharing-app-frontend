import { CheckIcon, CopyIcon } from '@radix-ui/react-icons';
import { Dialog, Flex, IconButton, Text } from '@radix-ui/themes';
import { CalendarDays, Earth, Link2, SquarePlay, TrendingUp, UsersRound } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useGetChannelStats } from '../lib/queries/dashboardQueries';
import Loader from './Loader';

function AboutChannelDialog({ isOpen, setOpenDialog, joiningDate, channelId }) {
  const { data: stats, isFetching: loadingStats } = useGetChannelStats(channelId, false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${window.location.origin}/channel/${channelId}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Highlight the text
      const textElement = document.getElementById("copy-text");
      textElement.select()

      // Change the icon to a check
      setIsCopied(true);
      toast('Link copied to clipboard')

      // Revert to  copy
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };




  const channelDetails = [
    {
      icon: <UsersRound strokeWidth={1.25} size={22} />,
      label: `${stats?.data?.totalSubscribers || 0} subscribers`,
    },
    {
      icon: <SquarePlay strokeWidth={1.25} size={22} />,
      label: `${stats?.data?.totalVideos || 0} videos`,
    },
    {
      icon: <TrendingUp strokeWidth={1.25} size={22} />,
      label: `${stats?.data?.totalViews || 0} views`,
    },
    {
      icon: <CalendarDays strokeWidth={1.25} size={22} />,
      label: `Joined ${new Date(joiningDate).toDateString('en-IN')}`,
    },
    {
      icon: <Earth strokeWidth={1.25} size={22} />,
      label: 'India',
    },
  ];

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={setOpenDialog}
    >
      <Dialog.Content maxWidth={'450px'} aria-describedby={undefined}>
        <Dialog.Title>About</Dialog.Title>
        {!loadingStats && (
          <Dialog.Description size="2" mb="4" weight="medium">
            Channel details
          </Dialog.Description>
        )}
        <Flex direction="column" gap="4">
          {loadingStats && <Loader className="h-6" center/>}
          {!loadingStats && stats?.data && (
            <>
              <Text as="p" size="2" className="flex items-center gap-3">
                <Link2 strokeWidth={1.25} size={22} />
                <input
                  id="copy-text"
                  type="text"
                  readOnly
                  value={`${window.location.origin}/channel/${channelId}`}
                  className='flex-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#2870bd] rounded-sm'
                />
                <IconButton
                  variant="ghost"
                  color={isCopied ? 'green' : 'gray'}
                  onClick={handleCopy}
                  title='Click to copy link'
                >
                  {isCopied ? (
                    <CheckIcon height={16} width={16} />
                  ) : (
                    <CopyIcon height={16} width={16} />
                  )}
                </IconButton>
              </Text>
              {channelDetails.map((detail, index) => (
                <Text as="p" size="2" className="flex gap-3" key={index}>
                  {detail.icon}
                  {detail.label}
                </Text>
              ))}
            </>
          )}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default AboutChannelDialog;
