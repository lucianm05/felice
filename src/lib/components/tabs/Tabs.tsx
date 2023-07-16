import {
  Tab,
  TabElementProps,
  TabsClassNames,
  TabsOrientation,
  TabsStyles,
} from '@lib/components/tabs/types'
import {
  getTabElementClassNames,
  getTabElementStyles,
  getTabIndex,
  isItemDisabled,
} from '@lib/components/tabs/utils'
import { keys } from '@lib/constants/keys'
import { useUpdateInternalOnExternalChange } from '@lib/hooks/useUpdateInternalOnExternalChange'
import {
  cn,
  getNextElementInSequence,
  getSequenceDirection,
  isDefined,
  mergeObjects,
} from '@lib/utils'
import {
  FocusEvent,
  HTMLProps,
  KeyboardEvent,
  MouseEvent,
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
} from 'react'

export interface TabsProps extends Omit<HTMLProps<HTMLDivElement>, 'data'> {
  data: Tab[]
  defaultTab?: number
  currentTab?: number
  onTabChange?: (tab: number) => void
  styles?: TabsStyles
  classNames?: TabsClassNames
  orientation?: TabsOrientation
}

type TabsRef = HTMLDivElement | null

export const Tabs = forwardRef<TabsRef, TabsProps>(
  (
    {
      id: externalId,
      data,
      defaultTab = 0,
      currentTab: externalTab,
      onTabChange,
      style,
      styles,
      className,
      classNames,
      disabled = false,
      orientation = 'horizontal',
      ...props
    },
    ref
  ) => {
    const [internalTab, setInternalTab] = useState(() => {
      if (isDefined(externalTab)) return externalTab
      return defaultTab
    })

    const currentTab = isDefined(externalTab) ? externalTab : internalTab

    const tablistRef = useRef<HTMLDivElement | null>(null)

    const internalId = useId()
    const id = externalId || internalId

    const ids = {
      root: id,
      getElement: (index: number) => `${id}-element-${index}`,
      getPanel: (index: number) => `${id}-panel-${index}`,
    }

    const setInternalTabHandler = ({
      index,
      event,
      elementProps,
    }: {
      index: number
      event?: FocusEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>
      elementProps?: TabElementProps
    }) => {
      const isDisabled = isItemDisabled(disabled, elementProps)

      if (isDisabled || event?.defaultPrevented) return

      setInternalTab(index)
      onTabChange?.(index)
    }

    const onTabElementKeyDown = useCallback(
      (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        if (event.defaultPrevented || !tablistRef.current) return

        const elements = [
          ...tablistRef.current.querySelectorAll<HTMLButtonElement>(
            'button[role=tab]'
          ),
        ]
        const enabledElements = elements.filter(
          element => element.getAttribute('data-disabled') === 'false'
        )

        let nextElement = null

        switch (event.key) {
          case keys.home:
            {
              nextElement = enabledElements[0]
            }
            break

          case keys.end:
            {
              nextElement = enabledElements[enabledElements.length - 1]
            }
            break

          default:
            {
              const direction = getSequenceDirection(event.key, orientation)

              if (direction) {
                nextElement = getNextElementInSequence<HTMLButtonElement>(
                  index,
                  elements,
                  direction
                )
              }
            }
            break
        }

        if (!nextElement) return

        event.preventDefault()
        event.stopPropagation()

        nextElement.focus()
      },
      [tablistRef, orientation]
    )

    useUpdateInternalOnExternalChange({
      setInternalValue: setInternalTab,
      defaultValue: defaultTab,
      externalValue: externalTab,
    })

    return (
      <div
        {...props}
        ref={ref}
        id={ids.root}
        style={mergeObjects(style, styles?.root)}
        className={cn(className, classNames?.root)}
      >
        <div
          role='tablist'
          ref={tablistRef}
          style={styles?.tablist}
          className={classNames?.tablist}
          aria-orientation={orientation}
          data-orientation={orientation}
        >
          {data.map(({ element, elementProps }, index) => {
            const isSelected = index === currentTab
            const isDisabled = isItemDisabled(disabled, elementProps)

            return (
              <button
                {...elementProps}
                type='button'
                id={ids.getElement(index)}
                role='tab'
                key={index}
                style={mergeObjects(
                  getTabElementStyles(styles?.element, isDisabled, isSelected),
                  elementProps?.style
                )}
                className={cn(
                  getTabElementClassNames(
                    classNames?.element,
                    isDisabled,
                    isSelected
                  ),
                  elementProps?.className
                )}
                onClick={event => {
                  elementProps?.onClick?.(event)
                  setInternalTabHandler({ index, event, elementProps })
                }}
                onKeyDown={event => {
                  elementProps?.onKeyDown?.(event)
                  onTabElementKeyDown(event, index)
                }}
                onFocus={event => {
                  elementProps?.onFocus?.(event)
                  setInternalTabHandler({ index, event, elementProps })
                }}
                tabIndex={getTabIndex(index, data, currentTab, disabled)}
                disabled={isDisabled}
                aria-controls={ids.getPanel(index)}
                aria-selected={isSelected}
                data-selected={isSelected}
                data-disabled={isDisabled}
              >
                {element}
              </button>
            )
          })}
        </div>

        {data.map(({ panel, panelProps }, index) => {
          const isSelected = index === currentTab
          const isDisabled = isItemDisabled(disabled, panelProps)

          if (!isSelected) return null

          return (
            <div
              {...panelProps}
              key={index}
              id={ids.getPanel(index)}
              role='tabpanel'
              style={mergeObjects(styles?.panel, panelProps?.style)}
              className={cn(classNames?.panel, panelProps?.className)}
              hidden={!isSelected}
              tabIndex={0}
              aria-labelledby={ids.getElement(index)}
              aria-hidden={!isSelected}
              data-selected={isSelected}
              data-disabled={isDisabled}
            >
              {panel}
            </div>
          )
        })}
      </div>
    )
  }
)

Tabs.displayName = 'FeliceTabs'
