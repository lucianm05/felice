import {
  SwitchClassNames,
  SwitchRelativeClassNames,
  SwitchRelativeStyle,
  SwitchStyle,
} from '@lib/components/switch/types'
import { cn, mergeObjects } from '@lib/utils'
import { CSSProperties } from 'react'

export const getIsStyleRelative = (
  style: SwitchStyle
): style is SwitchRelativeStyle => {
  const relativeStyle = style as SwitchRelativeStyle

  return Boolean(relativeStyle?.checked || relativeStyle?.unchecked)
}

export const getIsClassNamesRelative = (
  classNames: SwitchClassNames
): classNames is SwitchRelativeClassNames => {
  const relativeClassNames = classNames as SwitchRelativeClassNames

  return Boolean(
    relativeClassNames?.default ||
      relativeClassNames?.checked ||
      relativeClassNames?.unchecked
  )
}

export const getStyles = (
  style?: SwitchStyle<CSSProperties>,
  checked?: boolean
) => {
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
  classNames?: SwitchClassNames<string>,
  checked?: boolean
) => {
  return getIsClassNamesRelative(classNames)
    ? cn(
        classNames?.default,
        checked ? classNames?.checked : classNames?.unchecked
      )
    : classNames
}
