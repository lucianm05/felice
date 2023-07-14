import {
  Tab,
  TabElementProps,
  TabItem,
  TabPanelProps,
  TabsClassNames,
  TabsOrientation,
  TabsStyles,
} from '@lib/components/tabs/types'
import {
  getTabElementClassNames,
  getTabElementStyles,
  isItemDisabled,
} from '@lib/components/tabs/utils'
import { keys } from '@lib/constants/keys'
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
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

const TabElement = forwardRef<HTMLButtonElement, TabElementProps>(
  ({ children, onIdLoad, ...props }, ref) => {
    const id = useId()

    useLayoutEffect(() => {
      onIdLoad?.(id)
    }, [])

    return (
      <button {...props} ref={ref} type='button' id={id} role='tab'>
        {children}
      </button>
    )
  }
)
TabElement.displayName = 'FeliceTabElement'

const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ children, onIdLoad, ...props }, ref) => {
    const id = useId()

    useLayoutEffect(() => {
      onIdLoad?.(id)
    }, [])

    return (
      <div {...props} ref={ref} id={id} role='tabpanel'>
        {children}
      </div>
    )
  }
)
TabPanel.displayName = 'FeliceTabPanel'

export interface TabsProps extends Omit<HTMLProps<HTMLDivElement>, 'data'> {
  data: Tab[]
  defaultTab?: number
  selectedTab?: number
  onTabChange?: (tab: number) => void
  styles?: TabsStyles
  classNames?: TabsClassNames
  orientation?: TabsOrientation
}

type TabsRef = HTMLDivElement | null

export const Tabs = forwardRef<TabsRef, TabsProps>(
  (
    {
      data,
      defaultTab = 0,
      selectedTab,
      onTabChange,
      style,
      styles,
      className,
      classNames,
      disabled,
      orientation = 'horizontal',
      ...props
    },
    ref
  ) => {
    const [internalTab, setInternalTab] = useState(() => {
      if (isDefined(selectedTab)) return selectedTab
      return defaultTab
    })
    const [ids, setIds] = useState({ element: [], panel: [] })

    const currentTab = isDefined(selectedTab) ? selectedTab : internalTab

    const internalRef = useRef<TabsRef>(null)

    useImperativeHandle<TabsRef, TabsRef>(ref, () => internalRef.current, [])

    const onIdLoad = useCallback(
      (id: string, item: TabItem) => {
        setIds(prev => {
          if (prev[item].length === data.length) return prev

          return { ...prev, [item]: [...prev[item], id] }
        })
      },
      [data]
    )

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
        if (event.defaultPrevented || !internalRef.current) return

        const elements = [
          ...internalRef.current.querySelectorAll<HTMLButtonElement>(
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
      []
    )

    const getTabIndex = (index: number) => {
      const isSelected = index === currentTab

      const currentElement = data[currentTab]

      const isCurrentElementDisabled = isItemDisabled(
        disabled,
        currentElement.elementProps
      )

      if (isCurrentElementDisabled) {
        const firstEnabledIndex = data.findIndex(
          element => !isItemDisabled(disabled, element.elementProps)
        )

        if (firstEnabledIndex >= 0) return index === firstEnabledIndex ? 0 : -1
      }

      return isSelected ? 0 : -1
    }

    return (
      <div
        {...props}
        ref={internalRef}
        style={mergeObjects(style, styles?.root)}
        className={cn(className, classNames?.root)}
      >
        <div
          role='tablist'
          style={styles?.tablist}
          className={classNames?.tablist}
          aria-orientation={orientation}
          data-orientation={orientation}
        >
          {data.map(({ element, elementProps }, index) => {
            const isSelected = index === currentTab
            const isDisabled = isItemDisabled(disabled, elementProps)

            return (
              <TabElement
                {...elementProps}
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
                onIdLoad={id => {
                  elementProps?.onIdLoad?.(id)
                  onIdLoad(id, 'element')
                }}
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
                tabIndex={getTabIndex(index)}
                disabled={isDisabled}
                aria-controls={ids.panel[index]}
                aria-selected={isSelected}
                data-selected={isSelected}
                data-disabled={isDisabled}
              >
                {element}
              </TabElement>
            )
          })}
        </div>

        {data.map(({ panel, panelProps }, index) => {
          const isSelected = index === currentTab
          const isDisabled = isItemDisabled(disabled, panelProps)

          return (
            <TabPanel
              {...panelProps}
              key={index}
              style={mergeObjects(styles?.panel, panelProps?.style)}
              className={cn(classNames?.panel, panelProps?.className)}
              onIdLoad={id => {
                panelProps?.onIdLoad?.(id)
                onIdLoad(id, 'panel')
              }}
              hidden={!isSelected}
              tabIndex={0}
              disabled={isItemDisabled(disabled, panelProps)}
              aria-labelledby={ids.element[index]}
              data-selected={isSelected}
              data-disabled={isDisabled}
            >
              {panel}
            </TabPanel>
          )
        })}
      </div>
    )
  }
)

Tabs.displayName = 'FeliceTabs'
