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
  classNames?: CheckboxClassNames
): classNames is CheckboxRelativeClassNames => {
  if (!classNames) return false

  const relativeClassNames = classNames as CheckboxRelativeClassNames

  return Boolean(
    relativeClassNames?.default ||
      relativeClassNames?.checked ||
      relativeClassNames?.unchecked
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
  classNames?: CheckboxClassNames,
  checked?: boolean
) => {
  return getIsClassNamesRelative(classNames)
    ? cn(
        classNames?.default,
        checked ? classNames?.checked : classNames?.unchecked
      )
    : classNames
}
