import { CSSProperties, HTMLProps, ReactNode } from 'react'

export interface RadioButtonState {
  checked: boolean
}

export interface RadioButton
  extends Omit<HTMLProps<HTMLDivElement>, 'content' | 'label' | 'checked'> {
  value: string
  label?: ReactNode
  description?: ReactNode
  content?: ReactNode | ((state: RadioButtonState) => JSX.Element)
  disabled?: boolean
  styles?: RadioButtonStyleable<CSSProperties, RadioButtonStyles>
  classNames?: RadioButtonStyleable<string, RadioButtonClassName>
  renderChildren?: (params: {
    labelProps: { id: string }
    descriptionProps: { id: string }
    state: RadioButtonState
  }) => JSX.Element
}

export interface RadioButtonStyleable<T, R> {
  root?: R
  textContainer?: T
  label?: T
  description?: T
}

export interface RadioButtonRelative<T> {
  checked?: T
  unchecked?: T
  disabled?: T
}

export type RadioButtonRelativeStyles = RadioButtonRelative<CSSProperties>
export type RadioButtonStyles = CSSProperties | RadioButtonRelativeStyles

export interface RadioButtonRelativeClassName
  extends RadioButtonRelative<string> {
  default?: string
}
export type RadioButtonClassName = string | RadioButtonRelativeClassName

export interface RadioGroupStyleable<T, R> {
  root?: T
  radioButton?: RadioButtonStyleable<T, R>
}
