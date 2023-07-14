import {
  RadioButtonClassNames,
  RadioButtonRelativeClassNames,
  RadioButtonRelativeStyles,
  RadioButtonStyles,
} from '@lib/components/radio-group/types'
import { cn, isDefined, mergeObjects } from '@lib/utils'

export const isItemDisabled = (
  groupDisabled?: boolean,
  itemDisabled?: boolean
) => {
  if (isDefined(itemDisabled)) return Boolean(itemDisabled)

  return Boolean(groupDisabled)
}

export const getIsRadioButtonStyleRelative = (
  styles?: RadioButtonStyles
): styles is RadioButtonRelativeStyles => {
  if (!styles) return false

  const relativeStyles = styles as RadioButtonRelativeStyles

  return Boolean(relativeStyles?.checked || relativeStyles?.unchecked)
}

export const getIsRadioButtonClassNamesRelative = (
  classNames?: RadioButtonClassNames
): classNames is RadioButtonRelativeClassNames => {
  if (!classNames) return false

  const relativeClassNames = classNames as RadioButtonRelativeClassNames

  return Boolean(
    relativeClassNames?.default ||
      relativeClassNames?.checked ||
      relativeClassNames?.unchecked
  )
}

export const getStyles = (
  styles?: RadioButtonStyles,
  disabled?: boolean,
  checked?: boolean
) => {
  if (!styles) return

  return mergeObjects(
    styles,
    getIsRadioButtonStyleRelative(styles)
      ? mergeObjects(
          disabled && styles?.disabled
            ? styles?.disabled
            : checked
            ? styles?.checked
            : styles?.unchecked
        )
      : styles
  )
}

export const getClassNames = (
  classNames?: RadioButtonClassNames,
  disabled?: boolean,
  checked?: boolean
) => {
  if (!classNames) return

  return getIsRadioButtonClassNamesRelative(classNames)
    ? cn(
        classNames?.default,
        disabled && classNames.disabled
          ? classNames.disabled
          : checked
          ? classNames?.checked
          : classNames?.unchecked
      )
    : classNames
}
