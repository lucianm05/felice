import { CSSProperties, HTMLProps, MouseEvent, ReactNode } from 'react'

export type DialogRef = HTMLDivElement | null
export type DialogTriggerRef = HTMLButtonElement | null

interface DialogState {
  open: boolean
}

interface DialogActions {
  open: VoidFunction
  close: VoidFunction
}

export type DialogChildren =
  | ReactNode
  | ((params: DialogChildrenRenderParams) => JSX.IntrinsicElements['button'])

interface CommonRenderProps {
  style?: CSSProperties
  className?: string
}

interface TriggerRenderProps extends CommonRenderProps {
  type: 'button'
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  disabled: boolean
}

interface RootRenderProps extends CommonRenderProps {
  role: 'dialog'
  'aria-modal': true
  'aria-labelledby'?: string
  'aria-describedby'?: string
}

interface OverlayRenderProps extends CommonRenderProps {
  type: 'button'
  onClick: HTMLProps<HTMLButtonElement>['onClick']
  'aria-hidden': true
  'data-overlay': true
  tabIndex: -1
}

interface TitleRenderProps extends CommonRenderProps {
  id: string
}

interface DescriptionRenderProps extends CommonRenderProps {
  id: string
}

interface CloseButtonRenderProps extends CommonRenderProps {
  type: 'button'
  onClick: HTMLProps<HTMLButtonElement>['onClick']
  'data-close-button': true
}

interface DialogChildrenRenderParams {
  state: DialogState
  actions: DialogActions
  triggerProps: TriggerRenderProps
}

interface DialogCloseButtonRenderParams {
  buttonProps: CloseButtonRenderProps
}
export type DialogCloseButton =
  | ReactNode
  | ((params: DialogCloseButtonRenderParams) => JSX.IntrinsicElements['button'])

interface DialogContentRenderParams {
  actions: DialogActions
}
export type DialogContent =
  | ReactNode
  | ((params: DialogContentRenderParams) => ReactNode)

export type DialogRenderFunction = (params: {
  rootProps: RootRenderProps
  overlayProps: OverlayRenderProps
  titleProps: TitleRenderProps
  descriptionProps: DescriptionRenderProps
  closeButtonProps: CloseButtonRenderProps
  actions: DialogActions
}) => ReactNode

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
