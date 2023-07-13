import {
  AccordionItemClassNames,
  AccordionItemRelativeClassNames,
  AccordionItemRelativeStyles,
  AccordionItemStyles,
} from '@lib/components/accordion/types'
import { cn, mergeObjects } from '@lib/utils'

export const getIsStylesRelative = (
  styles?: AccordionItemStyles
): styles is AccordionItemRelativeStyles => {
  if (!styles) return false

  const relativeStyles = styles as AccordionItemRelativeStyles

  return Boolean(relativeStyles?.collapsed || relativeStyles?.expanded)
}

export const getIsClassNamesRelative = (
  classNames?: AccordionItemClassNames
): classNames is AccordionItemRelativeClassNames => {
  if (!classNames) return false

  const relativeClassNames = classNames as AccordionItemRelativeClassNames

  return Boolean(
    relativeClassNames?.default ||
      relativeClassNames?.collapsed ||
      relativeClassNames?.expanded
  )
}

export const getStyles = (styles?: AccordionItemStyles, expanded?: boolean) => {
  return mergeObjects(
    styles,
    getIsStylesRelative(styles)
      ? expanded
        ? styles?.expanded
        : styles?.collapsed
      : undefined
  )
}

export const getClassNames = (
  classNames?: AccordionItemClassNames,
  expanded?: boolean
) => {
  return cn(
    getIsClassNamesRelative(classNames)
      ? cn(
          classNames?.default,
          expanded ? classNames?.expanded : classNames?.collapsed
        )
      : classNames
  )
}
