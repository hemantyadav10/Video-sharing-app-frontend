import React from 'react'

function Container({ children, showMenu }) {

  return (
    <div className={`grid flex-1 sm:px-4  md:px-6 lg:px-10 sm:py-6 gap-y-8 gap-x-4 sm:grid-cols-2 mb-20 ${showMenu ? "lg:grid-cols-2 xl:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"}`}>
      {children}
    </div>
  )
}

export default Container
