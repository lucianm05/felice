import { CSSProperties, ReactNode } from 'react'

export interface CheckboxStyleable<T, R> {
  root?: T
  checkbox?: R
  label?: T
}
export interface CheckboxRelative<T> {
  checked?: T
  unchecked?: T
}

export type CheckboxRelativeStyle = CheckboxRelative<CSSProperties>
export type CheckboxStyle = CSSProperties | CheckboxRelativeStyle

export interface CheckboxRelativeClassName extends CheckboxRelative<string> {
  default?: string
}
export type CheckboxClassName = string | CheckboxRelativeClassName

export type CheckboxRelativeIndicator = CheckboxRelative<ReactNode>
export type CheckboxIndicator = CheckboxRelativeIndicator | Omit<ReactNode, ''>
