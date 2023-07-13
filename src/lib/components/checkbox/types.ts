import { CSSProperties, ReactNode } from 'react'

export interface CheckboxState {
  checked: boolean
  disabled: boolean
}

export interface CheckboxStyleable<T, R> {
  root?: R
  checkbox?: R
  label?: T
}
export interface CheckboxRelative<T> {
  checked?: T
  unchecked?: T
  disabled?: T
}

export type CheckboxRelativeStyle = CheckboxRelative<CSSProperties>
export type CheckboxStyle = CSSProperties | CheckboxRelativeStyle

export interface CheckboxRelativeClassNames extends CheckboxRelative<string> {
  default?: string
}
export type CheckboxClassNames = string | CheckboxRelativeClassNames

export type CheckboxIndicator =
  | ReactNode
  | ((params: { state: CheckboxState }) => ReactNode)
