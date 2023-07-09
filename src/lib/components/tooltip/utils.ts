import {
  HasEnoughSpaceMap,
  TooltipContentPosition,
  TooltipContentRef,
  TooltipSide,
  TooltipTriggerRef,
} from '@lib/components/tooltip/types'
import { isDefined } from '@lib/utils'

const getHasEnoughSpace = (
  side: TooltipSide,
  contentRef: TooltipContentRef,
  position: TooltipContentPosition
): HasEnoughSpaceMap | null => {
  if (!contentRef || !isDefined(position.top) || !isDefined(position.left))
    return null

  const contentRect = contentRef.getBoundingClientRect()

  const result: HasEnoughSpaceMap = {
    top: true,
    bottom: true,
    right: true,
    left: true,
  }

  switch (side) {
    case 'top':
      {
        result.top = contentRect.height + position.top > contentRect.height
      }
      break

    case 'bottom':
      {
        result.bottom = window.innerHeight > position.top + contentRect.height
      }
      break

    case 'right':
      {
        result.right = window.innerWidth - position.left > contentRect.width
      }
      break

    case 'left':
      {
        result.left = position.left > contentRect.width
      }
      break
  }

  return result
}

export const getInitialContentPosition = (
  side: TooltipSide,
  triggerRef: TooltipTriggerRef,
  contentRef: TooltipContentRef
): TooltipContentPosition => {
  if (!triggerRef || !contentRef) return {}

  const triggerRect = triggerRef.getBoundingClientRect()
  const contentRect = contentRef.getBoundingClientRect()

  const {
    width: triggerWidth,
    height: triggerHeight,
    x: triggerX,
    y: triggerY,
  } = triggerRect
  const { width: contentWidth, height: contentHeight } = contentRect

  const ySideLeft = triggerX + triggerWidth / 2 - contentWidth / 2
  const xSideTop = triggerY + triggerHeight / 2 - contentHeight / 2

  const position: TooltipContentPosition = {}

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

export const getFinalContentPosition = (
  side: TooltipSide,
  triggerRef: TooltipTriggerRef,
  contentRef: TooltipContentRef
): TooltipContentPosition => {
  if (!triggerRef || !contentRef) return {}

  const initialPosition = getInitialContentPosition(
    side,
    triggerRef,
    contentRef
  )

  const hasEnoughSpace = getHasEnoughSpace(side, contentRef, initialPosition)
  console.log(hasEnoughSpace)
  if (!hasEnoughSpace) return initialPosition

  if (hasEnoughSpace[side])
    return getInitialContentPosition(side, triggerRef, contentRef)

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

  if (!finalSide) return {}

  console.log(finalSide)

  return getInitialContentPosition(finalSide, triggerRef, contentRef)
}
