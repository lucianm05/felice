import { CSSProperties } from 'react'

export interface ProgressStyleable<T> {
  root?: T
  indicator?: T
}

export type ProgressStyles = ProgressStyleable<CSSProperties>

export type ProgressClassNames = ProgressStyleable<string>
