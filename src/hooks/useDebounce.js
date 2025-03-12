import { useEffect, useState } from "react"

function useDebounce(value, debounceTime = 300) {
  const [debounceValue, setDebounceValue] = useState('')

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebounceValue(value)
    }, debounceTime)

    return () => {
      clearTimeout(timerId)
    }
  }, [value])
  return debounceValue;
}

export default useDebounce

