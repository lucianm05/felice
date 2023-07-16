import { CSSProperties } from 'react'

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
export type CheckboxInternalStyles = CSSProperties | CheckboxRelativeStyle

export interface CheckboxRelativeClassNames extends CheckboxRelative<string> {
  default?: string
}
export type CheckboxInternalClassNames = string | CheckboxRelativeClassNames

export type CheckboxStyles = CheckboxStyleable<
  CSSProperties,
  CheckboxInternalStyles
>
export type CheckboxClassNames = CheckboxStyleable<
  string,
  CheckboxInternalClassNames
>
