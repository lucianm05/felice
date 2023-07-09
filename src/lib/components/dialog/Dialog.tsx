import {
  DialogClassNames,
  DialogCloseButton,
  DialogStyleable,
  DialogStyles,
  DialogTriggerRef,
} from '@lib/components/dialog/types'
import { Portal } from '@lib/components/portal'
import { keys } from '@lib/constants/keys'
import { isDefined, mergeObjects } from '@lib/utils'
import {
  HTMLProps,
  MouseEvent,
  ReactNode,
  forwardRef,
  useEffect,
  useId,
  useState,
} from 'react'

interface DialogProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'title' | 'content'> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: ReactNode
  description?: ReactNode
  content?: ReactNode
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

    const titleId = useId()
    const descriptionId = useId()

    // const onTriggerClick =
    const setInternalOpenHandler = (value: boolean, event?: MouseEvent) => {
      if (event?.defaultPrevented) return

      setInternalOpen(value)
      onOpenChange?.(value)
    }

    const buttonProps = {
      ...props,
      ref,
      type: 'button',
      onClick: (event: MouseEvent<HTMLButtonElement>) =>
        setInternalOpenHandler(true, event),
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
        <button {...buttonProps}>{children}</button>

        <Portal>
          {open && (
            <div>
              <button
                type='button'
                style={mergeObjects({ position: 'absolute' }, styles?.overlay)}
                onClick={event => setInternalOpenHandler(false, event)}
                data-overlay
              />

              <div
                role='dialog'
                aria-modal
                aria-labelledby={title ? titleId : undefined}
                aria-describedby={description ? descriptionId : undefined}
              >
                <div>
                  {title && <h2 id={titleId}>{title}</h2>}

                  {closeButton && (
                    <>
                      {typeof closeButton === 'function' &&
                        closeButton({
                          buttonProps: {
                            type: 'button',
                            onClick: event =>
                              setInternalOpenHandler(false, event),
                          },
                        })}

                      {typeof closeButton !== 'function' && (
                        <button type='button'>closeButton</button>
                      )}
                    </>
                  )}
                </div>
                {description && <p id={descriptionId}>{description}</p>}
                {content}
              </div>
            </div>
          )}
        </Portal>
      </>
    )
  }
)
Dialog.displayName = 'FeliceDialog'
