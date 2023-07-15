import { MutableRefObject, useEffect, useState } from 'react'

export const useElementPosition = (
  ref?: MutableRefObject<HTMLElement | null>
) => {
  const [pos, setPos] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (!ref?.current) return

    setPos(ref.current.getBoundingClientRect())
  }, [ref])

  return pos
}
