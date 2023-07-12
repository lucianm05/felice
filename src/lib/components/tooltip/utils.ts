import {
  HasEnoughSpaceMap,
  TooltipContainerRef,
  TooltipPosition,
  TooltipSide,
  TooltipTriggerRef,
} from '@lib/components/tooltip/types'
import { isDefined } from '@lib/utils'

const numberToPixelString = (input: number) => `${input}px`

export const getInitialContentPosition = (
  side: TooltipSide,
  triggerRef: TooltipTriggerRef,
  containerRef: TooltipContainerRef
): TooltipPosition => {
  if (!triggerRef || !containerRef) return {}

  const triggerRect = triggerRef.getBoundingClientRect()
  const contentRect = containerRef.getBoundingClientRect()

  const {
    width: triggerWidth,
    height: triggerHeight,
    x: triggerX,
    y: triggerY,
  } = triggerRect
  const { width: contentWidth, height: contentHeight } = contentRect

  const ySideLeft = triggerX + triggerWidth / 2 - contentWidth / 2
  const xSideTop = triggerY + triggerHeight / 2 - contentHeight / 2

  const position: TooltipPosition = {}

  switch (side) {
    case 'top':
      {
        position.top = triggerY - contentHeight
        position.left = ySideLeft
      }
      break

    case 'bottom':
      {
        position.top = triggerY + triggerHeight
        position.left = ySideLeft
      }
      break

    case 'left':
      {
        position.top = xSideTop
        position.left = triggerX - contentWidth
      }
      break

    case 'right':
      {
        position.top = xSideTop
        position.left = triggerX + triggerWidth
      }
      break
  }

  return position
}

const getHasEnoughSpace = (
  containerRef: TooltipContainerRef,
  position: TooltipPosition
): HasEnoughSpaceMap | null => {
  if (!containerRef || !isDefined(position.top) || !isDefined(position.left))
    return null

  const containerRect = containerRef.getBoundingClientRect()

  const result: HasEnoughSpaceMap = {
    top: containerRect.height + position.top > containerRect.height,
    bottom: window.innerHeight > position.top + containerRect.height,
    right: window.innerWidth - position.left > containerRect.width,
    left: position.left > 0,
  }

  return result
}

export const getFinalTooltipSide = (
  side: TooltipSide,
  triggerRef: TooltipTriggerRef,
  containerRef: TooltipContainerRef
): TooltipSide => {
  if (!triggerRef || !containerRef) {
    return side
  }

  const initialPosition = getInitialContentPosition(
    side,
    triggerRef,
    containerRef
  )

  const hasEnoughSpace = getHasEnoughSpace(containerRef, initialPosition)
  
  if (!hasEnoughSpace || hasEnoughSpace[side]) return side

  const firstAvailableSide = Object.entries(hasEnoughSpace).find(
    entry => entry[1]
  )?.[0] as TooltipSide | undefined

  let finalSide: TooltipSide | undefined = firstAvailableSide

  switch (side) {
    case 'top':
      {
        if (!hasEnoughSpace.top) {
          if (hasEnoughSpace.bottom) finalSide = 'bottom'
        }
      }
      break

    case 'bottom':
      {
        if (!hasEnoughSpace.bottom) {
          if (hasEnoughSpace.top) finalSide = 'top'
        }
      }
      break

    case 'left':
      {
        if (!hasEnoughSpace.left) {
          if (hasEnoughSpace.right) finalSide = 'right'
        }
      }
      break

    case 'right':
      {
        if (!hasEnoughSpace.right) {
          if (hasEnoughSpace.left) finalSide = 'left'
        }
      }
      break
  }

  if (!finalSide) return side

  return finalSide
}

export const getFinalContentPosition = (
  side: TooltipSide,
  triggerRef: TooltipTriggerRef,
  containerRef: TooltipContainerRef
): TooltipPosition => {
  const finalSide = getFinalTooltipSide(side, triggerRef, containerRef)

  if (!finalSide)
    return getInitialContentPosition(side, triggerRef, containerRef)

  return getInitialContentPosition(finalSide, triggerRef, containerRef)
}

export const getOffsetProperties = (
  side: TooltipSide,
  offset: number,
  triggerRef: TooltipTriggerRef,
  containerRef: TooltipContainerRef
): Omit<TooltipPosition, 'left' | 'top'> => {
  const finalSide = getFinalTooltipSide(side, triggerRef, containerRef)

  const output = numberToPixelString(offset)
  const negatedOutput = numberToPixelString(-offset)

  switch (finalSide) {
    case 'top': {
      if (offset > 0) return { paddingBottom: output }
      return { marginTop: negatedOutput }
    }

    case 'bottom': {
      if (offset > 0) return { paddingTop: output }
      return { marginTop: output }
    }

    case 'left': {
      if (offset > 0) return { paddingRight: output }
      return { marginLeft: negatedOutput }
    }

    case 'right': {
      if (offset > 0) return { paddingLeft: output }
      return { marginLeft: output }
    }
  }

  return {}
}
