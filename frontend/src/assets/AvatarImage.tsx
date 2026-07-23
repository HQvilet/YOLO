import React from 'react'
import defaultAvatar from '../assets/default_avatar.png'

const AvatarImage = ({ src, className }: {src?: string, className?: string}) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <img 
          src={ src || defaultAvatar }
          alt=""
          className={`object-cover size-full`}
      />      
    </div>

  )
}

export default AvatarImage