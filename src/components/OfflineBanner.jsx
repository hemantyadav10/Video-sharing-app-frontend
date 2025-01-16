import { Text } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import useIsOnline from '../hooks/useIsOnline';
import { CloudOff } from 'lucide-react';

function OfflineBanner() {

  return (
    <div
      className={`fixed left-0 w-full text-center bottom-16 sm:bottom-0 z-[100] bg-[#111113]
        } p-[2px]`}
    >
      <Text size="2" highContrast weight="medium" className='flex items-center justify-center gap-1'>
      <CloudOff size={18}/> No internet connection
      </Text>
    </div>
  );
}

export default OfflineBanner;
