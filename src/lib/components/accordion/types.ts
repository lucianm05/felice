import { ReactNode } from 'react'

export interface AccordionItem {
  header: ReactNode
  content: ReactNode
}

export interface AccordionItemStyleable<T> {
  item?: T
  header?: T
  trigger?: T
  content?: T
  indicator?: T | AccordionRelativeIndicatorStyleable<T>
}

export interface AccordionStyleable<T> extends AccordionItemStyleable<T> {
  root?: T
}

export interface AccordionRelativeIndicatorStyleable<T> {
  default?: T
  expanded?: T
  collapsed?: T
}
export type AccordionRelativeIndicator = {
  expanded: ReactNode
  collapsed: ReactNode
}
export type AccordionIndicator =
  | AccordionRelativeIndicator
  | Omit<ReactNode, ''>
