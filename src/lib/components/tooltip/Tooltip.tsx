import { Portal } from '@lib/components/portal'
import {
  TooltipChildren,
  TooltipClassName,
  TooltipContentRef,
  TooltipSide,
  TooltipStyleable,
  TooltipTriggerRef,
} from '@lib/components/tooltip/types'
import { getFinalContentPosition } from '@lib/components/tooltip/utils'
import { keys } from '@lib/constants/keys'
import { cn, isDefined } from '@lib/utils'
import {
  FocusEvent,
  HTMLProps,
  ReactNode,
  forwardRef,
  isValidElement,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

interface TooltipContentProps extends HTMLProps<HTMLDivElement> {
  onWindowKeyDown: (event: KeyboardEvent) => void
}

const TooltipContent = forwardRef<TooltipContentRef, TooltipContentProps>(
  ({ children, onWindowKeyDown, ...props }, ref) => {
    useEffect(() => {
      window.addEventListener('keydown', onWindowKeyDown)

      return () => {
        window.removeEventListener('keydown', onWindowKeyDown)
      }
    }, [])

    return (
      <div {...props} ref={ref}>
        {children}
      </div>
    )
  }
)
TooltipContent.displayName = 'FeliceTooltipContent'

export interface TooltipProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'children' | 'content'> {
  children?: TooltipChildren
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  content?: ReactNode
  side?: TooltipSide
  classNames?: TooltipStyleable<string, TooltipClassName>
}

export const Tooltip = forwardRef<TooltipTriggerRef, TooltipProps>(
  (
    {
      children,
      defaultOpen = false,
      open: externalOpen,
      onOpenChange,
      content,
      side = 'top',
      className,
      classNames,
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(() => {
      if (isDefined(externalOpen)) return externalOpen

      return defaultOpen
    })

    const open = isDefined(externalOpen) ? externalOpen : internalOpen
    // const open = true
    const contentId = useId()

    const triggerRef = useRef<TooltipTriggerRef>(null)
    const contentRef = useRef<TooltipContentRef>(null)

    useImperativeHandle<TooltipTriggerRef, TooltipTriggerRef>(
      ref,
      () => triggerRef.current,
      []
    )

    const setInternalOpenHandler = (value: boolean, event?: FocusEvent) => {
      if (event?.defaultPrevented) return

      setInternalOpen(value)
      onOpenChange?.(value)
    }

    const onTriggerFocus = (event: FocusEvent<HTMLButtonElement>) =>
      setInternalOpenHandler(true, event)

    const onTriggerBlur = (event: FocusEvent<HTMLButtonElement>) =>
      setInternalOpenHandler(false, event)

    const onWindowKeyDown = (event: KeyboardEvent) => {
      if (event.key === keys.escape) {
        setInternalOpenHandler(false)
      }
    }

    const triggerProps = {
      type: 'button',
      tabIndex: 0,
      'aria-describedby': open ? contentId : undefined,
      'data-open': open,
    } as const

    return (
      <>
        {typeof children !== 'function' && (
          <button
            {...triggerProps}
            ref={triggerRef}
            className={cn(className, classNames?.trigger)}
            onFocus={onTriggerFocus}
            onBlur={onTriggerBlur}
          >
            {children}
          </button>
        )}

        {typeof children === 'function' &&
          !isValidElement(children) &&
          children({ triggerProps, state: { open } })}

        <Portal>
          {open && (
            <TooltipContent
              ref={ref => {
                if (!ref) return
                const position = getFinalContentPosition(
                  side,
                  triggerRef.current,
                  ref
                )

                if (position.left) ref.style.left = `${position.left}px`
                if (position.top) ref.style.top = `${position.top}px`
              }}
              id={contentId}
              role='tooltip'
              style={{ position: 'absolute' }}
              // className={cn(classNames?.content)}
              onWindowKeyDown={onWindowKeyDown}
            >
              {content}
            </TooltipContent>
          )}
        </Portal>
      </>
    )
  }
)

Tooltip.displayName = 'FeliceTooltip'
