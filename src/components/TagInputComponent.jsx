import { Cross1Icon } from '@radix-ui/react-icons';
import { IconButton, Text, TextField } from '@radix-ui/themes';
import { X } from 'lucide-react';
import React from 'react'

function TagInputComponent({
  tags = [],
  setTags,
  tagName = '',
  setTagName,
  className = ''
}) {
  const handleAddTag = () => {
    if (tagName?.trim() !== '' && !tags.includes(tagName.trim().toLowerCase())) {
      setTags(prevTags => {
        if (Array.isArray(prevTags)) {
          return [...prevTags, tagName.trim().toLowerCase()];
        }
        return [tagName.trim().toLowerCase()];
      });
      setTagName('');
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
  };

  return (
    <label
      htmlFor='tag_input'
      className={`flex flex-wrap w-full rounded bg-[#00000040]  focus-within:shadow-input-focus focus-within:rounded-[5px] focus-within:outline-none shadow-input-border mt-1 p-2 cursor-text items-center gap-2 ${className}`}
    >
      {tags?.map((tag, i) => (
        <Text
          as='span'
          key={i}
          color='blue'
          className='flex items-center justify-between gap-3 py-1 pr-2 pl-3 text-sm shadow-md rounded bg-[#388bfd1a] transition hover:bg-[#3e63dd] hover:text-white group'
        >
          {tag}
          <IconButton
            type='button'
            variant='ghost'
            color='blue'
            size={'1'}
            radius='full'
            onClick={() => {
              removeTag(tag); // Remove the tag
            }}
            className='group-hover:text-white'
          >
            <X size={16} />
          </IconButton>
        </Text>
      ))}
      {tags.length < 5 && <TextField.Root
        id='tag_input'
        value={tagName}
        type="text"
        onChange={e => setTagName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " " || e.key === ",") {
            e.preventDefault();
            handleAddTag();
          }
          if (tags.length > 0 && tagName === '' && e.key === "Backspace") {
            removeTag(tags[tags.length - 1]);
          }
        }}
        onBlur={handleAddTag}
        placeholder='Add tags...'
        className='flex-1 bg-transparent shadow-none outline-none min-w-20'
      />}
    </label>

  )
}

export default TagInputComponent
