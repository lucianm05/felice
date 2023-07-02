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
  getNextIndex,
  isItemDisabled,
  isTabElementClassNamesRelative,
  isTabElementStylesRelative,
} from '@lib/components/tabs/utils'
import { keys } from '@lib/constants/keys'
import { cn, isDefined, mergeObjects } from '@lib/utils'
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
    const [internalTab, setInternalTab] = useState(defaultTab)
    const [ids, setIds] = useState({ element: [], panel: [] })

    const currentTab = isDefined(selectedTab) ? selectedTab : internalTab

    const internalRef = useRef<TabsRef>(null)

    useImperativeHandle<TabsRef, TabsRef>(ref, () => internalRef.current, [])

    const onIdLoad = useCallback((id: string, item: TabItem) => {
      setIds(prev => ({ ...prev, [item]: [...prev[item], id] }))
    }, [])

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
      (
        event: KeyboardEvent<HTMLButtonElement>,
        index: number,
        ids: string[]
      ) => {
        if (event.defaultPrevented) return

        let nextIndex = null

        switch (event.key) {
          case keys.home:
            {
              nextIndex = 0
            }
            break

          case keys.end:
            {
              nextIndex = ids.length - 1
            }
            break

          default:
            {
              const isForward =
                (orientation === 'horizontal' &&
                  event.key === keys.arrowRight) ||
                (orientation === 'vertical' && event.key === keys.arrowDown)
              const isBackward =
                (orientation === 'horizontal' &&
                  event.key === keys.arrowLeft) ||
                (orientation === 'vertical' && event.key === keys.arrowUp)

              if (!isForward && !isBackward) return

              nextIndex = getNextIndex(
                index,
                ids,
                isForward ? 'forward' : 'backward'
              )
            }
            break
        }

        if (isDefined(nextIndex)) {
          const targetElement = document.getElementById(`${ids[nextIndex]}`)

          if (targetElement) targetElement.focus()

          event.preventDefault()
          event.stopPropagation()
        }
      },
      []
    )

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
        >
          {data.map(({ element, elementProps }, index) => {
            const isSelected = index === currentTab
            const isDisabled = isItemDisabled(disabled, elementProps)

            return (
              <TabElement
                {...elementProps}
                key={index}
                style={mergeObjects(
                  isTabElementStylesRelative(styles?.element)
                    ? mergeObjects(
                        styles?.element?.default,
                        isSelected ? styles?.element?.selected : undefined
                      )
                    : styles?.element,
                  elementProps?.style
                )}
                className={cn(
                  isTabElementClassNamesRelative(classNames?.element)
                    ? cn(
                        classNames?.element?.default,
                        isSelected && classNames?.element?.selected
                      )
                    : classNames?.element,
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
                  onTabElementKeyDown(event, index, ids.element)
                }}
                onFocus={event => {
                  elementProps?.onFocus?.(event)
                  setInternalTabHandler({ index, event, elementProps })
                }}
                tabIndex={!isSelected ? -1 : 0}
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
