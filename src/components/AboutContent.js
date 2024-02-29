import React from 'react'

export default function AboutContent({theme}) {
  return (
    <div className={`d-flex h-100 w-100 ${theme==='dark'?'bg-dark text-light':''}`}>
        <p className="p-5 fs-4">
            This is the about page of our website and this is a database designer. Open Source relational database design tool built using ReactJS and HTML Canvas. Create diagrams, use templates, export as SQL or image.
        </p>
    </div>
  )
}
