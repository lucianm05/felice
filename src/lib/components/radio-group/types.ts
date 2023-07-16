import {
  CSSProperties,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react'

export interface RadioButtonState {
  checked?: boolean
  disabled?: boolean
}

export interface CommonRenderProps {
  style?: CSSProperties
  className?: string
  'data-disabled': boolean
  'data-checked': boolean
}

interface RootRenderProps extends CommonRenderProps {}

export interface ButtonHandlers {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  onFocus: (event: FocusEvent<HTMLButtonElement>) => void
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void
}

interface ButtonRenderProps extends CommonRenderProps, ButtonHandlers {
  id: string
  role: 'radio'
  type: 'button'
  style?: CSSProperties
  className?: string
  disabled?: boolean
  'aria-labelledby': string
  'aria-describedby': string
  'aria-checked': boolean
  'aria-disabled': boolean
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

export interface RadioButton {
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
