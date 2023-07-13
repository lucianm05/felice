import {
  SelectOptionClassNames,
  SelectOptionRelativeClassNames,
  SelectOptionRelativeStyles,
  SelectOptionStyles,
  SelectVisibilityClassNames,
  SelectVisibilityRelativeClassNames,
  SelectVisibilityRelativeStyles,
  SelectVisibilityStyles,
} from '@lib/components/select/types'

export const getIsVisibilityStylesRelative = (
  styles?: SelectVisibilityStyles
): styles is SelectVisibilityRelativeStyles => {
  if (!styles) return false

  const relativeStyles = styles as SelectVisibilityRelativeStyles

  return Boolean(relativeStyles?.closed || relativeStyles?.open)
}

export const getIsVisiblityClassNamesRelative = (
  classNames?: SelectVisibilityClassNames
): classNames is SelectVisibilityRelativeClassNames => {
  if (!classNames) return false

  const relativeClassNames = classNames as SelectVisibilityRelativeClassNames

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
