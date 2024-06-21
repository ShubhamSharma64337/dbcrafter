import React from 'react'

export default function Tooltip({theme, text, position}) {
    // Note: The parent element of the Tooltip child must have group and relative tailwindcss classes for this to work
    // Position can be set to 'top', 'right', 'left' or 'bottom', theme can be 'dark' or 'light, text must be a string
    // The parent element or parent's parent must not have overflow set to auto or hidden, if you want this to work
  return (
    <span className={`z-10 text-sm text-nowrap tooltip absolute ${position==='top'?'bottom-full left-1/2 mb-2 -translate-x-1/2':''} ${position==='bottom'?'top-full left-1/2 mt-2 -translate-x-1/2':''}  ${position==='right'?'top-1/2 left-full ms-2 -translate-y-1/2':''} ${position==='left'?'top-1/2 right-full  me-2 -translate-y-1/2':''} ${theme==='dark'?'bg-gray-900 text-white border-blue-500':'bg-white border-slate-500 text-black'} border  px-2 py-1 rounded scale-0 group-hover:scale-100`}>{text}</span>
  )
}
