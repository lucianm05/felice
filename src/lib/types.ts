import { CSSProperties, ReactNode } from 'react'

export type SequenceDirection = 'forward' | 'backward'

export type Orientation = 'horizontal' | 'vertical'

export interface CommonRenderParams {
  style?: CSSProperties
  className?: string
}

export interface CheckableState {
  checked: boolean
  disabled: boolean
}

export type CheckableChildren =
  | ReactNode
  | ((params: { state: CheckableState }) => ReactNode)
