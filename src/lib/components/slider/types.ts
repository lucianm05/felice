import { Orientation } from '@lib/types'

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
