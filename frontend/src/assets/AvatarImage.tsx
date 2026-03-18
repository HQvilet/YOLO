import React from 'react'
import defaultAvatar from '../assets/default_avatar.png'

const AvatarImage = ({ src, className }: {src?: string, className?: string}) => {
  return (
    <img 
        src={ src || defaultAvatar }
        alt=""
        className={className}
    />
  )
}

export default AvatarImage