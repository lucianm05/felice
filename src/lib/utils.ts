import { keys } from '@lib/constants/keys'
import { Orientation, SequenceDirection } from '@lib/types'

export const cn = (...classes: (string | undefined | boolean)[]) =>
  classes.filter(Boolean).join(' ')

export const isDefined = (input: unknown): input is NonNullable<typeof input> =>
  input !== undefined && input !== null

export const mergeObjects = (...objects: (object | undefined)[]): object => {
  let output = {}

  objects.forEach(object => {
    output = { ...output, ...(object || {}) }
  })

  return output
}

export const range = (start: number, stop: number, step = 1) =>
  Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step)

export const getSequenceDirection = (
  key: string,
  orientation: Orientation
): SequenceDirection | null => {
  if (
    (orientation === 'horizontal' && key === keys.arrowRight) ||
    (orientation === 'vertical' && key === keys.arrowDown)
  )
    return 'forward'

  if (
    (orientation === 'horizontal' && key === keys.arrowLeft) ||
    (orientation === 'vertical' && key === keys.arrowUp)
  )
    return 'backward'

  return null
}

export const getNextElementInSequence = <T extends HTMLElement>(
  currentIndex: number,
  elements: T[] | NodeListOf<T>,
  direction: SequenceDirection
): T => {
  const elementsArray = [...elements]

  const nextElements: T[] = [
    ...elementsArray.slice(currentIndex + 1, elementsArray.length),
    ...elementsArray.slice(0, currentIndex),
  ].filter(e => e.getAttribute('data-disabled') === 'false')

  if (direction === 'backward') {
    nextElements.reverse()
  }

  return nextElements[0]
}
