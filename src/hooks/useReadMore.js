import { useState, useRef, useEffect } from "react";

export function useReadMore(content) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLongContent, setIsLongContent] = useState(false);
  const contentRef = useRef(null);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const checkContentLength = () => {
    if (contentRef.current) {
      const isOverflowing = contentRef.current.scrollHeight > contentRef.current.clientHeight;
      setIsLongContent(isOverflowing);
    }
  };

  useEffect(() => {
    checkContentLength();
  }, [content]);

  return {
    isExpanded,
    isLongContent,
    toggleExpand,
    contentRef,
    setIsExpanded,
    setIsLongContent
  };
}
