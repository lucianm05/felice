import { Orientation } from '@lib/types'
import { CSSProperties } from 'react'

export interface SliderStyleable<T> {
  root?: T
  track?: T
  range?: T
  thumb?: T
}

export type SliderLabels = [string] | [string, string]
export type SliderValue = [number] | [number, number]
export type SliderOrientation = Orientation
export type SliderRef = HTMLDivElement | null

export type SliderStyles = SliderStyleable<CSSProperties>
export type SliderClassNames = SliderStyleable<string>
