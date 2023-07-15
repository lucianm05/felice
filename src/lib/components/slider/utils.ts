import { SliderOrientation, SliderValue } from '@lib/components/slider/types'
import { isDefined } from '@lib/utils'
import { CSSProperties } from 'react'

type CommonPayload = {
  min: number
  max: number
  value: SliderValue
}

export const getIntervalValues = ({
  max,
  min,
  value,
  index,
}: CommonPayload & {
  index: number
}) => {
  let minValue = min
  let maxValue = max

  if (isDefined(value[0]) && isDefined(value[1])) {
    if (index === 0) maxValue = value[1] - 1

    if (index === 1) minValue = value[0] + 1
  }

  return { minValue, maxValue }
}

export const getRangeProperties = ({
  min,
  max,
  value,
  orientation,
}: CommonPayload & {
  orientation: SliderOrientation
}): CSSProperties => {
  let startingPoint = 0
  let size = null

  if (isDefined(value[0]) && isDefined(value[1])) {
    if (orientation === 'horizontal') {
      startingPoint = ((value[0] - min) * 100) / (max - min)
      size = ((value[1] - min) * 100) / (max - min) - startingPoint

      return {
        position: 'absolute',
        left: `${startingPoint}%`,
        width: `${size}%`,
      }
    }

    startingPoint = ((value[1] - max) * 100) / (min - max)
    size = ((value[0] - max) * 100) / (min - max) - startingPoint

    return {
      position: 'absolute',
      top: `${startingPoint}%`,
      height: `${size}%`,
    }
  }

  size = ((value[0] - min) * 100) / (max - min)

  if (orientation === 'horizontal') {
    return {
      position: 'absolute',
      left: `${startingPoint}%`,
      width: `${size}%`,
    }
  }

  return {
    position: 'absolute',
    bottom: `${startingPoint}%`,
    height: `${size}%`,
  }
}
