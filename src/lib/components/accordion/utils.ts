import {
  AccordionItemInternalClassNames,
  AccordionItemRelativeClassNames,
  AccordionItemRelativeStyles,
  AccordionItemInternalStyles,
} from '@lib/components/accordion/types'
import { cn, mergeObjects } from '@lib/utils'

export const getIsStylesRelative = (
  styles?: AccordionItemInternalStyles
): styles is AccordionItemRelativeStyles => {
  if (!styles) return false

  const relativeStyles = styles as AccordionItemRelativeStyles

  return Boolean(relativeStyles?.collapsed || relativeStyles?.expanded)
}

export const getIsClassNamesRelative = (
  classNames?: AccordionItemInternalClassNames
): classNames is AccordionItemRelativeClassNames => {
  if (!classNames) return false

  const relativeClassNames = classNames as AccordionItemRelativeClassNames

  return Boolean(
    relativeClassNames?.default ||
      relativeClassNames?.collapsed ||
      relativeClassNames?.expanded
  )
}

export const getStyles = (
  styles?: AccordionItemInternalStyles,
  expanded?: boolean,
  disabled?: boolean
) => {
  return mergeObjects(
    styles,
    getIsStylesRelative(styles)
      ? mergeObjects(
          expanded ? styles?.expanded : styles?.collapsed,
          disabled ? styles?.disabled : undefined
        )
      : undefined
  )
}

export const getClassNames = (
  classNames?: AccordionItemInternalClassNames,
  expanded?: boolean,
  disabled?: boolean
) => {
  return cn(
    getIsClassNamesRelative(classNames)
      ? cn(
          classNames?.default,
          expanded ? classNames?.expanded : classNames?.collapsed,
          disabled ? classNames?.disabled : undefined
        )
      : classNames
  )
}
