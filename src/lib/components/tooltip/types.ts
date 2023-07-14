import {
  CSSProperties,
  FocusEvent,
  MouseEvent,
  MutableRefObject,
  ReactNode,
} from 'react'

export type HasEnoughSpaceMap = Record<TooltipSide, boolean>

export type TooltipTriggerRef = HTMLButtonElement | null
export type TooltipContainerRef = HTMLDivElement | null
export type TooltipContentRef = HTMLDivElement | null

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipPosition {
  top?: number
  left?: number
  paddingTop?: string
  paddingBottom?: string
  paddingRight?: string
  paddingLeft?: string
  marginTop?: string
  marginLeft?: string
}

export interface TooltipTriggerProps {
  ref: MutableRefObject<TooltipTriggerRef>
  type: 'button'
  style?: CSSProperties
  className?: string
  tabIndex: number
  onFocus: (event: FocusEvent<HTMLButtonElement>) => void
  onBlur: (event: FocusEvent<HTMLButtonElement>) => void
  onMouseEnter: (event: MouseEvent<HTMLButtonElement>) => void
  onMouseLeave: (event: MouseEvent<HTMLButtonElement>) => void
  'aria-describedby': string | undefined
  'data-open': boolean
}
export interface TooltipState {
  open: boolean
}

export type TooltipChildren =
  | ReactNode
  | ((params: {
      triggerProps: TooltipTriggerProps
      state: TooltipState
    }) => JSX.IntrinsicElements['button'])

export interface TooltipStyleable<T> {
  trigger?: T
  content?: T
  container?: T
}

export type TooltipStyles = CSSProperties
export type TooltipClassNames = string
