import {
  DialogChildren,
  DialogClassNames,
  DialogCloseButton,
  DialogContent,
  DialogRef,
  DialogRenderFunction,
  DialogStyles,
  DialogTriggerRef,
} from '@lib/components/dialog/types'
import { getFocusableElements } from '@lib/components/dialog/utils'
import { Portal } from '@lib/components/portal'
import { keys } from '@lib/constants/keys'
import { usePreventScroll } from '@lib/hooks/usePreventScroll'
import { useUpdateInternalOnExternalChange } from '@lib/hooks/useUpdateInternalOnExternalChange'
import { cn, isDefined, mergeObjects } from '@lib/utils'
import {
  HTMLProps,
  MouseEvent as ReactMouseEvent,
  MutableRefObject,
  ReactNode,
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
export interface DialogProps
  extends Omit<HTMLProps<HTMLDivElement>, 'title' | 'content' | 'children'> {
  children?: DialogChildren
  triggerRef?: MutableRefObject<DialogTriggerRef>
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: ReactNode
  description?: ReactNode
  content?: DialogContent
  closeButton?: DialogCloseButton
  styles?: DialogStyles
  classNames?: DialogClassNames
  render?: DialogRenderFunction
}

export const Dialog = forwardRef<DialogRef, DialogProps>(
  (
    {
      children,
      triggerRef,
      defaultOpen = false,
      open: externalOpen,
      onOpenChange,
      title,
      description,
      content,
      closeButton,
      style,
      styles,
      className,
      classNames,
      render,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(() => {
      if (isDefined(externalOpen)) return externalOpen

      return defaultOpen
    })

    const open = isDefined(externalOpen) ? externalOpen : internalOpen

    const setInternalOpenHandler = (
      value: boolean,
      event?: ReactMouseEvent
    ) => {
      if (event?.defaultPrevented || disabled) return

      setInternalOpen(value)
      onOpenChange?.(value)

      if (internalTriggerRef.current && !value) {
        internalTriggerRef.current?.focus()
      }
    }

    const internalTriggerRef = useRef<DialogTriggerRef>(null)
    const internalRef = useRef<DialogRef>(null)

    useImperativeHandle<DialogRef, DialogRef>(ref, () => internalRef.current, [
      open,
    ])

    useImperativeHandle<DialogTriggerRef, DialogTriggerRef>(
      triggerRef,
      () => internalTriggerRef.current,
      []
    )

    const titleId = useId()
    const descriptionId = useId()

    const triggerProps = {
      ref: internalTriggerRef,
      type: 'button',
      onClick: (event: ReactMouseEvent<HTMLButtonElement>) =>
        setInternalOpenHandler(true, event),
      style: styles?.trigger,
      className: classNames?.trigger,
      disabled,
      'data-disabled': disabled,
    } as const

    const rootProps = {
      ...props,
      ref: internalRef,
      role: 'dialog',
      style: mergeObjects(style, styles?.root),
      className: cn(className, classNames?.root),
      'aria-modal': true,
      'aria-labelledby': titleId,
      'aria-describedby': descriptionId,
    } as const

    const overlayProps = {
      type: 'button',
      style: styles?.overlay,
      className: classNames?.overlay,
      onClick: (event: ReactMouseEvent<HTMLButtonElement>) =>
        setInternalOpenHandler(false, event),
      'aria-hidden': true,
      'data-overlay': true,
      tabIndex: -1,
    } as const

    const headerProps = {
      style: styles?.header,
      className: classNames?.header,
    } as const

    const closeButtonProps = {
      type: 'button',
      onClick: (event: ReactMouseEvent<HTMLButtonElement>) =>
        setInternalOpenHandler(false, event),
      style: styles?.closeButton,
      className: classNames?.closeButton,
      'data-close-button': true,
    } as const

    const titleProps = {
      id: titleId,
      style: styles?.title,
      className: classNames?.title,
    } as const

    const descriptionProps = {
      id: descriptionId,
      style: styles?.description,
      className: classNames?.description,
    } as const

    const actions = {
      open: () => setInternalOpenHandler(true),
      close: () => setInternalOpenHandler(false),
    } as const

    const onWindowKeyDown = (event: KeyboardEvent) => {
      if (event.key === keys.escape) {
        setInternalOpenHandler(false)
        return
      }

      if (!internalRef.current) return

      const { firstFocusableElement, lastFocusableElement } =
        getFocusableElements(internalRef.current) || []

      if (event.ctrlKey || event.altKey || event.key !== keys.tab) return

      if (!firstFocusableElement && !lastFocusableElement) {
        event.preventDefault()
        return
      }

      if (!event.shiftKey && event.target === lastFocusableElement) {
        event.preventDefault()
        firstFocusableElement.focus()
        return
      }

      if (event.shiftKey && event.target === firstFocusableElement) {
        event.preventDefault()
        lastFocusableElement.focus()
        return
      }
    }

    const onWindowClick = (event: MouseEvent) => {
      if (
        !open ||
        event.target === internalTriggerRef.current ||
        !internalRef.current ||
        !event.target
      )
        return

      if (!internalRef.current.contains(event.target as Node))
        setInternalOpenHandler(false)
    }

    useEffect(() => {
      if (open) {
        window.addEventListener('keydown', onWindowKeyDown)
        window.addEventListener('click', onWindowClick)

        if (internalRef.current) {
          const { firstFocusableElement } = getFocusableElements(
            internalRef.current,
            'button:not([data-close-button="true"])'
          )

          firstFocusableElement?.focus()
        }
      }

      if (!open) {
        window.removeEventListener('keydown', onWindowKeyDown)
        window.removeEventListener('click', onWindowClick)
      }

      return () => {
        window.removeEventListener('keydown', onWindowKeyDown)
        window.removeEventListener('click', onWindowClick)
      }
    }, [open])

    usePreventScroll(open)

    useUpdateInternalOnExternalChange({
      setInternalValue: setInternalOpen,
      defaultValue: defaultOpen,
      externalValue: externalOpen,
    })

    return (
      <>
        {typeof children !== 'function' && (
          <button {...triggerProps}>{children}</button>
        )}

        {typeof children === 'function' &&
          children({ triggerProps, state: { open }, actions })}

        <Portal>
          {open && (
            <>
              {typeof render === 'function' &&
                render({
                  closeButtonProps,
                  descriptionProps,
                  overlayProps,
                  rootProps,
                  titleProps,
                  actions,
                })}

              {typeof render !== 'function' && (
                <div>
                  <button {...overlayProps} />

                  <div {...rootProps}>
                    <div {...headerProps}>
                      {title && <h2 {...titleProps}>{title}</h2>}

                      {closeButton && (
                        <>
                          {typeof closeButton === 'function' &&
                            closeButton({
                              buttonProps: closeButtonProps,
                            })}

                          {typeof closeButton !== 'function' && (
                            <button {...closeButtonProps}>{closeButton}</button>
                          )}
                        </>
                      )}
                    </div>

                    {description && <p {...descriptionProps}>{description}</p>}

                    {content && (
                      <>
                        {typeof content === 'function' &&
                          content({
                            actions,
                          })}

                        {typeof content !== 'function' && content}
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </Portal>
      </>
    )
  }
)
Dialog.displayName = 'FeliceDialog'
