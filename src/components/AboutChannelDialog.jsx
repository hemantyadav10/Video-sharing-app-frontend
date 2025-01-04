import { CheckIcon, CopyIcon, EyeOpenIcon, GlobeIcon, InfoCircledIcon, Link2Icon, PersonIcon, VideoIcon } from '@radix-ui/react-icons';
import { Dialog, Flex, IconButton, ScrollArea, Spinner, Text } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/authContext';
import { useGetChannelStats } from '../lib/queries/dashboardQueries';

function AboutChannelDialog({ isOpen, setOpenDialog, joiningDate, channelId }) {
  const { data: stats, isFetching: loadingStats } = useGetChannelStats(channelId, false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = window.location.href;
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
      icon: <PersonIcon height={20} width={20} />,
      label: `${stats?.data?.totalSubscribers || 0} subscribers`,
    },
    {
      icon: <VideoIcon height={20} width={20} />,
      label: `${stats?.data?.totalVideos || 0} videos`,
    },
    {
      icon: <EyeOpenIcon height={20} width={20} />,
      label: `${stats?.data?.totalViews || 0} views`,
    },
    {
      icon: <InfoCircledIcon height={20} width={20} />,
      label: `Joined ${new Date(joiningDate).toDateString('en-IN')}`,
    },
    {
      icon: <GlobeIcon height={20} width={20} />,
      label: 'India',
    },
  ];

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        setOpenDialog(open);
      }}
    >
      <Dialog.Content maxWidth={'450px'} aria-describedby={undefined}>
        <Dialog.Title>About</Dialog.Title>
        {!loadingStats && (
          <Dialog.Description size="2" mb="4" weight="medium">
            Channel details
          </Dialog.Description>
        )}
        <Flex direction="column" gap="4">
          {loadingStats && <Spinner className="h-6 mx-auto" />}
          {!loadingStats && stats?.data && (
            <>
              <Text as="p" size="2" className="flex items-center gap-3">
                <Link2Icon height={24} width={24} />
                <input id="copy-text" type="text" readOnly value={window.location.href} className='flex-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-[#2870bd] rounded-sm' />
                <IconButton
                  variant="ghost"
                  color={isCopied ? 'green' : 'gray'}
                  onClick={handleCopy}
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
