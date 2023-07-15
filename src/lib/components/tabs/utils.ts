import {
  Tab,
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

export const getTabIndex = (
  index: number,
  data: Tab[],
  currentTab: number,
  groupDisabled: boolean
) => {
  const isSelected = index === currentTab

  const currentElement = data[currentTab]

  const isCurrentElementDisabled = isItemDisabled(
    groupDisabled,
    currentElement.elementProps
  )

  if (isCurrentElementDisabled) {
    const firstEnabledIndex = data.findIndex(
      element => !isItemDisabled(groupDisabled, element.elementProps)
    )

    if (firstEnabledIndex >= 0) return index === firstEnabledIndex ? 0 : -1
  }

  return isSelected ? 0 : -1
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
