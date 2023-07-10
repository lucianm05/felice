import {
  DialogClassNames,
  DialogCloseButton,
  DialogContent,
  DialogStyleable,
  DialogStyles,
  DialogTriggerRef,
} from '@lib/components/dialog/types'
import { Portal } from '@lib/components/portal'
import { keys } from '@lib/constants/keys'
import { cn, isDefined, mergeObjects } from '@lib/utils'
import {
  HTMLProps,
  MouseEvent,
  ReactNode,
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

interface DialogProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'title' | 'content'> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: ReactNode
  description?: ReactNode
  content?: DialogContent
  closeButton?: DialogCloseButton
  styles?: DialogStyleable<DialogStyles>
  classNames?: DialogStyleable<DialogClassNames>
}

export const Dialog = forwardRef<DialogTriggerRef, DialogProps>(
  (
    {
      children,
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
      if (event?.defaultPrevented) return

      setInternalOpen(value)
      onOpenChange?.(value)
    }

    const internalRef = useRef<DialogTriggerRef>(null)

    useImperativeHandle<DialogTriggerRef, DialogTriggerRef>(
      ref,
      () => internalRef.current,
      []
    )

    const titleId = useId()
    const descriptionId = useId()

    const triggerProps = {
      ...props,
      ref: internalRef,
      type: 'button',
      onClick: (event: MouseEvent<HTMLButtonElement>) =>
        setInternalOpenHandler(true, event),
      style: mergeObjects(style, styles?.trigger),
      className: cn(className, classNames?.trigger),
    } as const

    const rootProps = {
      role: 'dialog',
      style: styles?.root,
      className: classNames?.root,
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

    useEffect(() => {
      const close = (event: KeyboardEvent) => {
        if (event.key === keys.escape) {
          setInternalOpenHandler(false)
        }
      }

      if (open) {
        window.addEventListener('keydown', close)
      }

      if (!open) {
        window.removeEventListener('keydown', close)
      }
    }, [open])

    return (
      <>
        <button {...triggerProps}>{children}</button>

        <Portal>
          {open && (
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
                        state: { open },
                        actions: {
                          open: () => setInternalOpenHandler(true),
                          close: () => setInternalOpenHandler(false),
                        },
                      })}

                    {typeof content !== 'function' && content}
                  </>
                )}
              </div>
            </div>
          )}
        </Portal>
      </>
    )
  }
)
Dialog.displayName = 'FeliceDialog'
