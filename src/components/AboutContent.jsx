import React from 'react'

export default function AboutContent({theme}) {
  return (
    <div className={`flex justify-center items-center`}>
        <p className="text-3xl p-5">
            This is the about page of our website and this is a database designer. Open Source relational database design tool built using ReactJS and HTML Canvas. Create diagrams, use templates, export as SQL or image.
        </p>
    </div>
  )
}
