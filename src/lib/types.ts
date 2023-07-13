import { CSSProperties } from "react"

export type SequenceDirection = 'forward' | 'backward'

export type Orientation = 'horizontal' | 'vertical'

export interface CommonRenderParams {
  style?: CSSProperties
  className?: string
}