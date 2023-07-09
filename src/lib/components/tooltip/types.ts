import { ReactNode } from 'react'

export type HasEnoughSpaceMap = Record<TooltipSide, boolean>

export type TooltipTriggerRef = HTMLButtonElement | null
export type TooltipContentRef = HTMLDivElement | null

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipContentPosition {
  top?: number
  left?: number
}

export interface TooltipState {
  open: boolean
}

export type TooltipChildren =
  | ReactNode
  | ((params: {
      triggerProps: object
      state: TooltipState
    }) => JSX.IntrinsicElements['button'])

export interface TooltipStyleable<T, R> {
  trigger?: T
  content?: R
}

export interface TooltipRelative<T> {
  open?: T
  closed?: T
  disabled?: T
}

export interface TooltipRelativeClassName extends TooltipRelative<string> {
  default?: string
}

export type TooltipClassName = string | TooltipRelativeClassName
