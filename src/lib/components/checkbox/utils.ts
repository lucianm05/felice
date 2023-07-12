import {
  CheckboxClassNames,
  CheckboxIndicator,
  CheckboxRelativeClassNames,
  CheckboxRelativeIndicator,
  CheckboxRelativeStyle,
  CheckboxStyle,
} from '@lib/components/checkbox/types'
import { cn, mergeObjects } from '@lib/utils'

export const getIsIndicatorRelative = (
  indicator?: CheckboxIndicator
): indicator is CheckboxRelativeIndicator => {
  if (!indicator) return false

  const relativeIndicator = indicator as CheckboxRelativeIndicator

  return Boolean(relativeIndicator?.checked || relativeIndicator?.unchecked)
}

export const getIsStyleRelative = (
  style?: CheckboxStyle
): style is CheckboxRelativeStyle => {
  if (!style) return false

  const relativeStyle = style as CheckboxRelativeStyle

  return Boolean(relativeStyle?.checked || relativeStyle?.unchecked)
}

export const getIsClassNamesRelative = (
  className?: CheckboxClassNames
): className is CheckboxRelativeClassNames => {
  if (!className) return false

  const relativeClassName = className as CheckboxRelativeClassNames

  return Boolean(
    relativeClassName?.default ||
      relativeClassName?.checked ||
      relativeClassName?.unchecked
  )
}

export const getStyles = (style?: CheckboxStyle, checked?: boolean) => {
  return mergeObjects(
    style,
    getIsStyleRelative(style)
      ? checked
        ? style?.checked
        : style?.unchecked
      : undefined
  )
}

export const getClassNames = (
  className?: CheckboxClassNames,
  checked?: boolean
) => {
  return getIsClassNamesRelative(className)
    ? cn(
        className?.default,
        checked ? className?.checked : className?.unchecked
      )
    : className
}
