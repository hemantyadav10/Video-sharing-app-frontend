import { useCallback, useEffect } from "react";

export function useAutoResize(
  value,
  textareaRef,
  maxHeight = 500
) {
  const autoResizeTextArea = useCallback(() => {
    if (textareaRef?.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      const newHeight = textarea.scrollHeight;

      if (newHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
      } else {
        textarea.style.height = `${newHeight}px`;
      }
    }
  }, [textareaRef, maxHeight]);

  useEffect(() => {
    autoResizeTextArea()
  }, [value])

  return autoResizeTextArea
}