import React from 'react'

export default function Tooltip({theme, text, position}) {
    // Note: The parent element of the Tooltip child must have group and relative tailwindcss classes for this to work
  return (
    <span className={`text-sm text-nowrap tooltip absolute top-1/2  ${position==='right'?'left-full ms-2':'right-full  me-2'} ${theme==='dark'?'bg-gray-900 text-white border-blue-500':'bg-white border-slate-500 text-black'} border  px-2 py-1 rounded -translate-y-1/2 hidden group-hover:block`}>{text}</span>
  )
}
