import { CommonRenderParams } from '@lib/types'
import { CSSProperties, MouseEvent, ReactNode } from 'react'

export type AccordionRef = HTMLDivElement | null

export interface AccordionItemState {
  expanded: boolean
}

interface AccordionItemDataAttributes {
  'data-expanded': boolean
  'data-disabled': boolean
}

export type AccordionType = 'single' | 'multiple'

export interface AccordionItem {
  header?: ReactNode
  content?: ReactNode
  disabled?: boolean
  styles?: AccordionItemStyles
  classNames?: AccordionItemClassNames
  render?: AccordionItemRenderFunction
}

export interface AccordionItemStyleable<T, R> {
  item?: T
  header?: T
  trigger?: R
  indicator?: R
  content?: T
}

export interface AccordionStyleable<T, R> extends AccordionItemStyleable<T, R> {
  root?: T
}

export interface AccordionItemRelative<T> {
  expanded?: T
  collapsed?: T
  disabled?: T
}

export type AccordionItemRelativeStyles = AccordionItemRelative<CSSProperties>
export type AccordionItemInternalStyles =
  | CSSProperties
  | AccordionItemRelativeStyles

export interface AccordionItemRelativeClassNames
  extends AccordionItemRelative<string> {
  default?: string
}
export type AccordionItemInternalClassNames =
  | string
  | AccordionItemRelativeClassNames

export type AccordionItemStyles = AccordionItemStyleable<
  CSSProperties,
  AccordionItemInternalStyles
>
export type AccordionItemClassNames = AccordionItemStyleable<
  string,
  AccordionItemInternalClassNames
>

export type AccordionStyles = AccordionStyleable<
  CSSProperties,
  AccordionItemInternalStyles
>
export type AccordionClassNames = AccordionStyleable<
  string,
  AccordionItemInternalClassNames
>

interface AccordionIndicatorRenderProps
  extends CommonRenderParams,
    AccordionItemDataAttributes {
  'aria-hidden': true
}
interface AccordionIndicatorRenderParams {
  state: AccordionItemState
  indicatorProps: AccordionIndicatorRenderProps
}
export type AccordionIndicator =
  | ReactNode
  | ((params: AccordionIndicatorRenderParams) => ReactNode)

interface AccordionItemHeaderRenderParams
  extends CommonRenderParams,
    AccordionItemDataAttributes {
  id: string
}

interface AccordionItemTriggerRenderParams
  extends CommonRenderParams,
    AccordionItemDataAttributes {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  'aria-expanded': boolean
  'aria-controls': string
  'aria-disabled': boolean
}

interface AccordionItemContentRenderParams
  extends CommonRenderParams,
    AccordionItemDataAttributes {
  id: string
  role: 'region'
  hidden: boolean
  'aria-hidden': boolean
  'aria-labelledby': string
}

export type AccordionItemRenderFunction = (params: {
  rootProps: CommonRenderParams
  headerProps: AccordionItemHeaderRenderParams
  triggerProps: AccordionItemTriggerRenderParams
  contentProps: AccordionItemContentRenderParams
  state: AccordionItemState
}) => ReactNode
