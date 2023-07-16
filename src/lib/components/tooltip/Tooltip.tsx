import { Portal } from '@lib/components/portal'
import {
  TooltipChildren,
  TooltipClassNames,
  TooltipContainerRef,
  TooltipContentRef,
  TooltipSide,
  TooltipStyles,
  TooltipTriggerProps,
  TooltipTriggerRef,
} from '@lib/components/tooltip/types'
import {
  getFinalContentPosition,
  getOffsetProperties,
} from '@lib/components/tooltip/utils'
import { keys } from '@lib/constants/keys'
import { useUpdateInternalOnExternalChange } from '@lib/hooks/useUpdateInternalOnExternalChange'
import { cn, isDefined, mergeObjects } from '@lib/utils'
import {
  FocusEvent,
  HTMLProps,
  MouseEvent,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

interface TooltipContainerProps extends HTMLProps<HTMLDivElement> {
  onWindowKeyDown: (event: KeyboardEvent) => void
}

const TooltipContainer = forwardRef<TooltipContainerRef, TooltipContainerProps>(
  ({ children, onWindowKeyDown, ...props }, ref) => {
    useEffect(() => {
      window.addEventListener('keydown', onWindowKeyDown)

      return () => {
        window.removeEventListener('keydown', onWindowKeyDown)
      }
    }, [])

    return (
      <div ref={ref} {...props}>
        {children}
      </div>
    )
  }
)
TooltipContainer.displayName = 'FeliceTooltipContainer'

const TooltipContent = forwardRef<TooltipContentRef, HTMLProps<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
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
  sideOffset?: number
  styles?: TooltipStyles
  classNames?: TooltipClassNames
  delay?: number
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
      sideOffset = 0,
      style,
      styles,
      className,
      classNames,
      delay = 500,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(() => {
      if (isDefined(externalOpen)) return externalOpen

      return defaultOpen
    })
    const [shouldDisplay, setShouldDisplay] = useState(false)

    const open = isDefined(externalOpen) ? externalOpen : internalOpen

    const contentId = useId()

    const triggerRef = useRef<TooltipTriggerRef>(null)
    const containerRef = useRef<TooltipContainerRef>(null)

    useImperativeHandle<TooltipTriggerRef, TooltipTriggerRef>(
      ref,
      () => triggerRef.current,
      []
    )

    const timeout = useRef<ReturnType<typeof setTimeout>>()

    const setTimeoutHandler = useCallback(
      (cb: VoidFunction) => {
        timeout.current = setTimeout(() => {
          cb()
          clearTimeoutHandler()
        }, delay)
      },
      [delay]
    )

    const clearTimeoutHandler = useCallback(() => {
      if (!timeout.current) return
      clearTimeout(timeout.current)
      timeout.current = undefined
    }, [])

    const setInternalOpenHandler = (
      value: boolean,
      event?: FocusEvent | MouseEvent
    ) => {
      if (event?.defaultPrevented || disabled) return

      setInternalOpen(value)
      onOpenChange?.(value)
    }

    const onMouseEnter = (event: MouseEvent) => {
      setTimeoutHandler(() => setInternalOpenHandler(true, event))
    }

    const onMouseLeave = (event: MouseEvent) => {
      clearTimeoutHandler()
      setInternalOpenHandler(false, event)
    }

    const onWindowKeyDown = (event: KeyboardEvent) => {
      if (event.key === keys.escape) {
        setInternalOpenHandler(false)
      }
    }

    const setContainerOffset = (ctRef: TooltipContainerRef) => {
      if (!ctRef) {
        return
      }

      const offsetProperties = getOffsetProperties(
        side,
        sideOffset,
        triggerRef.current,
        ctRef
      )

      if (offsetProperties.marginLeft)
        ctRef.style.marginLeft = offsetProperties.marginLeft

      if (offsetProperties.marginTop)
        ctRef.style.marginTop = offsetProperties.marginTop

      if (offsetProperties.paddingBottom)
        ctRef.style.paddingBottom = offsetProperties.paddingBottom

      if (offsetProperties.paddingTop)
        ctRef.style.paddingTop = offsetProperties.paddingTop

      if (offsetProperties.paddingLeft)
        ctRef.style.paddingLeft = offsetProperties.paddingLeft

      if (offsetProperties.paddingRight)
        ctRef.style.paddingRight = offsetProperties.paddingRight
    }

    const setContainerPosition = (ctRef: TooltipContainerRef) => {
      if (!ctRef) {
        return
      }

      const position = getFinalContentPosition(side, triggerRef.current, ctRef)

      if (position.left) ctRef.style.left = `${position.left}px`
      if (position.top) ctRef.style.top = `${position.top}px`
    }

    useEffect(() => {
      setShouldDisplay(Boolean(open && triggerRef.current))
    }, [open, triggerRef])

    useEffect(() => {
      const updatePosition = () => {
        if (open) {
          setContainerOffset(containerRef.current)
          setContainerPosition(containerRef.current)
        }
      }

      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition)

      return () => {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition)
      }
    }, [open, containerRef])

    useUpdateInternalOnExternalChange({
      setInternalValue: setInternalOpen,
      defaultValue: defaultOpen,
      externalValue: externalOpen,
    })

    const triggerProps: TooltipTriggerProps = {
      ref: triggerRef,
      type: 'button',
      style: mergeObjects(style, styles?.trigger),
      className: cn(className, classNames?.trigger) || undefined,
      tabIndex: 0,
      onFocus: (event: FocusEvent<HTMLButtonElement>) => {
        props?.onFocus?.(event)
        setInternalOpenHandler(true, event)
      },
      onBlur: (event: FocusEvent<HTMLButtonElement>) => {
        props?.onFocus?.(event)
        setInternalOpenHandler(false, event)
      },
      onMouseEnter: (event: MouseEvent<HTMLButtonElement>) => {
        props?.onMouseEnter?.(event)
        onMouseEnter(event)
      },
      onMouseLeave: (event: MouseEvent<HTMLButtonElement>) => {
        props?.onMouseLeave?.(event)
        onMouseLeave(event)
      },
      'aria-describedby': open ? contentId : undefined,
      'aria-disabled': disabled,
      'data-open': open,
      'data-disabled': disabled,
    }

    return (
      <>
        {typeof children !== 'function' && (
          <button {...triggerProps} ref={triggerRef}>
            {children}
          </button>
        )}

        {typeof children === 'function' &&
          children({ triggerProps, state: { open } })}

        <Portal>
          {shouldDisplay && (
            <TooltipContainer
              ref={ref => {
                setContainerOffset(ref)
                setContainerPosition(ref)
                containerRef.current = ref
              }}
              style={{
                position: 'fixed',
                width: 'max-content',
                ...(styles?.container || {}),
              }}
              className={classNames?.container}
              onWindowKeyDown={onWindowKeyDown}
              onMouseEnter={event => {
                setInternalOpenHandler(true, event)
              }}
              onMouseLeave={event => {
                onMouseLeave(event)
              }}
            >
              <TooltipContent
                role='tooltip'
                id={contentId}
                style={styles?.content}
                className={classNames?.content}
              >
                {content}
              </TooltipContent>
            </TooltipContainer>
          )}
        </Portal>
      </>
    )
  }
)

Tooltip.displayName = 'FeliceTooltip'
