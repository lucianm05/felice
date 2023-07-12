import {
  AccordionIndicatorClassNames,
  AccordionIndicatorRelativeClassNames,
  AccordionIndicatorRelativeStyles,
  AccordionIndicatorStyles,
} from '@lib/components/accordion/types'

export const getIsIndicatorStylesRelative = (
  styles?: AccordionIndicatorStyles
): styles is AccordionIndicatorRelativeStyles => {
  if (!styles) return false

  const relativeStyles = styles as AccordionIndicatorRelativeStyles

  return Boolean(relativeStyles?.collapsed || relativeStyles?.expanded)
}

export const getIsIndicatorClassNamesRelative = (
  classNames?: AccordionIndicatorClassNames
): classNames is AccordionIndicatorRelativeClassNames => {
  if (!classNames) return false

  const relativeClassNames = classNames as AccordionIndicatorRelativeClassNames

  return Boolean(
    relativeClassNames?.default ||
      relativeClassNames?.collapsed ||
      relativeClassNames?.expanded
  )
}
