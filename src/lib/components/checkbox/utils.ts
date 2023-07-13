import {
  CheckboxClassNames,
  CheckboxRelativeClassNames,
  CheckboxRelativeStyle,
  CheckboxStyles,
} from '@lib/components/checkbox/types'
import { cn, mergeObjects } from '@lib/utils'

export const getIsStyleRelative = (
  style?: CheckboxStyles
): style is CheckboxRelativeStyle => {
  if (!style) return false

  const relativeStyle = style as CheckboxRelativeStyle

  return Boolean(
    relativeStyle?.checked ||
      relativeStyle?.unchecked ||
      relativeStyle?.disabled
  )
}

export const getIsClassNamesRelative = (
  className?: CheckboxClassNames
): className is CheckboxRelativeClassNames => {
  if (!className) return false

  const relativeClassName = className as CheckboxRelativeClassNames

  return Boolean(
    relativeClassName?.default ||
      relativeClassName?.checked ||
      relativeClassName?.unchecked ||
      relativeClassName?.disabled
  )
}

export const getStyles = (
  styles?: CheckboxStyles,
  checked?: boolean,
  disabled?: boolean
) => {
  return mergeObjects(
    styles,
    getIsStyleRelative(styles)
      ? mergeObjects(
          disabled ? styles?.disabled : undefined,
          checked ? styles?.checked : styles?.unchecked
        )
      : undefined
  )
}

export const getClassNames = (
  classNames?: CheckboxClassNames,
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
