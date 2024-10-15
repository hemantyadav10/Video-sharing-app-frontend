import React from 'react'

function Container({ children, showMenu }) {
  return (
    <div className={`grid flex-1 sm:px-4  md:px-12 sm:py-6 gap-y-8 gap-x-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-16`}>
      {children}
    </div>
  )
}

export default Container
