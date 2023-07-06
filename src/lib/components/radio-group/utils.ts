import {
  RadioButtonClassName,
  RadioButtonRelativeClassName,
  RadioButtonRelativeStyles,
  RadioButtonStyles,
} from '@lib/components/radio-group/types'

export const isRadioButtonStyleRelative = (
  styles?: RadioButtonStyles
): styles is RadioButtonRelativeStyles => {
  if (!styles) return false

  const relativeStyles = styles as RadioButtonRelativeStyles

  return Boolean(relativeStyles?.checked || relativeStyles?.unchecked)
}

export const isRadioButtonClassNamesRelative = (
  className?: RadioButtonClassName
): className is RadioButtonRelativeClassName => {
  if (!className) return false

  const relativeClassName = className as RadioButtonRelativeClassName

  return Boolean(
    relativeClassName?.default ||
      relativeClassName?.checked ||
      relativeClassName?.unchecked
  )
}
