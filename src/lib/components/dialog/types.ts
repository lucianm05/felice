import { CSSProperties, HTMLProps, ReactNode } from 'react'

export type DialogTriggerRef = HTMLButtonElement | null

interface DialogState {
  open: boolean
}

interface DialogActions {
  open: VoidFunction
  close: VoidFunction
}

export type DialogCloseButton =
  | ReactNode
  | ((params: {
      buttonProps: {
        type: 'button'
        onClick: HTMLProps<HTMLButtonElement>['onClick']
      }
    }) => JSX.IntrinsicElements['button'])

export type DialogContent =
  | ReactNode
  | ((params: { state: DialogState; actions: DialogActions }) => (ReactNode))

export interface DialogStyleable<T> {
  root?: T
  header?: T
  title?: T
  description?: T
  overlay?: T
  trigger?: T
  closeButton?: T
}

export type DialogStyles = CSSProperties

export type DialogClassNames = string
