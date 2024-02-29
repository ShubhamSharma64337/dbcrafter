import React from 'react'

export default function ThemeButton({theme}) {
  return (
    <div>
        {theme==='dark'?
            <i class="bi bi-sun-fill"></i>:
            <i class="bi bi-moon-stars-fill"></i>    
        }
    </div>
  )
}
