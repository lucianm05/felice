import { CSSProperties, HTMLProps, ReactNode } from 'react'

export interface RadioButtonState {
  checked?: boolean
  disabled?: boolean
}

interface CommonRenderProps {
  style?: CSSProperties
  className?: string
}

interface RootRenderProps extends CommonRenderProps {
  'data-disabled'?: boolean
  'data-checked'?: boolean
}

interface ButtonRenderProps extends HTMLProps<HTMLButtonElement> {
  id: string
  role: 'radio'
  type: 'button'
}

interface LabelRenderProps extends CommonRenderProps {
  id: string
  htmlFor: string
}

interface DescriptionRenderProps extends CommonRenderProps {
  id: string
}

type RadioButtonRenderFunction = (params: {
  state: RadioButtonState
  rootProps: RootRenderProps
  buttonProps: ButtonRenderProps
  textContainerProps: CommonRenderProps
  labelProps: LabelRenderProps
  descriptionProps: DescriptionRenderProps
}) => JSX.Element

export interface RadioButton
  extends Omit<HTMLProps<HTMLButtonElement>, 'label' | 'checked'> {
  value: string
  label?: ReactNode
  description?: ReactNode
  disabled?: boolean
  styles?: RadioButtonStyleable<CSSProperties, RadioButtonStyles>
  classNames?: RadioButtonStyleable<string, RadioButtonClassNames>
  render?: RadioButtonRenderFunction
}

export interface RadioButtonStyleable<T, R> {
  root?: R
  button?: R
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

export interface RadioButtonRelativeClassNames
  extends RadioButtonRelative<string> {
  default?: string
}
export type RadioButtonClassNames = string | RadioButtonRelativeClassNames

export interface RadioGroupStyleable<T, R> {
  root?: T
  radioButton?: RadioButtonStyleable<T, R>
}
