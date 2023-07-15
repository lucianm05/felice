import { useEffect } from 'react'

export const usePreventScroll = (disable = false) => {
  useEffect(() => {
    if (disable) {
      document.body.style.top = `${-scrollY}px`
      document.body.style.overflowY = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      return
    }

    const top = Number(document.body.style.top.replace('px', ''))
    document.body.style.overflowY = ''
    document.body.style.position = ''
    document.body.style.top = ''
    window.scrollTo(0, (top || 0) * -1)
  }, [disable])
}
