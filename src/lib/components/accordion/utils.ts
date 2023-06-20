import {
  AccordionIndicator,
  AccordionItemStyleable,
  AccordionRelativeIndicator,
  AccordionRelativeIndicatorStyleable,
} from '@lib/components/accordion/types'
import { CSSProperties } from 'react'

export const getIsIndicatorRelative = (
  indicator?: AccordionIndicator
): indicator is AccordionRelativeIndicator => {
  if (!indicator) return false

  const relativeIndicator = indicator as AccordionRelativeIndicator

  return Boolean(
    typeof indicator === 'object' &&
      relativeIndicator.expanded &&
      relativeIndicator.collapsed
  )
}

export const getIsIndicatorStylesRelative = (
  style?: AccordionItemStyleable<CSSProperties>['indicator']
): style is AccordionRelativeIndicatorStyleable<CSSProperties> => {
  if (!style) return false

  const relativeStyleable =
    style as AccordionRelativeIndicatorStyleable<CSSProperties>

  return Boolean(
    relativeStyleable?.default ||
      relativeStyleable?.collapsed ||
      relativeStyleable?.expanded
  )
}
