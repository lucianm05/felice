import { CSSProperties, ReactNode } from 'react'

export interface CheckboxRelative<T> {
  checked?: T
  unchecked?: T
}

export type CheckboxRelativeStyle = CheckboxRelative<CSSProperties>
export type CheckboxStyle = CheckboxRelativeStyle | CSSProperties

export interface CheckboxRelativeClassNames extends CheckboxRelative<string> {
  default?: string
}
export type CheckboxClassNames = CheckboxRelativeClassNames | string

export type CheckboxRelativeIndicator = CheckboxRelative<ReactNode>
export type CheckboxIndicator = CheckboxRelativeIndicator | Omit<ReactNode, ''>
