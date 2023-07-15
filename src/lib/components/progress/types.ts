import { CSSProperties, ReactNode } from 'react'

export interface ProgressState {
  value: number
  percentageValue: number
}
export interface ProgressStyleable<T> {
  root?: T
  indicator?: T
}

export type ProgressStyles = ProgressStyleable<CSSProperties>

export type ProgressClassNames = ProgressStyleable<string>

interface ProgressIndicatorRenderProps {
  style?: CSSProperties
  className?: string
  'aria-hidden': true
  'data-min': number
  'data-max': number
  'data-value': number
}
export type ProgressChildren =
  | ReactNode
  | ((params: { indicatorProps: ProgressIndicatorRenderProps; state: ProgressState}) => ReactNode)
