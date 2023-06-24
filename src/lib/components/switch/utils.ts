import {
  SwitchClassNames,
  SwitchRelativeClassNames,
  SwitchRelativeStyle,
  SwitchStyle,
} from '@lib/components/switch/types'
import { cn, mergeObjects } from '@lib/utils'

export const getIsStyleRelative = (
  style?: SwitchStyle
): style is SwitchRelativeStyle => {
  if (!style) return false

  const relativeStyle = style as SwitchRelativeStyle

  return Boolean(relativeStyle?.checked || relativeStyle?.unchecked)
}

export const getIsClassNamesRelative = (
  classNames?: SwitchClassNames
): classNames is SwitchRelativeClassNames => {
  if (!classNames) return false

  const relativeClassNames = classNames as SwitchRelativeClassNames

  return Boolean(
    relativeClassNames?.default ||
      relativeClassNames?.checked ||
      relativeClassNames?.unchecked
  )
}

export const getStyles = (style?: SwitchStyle, checked?: boolean) => {
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
  classNames?: SwitchClassNames,
  checked?: boolean
) => {
  return getIsClassNamesRelative(classNames)
    ? cn(
        classNames?.default,
        checked ? classNames?.checked : classNames?.unchecked
      )
    : classNames
}
