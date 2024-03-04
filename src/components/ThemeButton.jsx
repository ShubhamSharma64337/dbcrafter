import React from 'react'

export default function ThemeButton({theme}) {
  return (
    <div>
        {theme==='dark'?
            <i className="bi bi-sun-fill"></i>:
            <i className="bi bi-moon-stars-fill"></i>    
        }
    </div>
  )
}
