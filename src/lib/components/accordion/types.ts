import { CSSProperties, ReactNode } from 'react'

export type AccordionRef = HTMLDivElement | null

interface AccordionItemState {
  expanded: boolean
}

export interface AccordionItem {
  header: ReactNode
  content: ReactNode
}

export interface AccordionItemStyleable<T, R> {
  item?: T
  header?: T
  trigger?: T
  content?: T
  indicator?: R
}

export interface AccordionStyleable<T, R> extends AccordionItemStyleable<T, R> {
  root?: T
}

export interface AccordionIndicatorRelative<T> {
  expanded?: T
  collapsed?: T
}

export type AccordionIndicatorRelativeStyles =
  AccordionIndicatorRelative<CSSProperties>
export type AccordionIndicatorStyles =
  | CSSProperties
  | AccordionIndicatorRelativeStyles

export interface AccordionIndicatorRelativeClassNames
  extends AccordionIndicatorRelative<string> {
  default?: string
}
export type AccordionIndicatorClassNames =
  | string
  | AccordionIndicatorRelativeClassNames

interface AccordionIndicatorRenderProps {
  className?: string
  styles?: CSSProperties
  'aria-hidden': true
  'data-expanded': boolean
}
interface AccordionIndicatorRenderParams {
  state: AccordionItemState
  indicatorProps: AccordionIndicatorRenderProps
}
export type AccordionIndicator =
  | ReactNode
  | ((params: AccordionIndicatorRenderParams) => ReactNode)
