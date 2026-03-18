import React from 'react'

const Logo = ({size = "3xl"}: {size?: string}) => {
  return (
    <div className='flex justify-center align-bottom self-center p-4'>
      <div className={`text-violet-600 font-bold text-${size}`}>YOLO</div>
    </div>
    
  )
}

export default Logo