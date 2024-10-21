import React from 'react'

function SortIcon({ height = "16", width = "16", fill = '#d6e1ff' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height + "px"} viewBox="0 -960 960 960" width={width + "px"} fill={fill}><path d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z" /></svg>
  )
}

export default SortIcon
