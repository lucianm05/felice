import { CSSProperties } from 'react'

export interface SwitchRelative<T = unknown> {
  checked?: T
  unchecked?: T
  disabled?: T
}

export type SwitchRelativeStyle = SwitchRelative<CSSProperties>
export type SwitchStyle = SwitchRelativeStyle | CSSProperties

export interface SwitchRelativeClassNames extends SwitchRelative<string> {
  default?: string
}
export type SwitchClassNames = SwitchRelativeClassNames | string

export interface SwitchStyleable<T> {
  switch?: T
  thumb?: T
}
