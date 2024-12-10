import { Button, Text } from '@radix-ui/themes'
import React from 'react'
import { faqData } from '../utils/faqData.js'
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";

function Help() {

  return (
    <div className='w-full mb-16'>
      <div className="max-w-3xl px-6 py-10 mx-auto md:px-10">
        {/* Page Header */}
        <div className="mb-10 text-center">
          <Text as="p" size="2" align="center" color="blue" mb={'1'}>
            FAQs
          </Text>
          <Text as="p" size="8" weight="medium" align="center">
            We're here to help
          </Text>
          <Text as="p" mt={'4'} color='gray' align="center">
            Have questions? We're here to help.
          </Text>
        </div>

        {/*FAQs content */}
        <div>
          <div className='flex w-full '>
            <Button
              highContrast
              size={'3'}
              mb={'9'}
              radius='full'
              className='w-full px-6 sm:w-max sm:mx-auto'
            >
              Contact
            </Button>
          </div>

          <Accordion.Root
            type="single"
            collapsible
            className=" rounded-md bg-[#d8f4f605] shadow-lg shadow-black/20"
          >
            {faqData.map((faq, index) => (
              <Accordion.Item
                key={index}
                value={`faq-${index}`}
                className=" overflow-hidden  first:mt-0 first:rounded-t last:rounded-b border-b last:border-none border-[rgba(72,72,72,0.3)] focus-within:shadow-[0_0_0_2px] focus-within:shadow-[#2870bd]"
              >
                <Accordion.Header className="flex shadow-lg shadow-black/30 ">
                  <Accordion.Trigger
                    className="group flex py-6 flex-1 items-center justify-between px-5 outline-none hover:bg-[rgba(216,244,246,0.03)] transition-all cursor-pointer active:bg-[#d8f4f60d] "
                  >
                    <Text highContrast align={'left'}>
                      {faq.question}
                    </Text>
                    <ChevronDownIcon
                      height={'20px'}
                      width={'20px'}
                      className="text-violet10 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content
                  className="overflow-hidden data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown   bg-[rgba(216,244,246,0.02)]"
                >
                  <div className='px-5 py-4'>
                    <Text size={'2'} >
                      {faq.answer}
                    </Text>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </div>

      {/* footer */}
      <div className='flex justify-center mx-10 mt-10 mb-10 sm:mb-0 sm:justify-end '>
        <Text as='span' color='gray' size={'2'} >
          © 2024 copyright ViewTube. All rights reserved.
        </Text>
      </div>
    </div>
  )
}

export default Help
