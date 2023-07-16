import { CSSProperties } from 'react'

export interface SwitchRelative<T = unknown> {
  checked?: T
  unchecked?: T
  disabled?: T
}

export type SwitchRelativeStyles = SwitchRelative<CSSProperties>
export type SwitchInternalStyles = SwitchRelativeStyles | CSSProperties

export interface SwitchRelativeClassNames extends SwitchRelative<string> {
  default?: string
}
export type SwitchInternalClassNames = SwitchRelativeClassNames | string

export interface SwitchStyleable<T, R> {
  root?: T
  label?: T
  switch?: R
  thumb?: R
}

export type SwitchStyles = SwitchStyleable<CSSProperties, SwitchInternalStyles>
export type SwitchClassNames = SwitchStyleable<string, SwitchInternalClassNames>
