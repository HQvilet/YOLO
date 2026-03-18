import React from 'react'
import { createPortal } from 'react-dom';

const Modal = ({open, onClose, children}: {open: boolean, onClose?: () => void, children?: React.ReactNode}) => {
    if(!open) return null;

    return createPortal(
    <>
        <div className='fixed bg-black/40 top-0 left-0 right-0 bottom-0 z-10'>
            {children}
        </div>
    </>,
    document.getElementById('portal')!
  )
}

export default Modal