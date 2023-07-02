import {
  Tab,
  TabElementProps,
  TabItem,
  TabPanelProps,
  TabsClassNames,
  TabsStyles,
} from '@lib/components/tabs/types'
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

    const isItemDisabled = (props?: TabElementProps | TabPanelProps) => {
      if (isDefined(props?.disabled)) return Boolean(props?.disabled)

      return Boolean(disabled)
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
      const isDisabled = isItemDisabled(elementProps)

      if (isDisabled || event?.defaultPrevented) return

      setInternalTab(index)
      onTabChange?.(index)
    }

    const onTabElementKeyDown = useCallback(
      (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        if (event.defaultPrevented) return

        let prevent = false
        let nextIndex = null

        switch (event.key) {
          case keys.arrowLeft:
            {
              if (index === 0) {
                nextIndex = ids.element.length - 1
              } else {
                nextIndex = index - 1
              }

              prevent = true
            }
            break

          case keys.arrowRight:
            {
              if (index === ids.element.length - 1) {
                nextIndex = 0
              } else {
                nextIndex = index + 1
              }

              prevent = true
            }
            break
        }

        if (isDefined(nextIndex)) {
          const targetElement = document.getElementById(
            `${ids.element[nextIndex]}`
          )

          if (targetElement) targetElement.focus()
        }

        if (prevent) {
          event.preventDefault()
          event.stopPropagation()
        }
      },
      [ids]
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
        >
          {data.map(({ element, elementProps }, index) => (
            <TabElement
              {...elementProps}
              key={index}
              style={mergeObjects(styles?.element, elementProps?.style)}
              className={cn(classNames?.element, elementProps?.className)}
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
              tabIndex={currentTab !== index ? -1 : 0}
              disabled={isItemDisabled(elementProps)}
              aria-controls={ids.panel[index]}
              aria-selected={currentTab === index}
            >
              {element}
            </TabElement>
          ))}
        </div>

        {data.map(({ panel, panelProps }, index) => (
          <TabPanel
            {...panelProps}
            key={index}
            style={mergeObjects(styles?.panel, panelProps?.style)}
            className={cn(classNames?.panel, panelProps?.className)}
            onIdLoad={id => {
              panelProps?.onIdLoad?.(id)
              onIdLoad(id, 'panel')
            }}
            hidden={currentTab !== index}
            tabIndex={0}
            disabled={isItemDisabled(panelProps)}
            aria-labelledby={ids.element[index]}
          >
            {panel}
          </TabPanel>
        ))}
      </div>
    )
  }
)

Tabs.displayName = 'FeliceTabs'
