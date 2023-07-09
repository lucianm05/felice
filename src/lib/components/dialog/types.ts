import { CSSProperties, HTMLProps, ReactNode } from 'react'

export type DialogTriggerRef = HTMLButtonElement | null

export type DialogCloseButton =
  | ReactNode
  | ((params: {
      buttonProps: {
        type: 'button'
        onClick: HTMLProps<HTMLButtonElement>['onClick']
      }
    }) => JSX.IntrinsicElements['button'])

export interface DialogStyleable<T> {
  root?: T
  header?: T
  title?: T
  description?: T
  overlay?: T
}

export type DialogStyles = CSSProperties

export type DialogClassNames = string
