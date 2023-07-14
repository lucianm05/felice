import {
  TabElementClassNames,
  TabElementProps,
  TabElementRelativeClassNames,
  TabElementRelativeStyles,
  TabElementStyles,
  TabPanelProps,
} from '@lib/components/tabs/types'
import { cn, isDefined, mergeObjects } from '@lib/utils'

export const isItemDisabled = (
  disabled?: boolean,
  itemProps?: TabElementProps | TabPanelProps
) => {
  if (isDefined(itemProps?.disabled)) return Boolean(itemProps?.disabled)

  return Boolean(disabled)
}

export const getIsTabElementStylesRelative = (
  styles?: TabElementStyles
): styles is TabElementRelativeStyles => {
  if (!styles) return false

  const relativeStyles = styles as TabElementRelativeStyles

  return Boolean(relativeStyles?.default || relativeStyles?.selected)
}

export const getIsTabElementClassNamesRelative = (
  classNames?: TabElementClassNames
): classNames is TabElementRelativeClassNames => {
  if (!classNames) return false

  const relativeClassNames = classNames as TabElementRelativeClassNames

  return Boolean(relativeClassNames?.default || relativeClassNames?.selected)
}

export const getTabElementStyles = (
  styles?: TabElementStyles,
  disabled?: boolean,
  selected?: boolean
) => {
  if (!styles) return

  return mergeObjects(
    styles,
    getIsTabElementStylesRelative(styles)
      ? mergeObjects(
          disabled && styles?.disabled
            ? styles?.disabled
            : selected
            ? styles?.selected
            : undefined
        )
      : styles
  )
}

export const getTabElementClassNames = (
  classNames?: TabElementClassNames,
  disabled?: boolean,
  selected?: boolean
) => {
  if (!classNames) return

  return getIsTabElementClassNamesRelative(classNames)
    ? cn(
        classNames?.default,
        disabled && classNames.disabled
          ? classNames.disabled
          : selected && classNames?.selected
      )
    : classNames
}
