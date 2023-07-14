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

  return Boolean(
    relativeStyle?.checked ||
      relativeStyle?.unchecked ||
      relativeStyle?.disabled
  )
}

export const getIsClassNamesRelative = (
  classNames?: SwitchClassNames
): classNames is SwitchRelativeClassNames => {
  if (!classNames) return false

  const relativeClassNames = classNames as SwitchRelativeClassNames

  return Boolean(
    relativeClassNames?.default ||
      relativeClassNames?.checked ||
      relativeClassNames?.unchecked ||
      relativeClassNames?.disabled
  )
}

export const getStyles = (
  style?: SwitchStyle,
  checked?: boolean,
  disabled?: boolean
) => {
  return mergeObjects(
    style,
    getIsStyleRelative(style)
      ? mergeObjects(
          disabled ? style?.disabled : undefined,
          checked ? style?.checked : style?.unchecked
        )
      : undefined
  )
}

export const getClassNames = (
  classNames?: SwitchClassNames,
  checked?: boolean,
  disabled?: boolean
) => {
  return getIsClassNamesRelative(classNames)
    ? cn(
        classNames?.default,
        disabled && classNames?.disabled,
        checked ? classNames?.checked : classNames?.unchecked
      )
    : classNames
}
