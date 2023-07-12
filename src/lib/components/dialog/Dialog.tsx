import {
  DialogChildren,
  DialogClassNames,
  DialogCloseButton,
  DialogContent,
  DialogRef,
  DialogRenderFunction,
  DialogStyleable,
  DialogStyles,
  DialogTriggerRef,
} from '@lib/components/dialog/types'
import { getFocusableElements } from '@lib/components/dialog/utils'
import { Portal } from '@lib/components/portal'
import { keys } from '@lib/constants/keys'
import { usePreventScroll } from '@lib/hooks/usePreventScroll'
import { cn, isDefined, mergeObjects } from '@lib/utils'
import {
  HTMLProps,
  MouseEvent,
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
  styles?: DialogStyleable<DialogStyles>
  classNames?: DialogStyleable<DialogClassNames>
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

    const setInternalOpenHandler = (value: boolean, event?: MouseEvent) => {
      if (event?.defaultPrevented || disabled) return

      setInternalOpen(value)
      onOpenChange?.(value)
    }

    const internalRef = useRef<DialogRef>(null)

    useImperativeHandle<DialogRef, DialogRef>(ref, () => internalRef.current, [
      internalRef.current,
    ])

    const titleId = useId()
    const descriptionId = useId()

    const triggerProps = {
      ref: triggerRef,
      type: 'button',
      onClick: (event: MouseEvent<HTMLButtonElement>) =>
        setInternalOpenHandler(true, event),
      style: styles?.trigger,
      className: classNames?.trigger,
      disabled,
    } as const

    const rootProps = {
      ...props,
      ref: internalRef,
      role: 'dialog',
      style: mergeObjects(style, styles?.root),
      className: cn(className, classNames?.root),
      'aria-modal': true,
      'aria-labelledby': title ? titleId : undefined,
      'aria-describedby': description ? descriptionId : undefined,
    } as const

    const overlayProps = {
      type: 'button',
      style: styles?.overlay,
      className: classNames?.overlay,
      onClick: (event: MouseEvent<HTMLButtonElement>) =>
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
      onClick: (event: MouseEvent<HTMLButtonElement>) =>
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

      if (
        event.ctrlKey ||
        event.altKey ||
        (!firstFocusableElement && !lastFocusableElement)
      )
        return

      if (event.key === keys.tab) {
        if (event.target === lastFocusableElement) {
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
    }

    useEffect(() => {
      if (open) {
        window.addEventListener('keydown', onWindowKeyDown)

        if (internalRef.current) {
          const { firstFocusableElement } = getFocusableElements(
            internalRef.current
          )

          firstFocusableElement?.focus()
        }
      }

      if (!open) {
        window.removeEventListener('keydown', onWindowKeyDown)
      }
    }, [open])

    usePreventScroll(open)

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
