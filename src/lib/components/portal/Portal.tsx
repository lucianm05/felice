import { PropsWithChildren, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import classes from './Portal.module.css'

export const Portal = ({ children }: PropsWithChildren) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    return () => {
      setMounted(false)
    }
  }, [])

  if (!mounted) return null

  let container = document.getElementById('felice-portal')

  if (!container) {
    container = document.createElement('div')
    container.setAttribute('id', 'felice-portal')
    container.setAttribute('class', classes['felice__portal'])
    document.body.appendChild(container)
  }

  return createPortal(children, container)
}
