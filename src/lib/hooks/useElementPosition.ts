import { MutableRefObject } from 'react'

export const useElementPosition = (
  ref?: MutableRefObject<HTMLElement | null>
) => {
  if (!ref?.current) return null

  return ref.current.getBoundingClientRect()
}
