import { PropsWithChildren, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

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
    container.style.position = 'fixed'
    container.style.top = '0'
    container.style.left = '0'
    document.body.appendChild(container)
  }

  return createPortal(children, container)
}
