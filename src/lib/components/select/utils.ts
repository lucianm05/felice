import {
  SelectOptionClassNames,
  SelectOptionRelativeClassNames,
  SelectOptionRelativeStyles,
  SelectOptionStyles,
  SelectTriggerClassNames,
  SelectTriggerRelativeClassNames,
  SelectTriggerRelativeStyles,
  SelectTriggerStyles,
} from '@lib/components/select/types'

export const getIsVisibilityStylesRelative = (
  styles?: SelectTriggerStyles
): styles is SelectTriggerRelativeStyles => {
  if (!styles) return false

  const relativeStyles = styles as SelectTriggerRelativeStyles

  return Boolean(relativeStyles?.closed || relativeStyles?.open)
}

export const getIsVisiblityClassNamesRelative = (
  classNames?: SelectTriggerClassNames
): classNames is SelectTriggerRelativeClassNames => {
  if (!classNames) return false

  const relativeClassNames = classNames as SelectTriggerRelativeClassNames

  return Boolean(
    relativeClassNames?.default ||
      relativeClassNames?.closed ||
      relativeClassNames?.open
  )
}

export const getIsOptionStylesRelative = (
  styles?: SelectOptionStyles
): styles is SelectOptionRelativeStyles => {
  if (!styles) return false

  const relativeStyles = styles as SelectOptionRelativeStyles

  return Boolean(relativeStyles?.active || relativeStyles?.selected)
}

export const getIsOptionClassNamesRelative = (
  classNames?: SelectOptionClassNames
): classNames is SelectOptionRelativeClassNames => {
  if (!classNames) return false

  const relativeClassNames = classNames as SelectOptionRelativeClassNames

  return Boolean(
    relativeClassNames?.default ||
      relativeClassNames?.active ||
      relativeClassNames?.selected
  )
}
