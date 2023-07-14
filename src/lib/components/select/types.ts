import { CSSProperties } from 'react'

export interface SelectRelativeVisibility<T> {
  open?: T
  closed?: T
}

export type SelectVisibilityRelativeStyles =
  SelectRelativeVisibility<CSSProperties>
export type SelectVisibilityStyles =
  | CSSProperties
  | SelectVisibilityRelativeStyles

export interface SelectVisibilityRelativeClassNames
  extends SelectRelativeVisibility<string> {
  default?: string
}
export type SelectVisibilityClassNames =
  | string
  | SelectVisibilityRelativeClassNames

export interface SelectRelativeOption<T> {
  active?: T
  selected?: T
}

export type SelectOptionRelativeStyles = SelectRelativeOption<CSSProperties>
export type SelectOptionStyles = CSSProperties | SelectOptionRelativeStyles

export interface SelectOptionRelativeClassNames
  extends SelectRelativeOption<string> {
  default?: string
}
export type SelectOptionClassNames = string | SelectOptionRelativeClassNames

export interface SelectStyleable<T, O, V> {
  root?: T
  label?: T
  trigger?: V
  list?: T
  option?: O
}

export interface SelectOption {
  label: string
  value: string
}
