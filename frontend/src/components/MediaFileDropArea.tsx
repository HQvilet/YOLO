import React from 'react'
 
const MediaFileDropArea = ({children, onFileLoaded, className, hover} :{
        children?: React.ReactNode,
        onFileLoaded: (e: any, files: any) => void,
        className: string,
        hover: boolean
    }) => {


    return (
    <div className={className}
        onDragOver={(e) => {
            e.preventDefault();
            hover = false
        }}
        onDrop={(e) => {
            e.preventDefault();
            onFileLoaded(e, e.dataTransfer.files);
        }}
    >
        {children}
    </div>)
}

export default MediaFileDropArea