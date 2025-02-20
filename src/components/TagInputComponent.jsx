import { Button, IconButton, Text, TextField } from '@radix-ui/themes';
import { X } from 'lucide-react';
import React from 'react';

function TagInputComponent({
  tags = [],
  setTags,
  tagName = '',
  setTagName,
  className = ''
}) {
  const handleAddTag = () => {
    const trimmedTag = tagName?.trim();

    if (trimmedTag !== '' && !tags.some(tag => tag.toLowerCase() === trimmedTag.toLowerCase())) {
      setTags(prevTags => {
        if (Array.isArray(prevTags)) {
          return [...prevTags, trimmedTag];
        }
        return [trimmedTag];
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
      className={`flex flex-wrap w-full rounded bg-[--color-surface]  focus-within:ring-[--focus-8] focus-within:outline-none mt-1 p-2 cursor-text items-center gap-2 ${className} ring-1 ring-[--gray-a7] focus-within:ring-[1.5px]`}
    >
      {tags?.map((tag, i) => (
        <Button
          variant='surface'
          asChild
          key={i}
        >
          <Text
            as='span'
            key={i}
            weight={'regular'}
          >
            {tag}
            <IconButton
              type='button'
              variant='ghost'
              size={'1'}
              radius='full'
              onClick={() => {
                removeTag(tag); // Remove the tag
              }}
            >
              <X size={16} />
            </IconButton>
          </Text>
        </Button>
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
