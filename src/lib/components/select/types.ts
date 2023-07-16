import { CSSProperties, HTMLProps } from 'react'

export type SelectRef = HTMLDivElement | null

export interface SelectRelativeTrigger<T> {
  open?: T
  closed?: T
  disabled?: T
}

export type SelectTriggerRelativeStyles = SelectRelativeTrigger<CSSProperties>
export type SelectTriggerStyles = CSSProperties | SelectTriggerRelativeStyles

export interface SelectTriggerRelativeClassNames
  extends SelectRelativeTrigger<string> {
  default?: string
}
export type SelectTriggerClassNames = string | SelectTriggerRelativeClassNames

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

export type SelectStyles = SelectStyleable<
  CSSProperties,
  SelectOptionStyles,
  SelectTriggerStyles
>
export type SelectClassNames = SelectStyleable<
  string,
  SelectOptionClassNames,
  SelectTriggerClassNames
>

export interface SelectOption {
  label: string
  value: string
}

export interface SelectTriggerRenderProps
  extends Pick<
      HTMLProps<HTMLButtonElement>,
      | 'aria-controls'
      | 'aria-expanded'
      | 'aria-labelledby'
      | 'aria-activedescendant'
      | 'aria-label'
      | 'aria-haspopup'
      | 'className'
      | 'style'
      | 'disabled'
      | 'aria-disabled'
    >,
    Required<
      Pick<
        HTMLProps<HTMLButtonElement>,
        'id' | 'ref' | 'onClick' | 'onBlur' | 'onKeyDown' | 'tabIndex'
      >
    > {
  type: 'button'
  'data-disabled': boolean
}

export interface SelectTriggerRenderFunctionParams {
  triggerProps: SelectTriggerRenderProps
  selectedOption?: SelectOption
}
export type SelectTriggerRenderFunction = (
  params: SelectTriggerRenderFunctionParams
) => JSX.IntrinsicElements['button']

export interface SelectOptionRenderProps
  extends Pick<HTMLProps<HTMLLIElement>, 'className' | 'style'>,
    Required<
      Pick<
        HTMLProps<HTMLLIElement>,
        | 'id'
        | 'role'
        | 'tabIndex'
        | 'aria-selected'
        | 'onClick'
        | 'onMouseDown'
        | 'onMouseEnter'
      >
    > {}

export interface SelectOptionRenderFunctionParams {
  optionProps: SelectOptionRenderProps
  option: SelectOption
  index: number
}
export type SelectOptionRenderFunction = (
  params: SelectOptionRenderFunctionParams
) => JSX.IntrinsicElements['li']
