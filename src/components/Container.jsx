import React from 'react'

function Container({ children, showMenu }) {

  return (
    <div className={`grid flex-1 sm:px-4  md:px-6 lg:px-10 pt-0 sm:pt-4 py-4 gap-2 sm:grid-cols-2   ${showMenu ? "lg:grid-cols-2 xl:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"} h-max`}>
      {children}
    </div>
  )
}

export default Container
