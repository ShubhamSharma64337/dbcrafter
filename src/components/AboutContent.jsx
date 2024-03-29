import React from 'react'

export default function AboutContent({theme}) {
  return (
    <div className={`p-5 sm:px-20 ${theme==='dark'?'bg-blue-950 text-white':''} transition`}>
      <div className={`flex flex-col justify-center items-center p-10 sm:p-20 gap-y-10 border-2 border-blue-600 rounded my-5`}>
        <div className='text-2xl font-medium'>
            About the website
        </div>
        <div className='text-2xl text-justify'>
            Dbcrafter lets you create simple and easy to understand diagrams which succinctly represent relational databases. It allows you to auto-generate the SQL for the database, download it as a file, or export the whole diagram as a PNG image file. It
             is built using ReactJS, ExpressJS and the HTML Canvas API. It is an Open Source, unlicensed Web Application with its source code available on github to explore.
        </div>
      </div>
      <div className={`flex flex-col justify-center items-center p-10 sm:p-20 gap-y-10 border-2 border-blue-600 rounded my-5`}>
        <div className='text-2xl font-medium'>
            About the developer
        </div>
        <div className='text-2xl text-justify'>
            I am Shubham, a Computer Science student at University of Jammu. I developed this Web Application as a part of my final Semester University Project.
        </div>
      </div>
    </div>
  )
}
