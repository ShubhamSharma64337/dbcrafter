import React from 'react'

export default function AboutContent({theme}) {
  return (
    <div className={`p-5 sm:px-20 ${theme==='dark'?'bg-blue-950 text-white':''} transition`}>
      <div className={`flex flex-col justify-center items-center p-10 sm:p-20 gap-y-10 rounded my-5`}>
        <div className='text-2xl underline'>
            About the website
        </div>
        <div className='text-2xl text-justify flex flex-col justify-center items-center'>
            Dbcrafter lets you create simple and easy to understand diagrams which succinctly represent relational databases. It allows you to auto-generate the SQL for the database, download it as a file, or export the whole diagram as a PNG image file. It
             is built using ReactJS, ExpressJS and the HTML Canvas API. It is an Open Source, unlicensed Web Application with its source code available on github to explore.
            <br></br>
            <br></br>
            Following is an overview of the tools and services used to build the webapp - <br></br>
            <br></br>
            <ul className='w-full sm:w-1/2 text-xl sm:text-2xl'>
              <li className='flex justify-between bg-blue-50 p-3 rounded my-1 items-center'><span className='underline my-2'>Drawing:</span> HTML Canvas API</li>
              <li className='flex justify-between bg-blue-50 p-3 rounded my-1 items-center'><span className='underline my-2'>Styling:</span> TailwindCSS</li>
              <li className='flex justify-between bg-blue-50 p-3 rounded my-1 items-center'><span className='underline my-2'>Javascript Library:</span> ReactJS</li>
              <li className='flex justify-between bg-blue-50 p-3 rounded my-1 items-center'><span className='underline my-2'>React Framework/Bundler:</span> Vite</li>
              <li className='flex justify-between bg-blue-50 p-3 rounded my-1 items-center'><span className='underline my-2'>Icons:</span> heroicons</li>
              <li className='flex justify-between bg-blue-50 p-3 rounded my-1 items-center'><span className='underline my-2'>Version Control:</span> git</li>
              <li className='flex justify-between bg-blue-50 p-3 rounded my-1 items-center'><span className='underline my-2'>Backend Framework:</span> ExpressJS</li>
              <li className='flex justify-between bg-blue-50 p-3 rounded my-1 items-center'><span className='underline my-2'>Database:</span> MongoDB Cloud</li>
              <li className='flex justify-between bg-blue-50 p-3 rounded my-1 items-center'><span className='underline my-2'>Frontend Hosting:</span> Github Pages</li>
              <li className='flex justify-between bg-blue-50 p-3 rounded my-1 items-center'><span className='underline my-2'>Backend Hosting:</span> Google Cloud AppEngine</li>
            </ul>
        </div>
      </div>
      <div className={`flex flex-col justify-center items-center p-10 sm:p-20 gap-y-10 rounded my-5`}>
        <div className='text-2xl underline'>
            About the developer
        </div>
        <div className='text-2xl text-justify'>
            I am Shubham, a Computer Science student at University of Jammu. I developed this Web Application as a part of my final Semester University Project.
        </div>
      </div>
    </div>
  )
}
