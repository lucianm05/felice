import { Portal } from '@lib/components/portal/Portal'
import {
  getIsOptionClassNamesRelative,
  getIsOptionStylesRelative,
  getIsVisibilityStylesRelative,
  getIsVisiblityClassNamesRelative,
} from '@lib/components/select/utils'
import { keys } from '@lib/constants/keys'
import { useElementPosition } from '@lib/hooks/useElementPosition'
import { useUpdateInternalOnExternalChange } from '@lib/hooks/useUpdateInternalOnExternalChange'
import { cn, isDefined, mergeObjects } from '@lib/utils'
import {
  CSSProperties,
  Fragment,
  HTMLProps,
  KeyboardEventHandler,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  SelectClassNames,
  SelectOption,
  SelectOptionRenderFunction,
  SelectOptionRenderProps,
  SelectRef,
  SelectStyles,
  SelectTriggerRenderFunction,
  SelectTriggerRenderProps,
} from './types'

export interface SelectProps extends Omit<HTMLProps<HTMLDivElement>, 'data'> {
  label: string
  data: SelectOption[]
  placeholder?: string
  styles?: SelectStyles
  classNames?: SelectClassNames
  renderTrigger?: SelectTriggerRenderFunction
  renderOption?: SelectOptionRenderFunction
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultValue?: string
  value?: string
  onValueChange?: (option: SelectOption) => void
}

export const Select = forwardRef<SelectRef, SelectProps>(
  (
    {
      id: externalId,
      data,
      label,
      placeholder,
      style,
      styles,
      className,
      classNames,
      renderTrigger,
      renderOption,
      defaultOpen = false,
      open: externalOpen,
      onOpenChange,
      defaultValue,
      value: externalValue,
      onValueChange,
      disabled = false,
      ...props
    },
    ref
  ) => {
    // Used for accessibility reasons (setting activedescendant)
    const [internalIndex, setInternalIndex] = useState<number | undefined>()
    const [internalValue, setInternalValue] = useState<string | undefined>(
      () => {
        if (isDefined(externalValue)) return externalValue
        return defaultValue
      }
    )
    const [internalOpen, setInternalOpen] = useState(() => {
      if (isDefined(externalOpen)) return externalOpen
      return defaultOpen
    })
    const [internalSearch, setInternalSearch] = useState('')

    const open = isDefined(externalOpen) ? externalOpen : internalOpen
    const value = isDefined(externalValue) ? externalValue : internalValue

    const ignoreBlur = useRef(false)

    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const triggerPosition = useElementPosition(triggerRef)

    const internalId = useId()
    const id = externalId || internalId

    const maxIndex = data.length - 1

    const ids = {
      root: id,
      label: `${id}-label`,
      trigger: id,
      list: `${id}-listbox`,
      getOption: (index?: number) => {
        if (index === undefined) return ''

        return `${id}-option-${index}`
      },
    }

    const clearSearchTimeout = useRef<ReturnType<typeof setTimeout>>()

    const setInternalOpenHandler = (open: boolean) => {
      if (disabled) return

      setInternalOpen(open)
      onOpenChange?.(open)
    }

    const setInternalOptionValue = (index: number) => {
      const newOption = data[index]
      setInternalValue(newOption.value)
      onValueChange?.(newOption)
      setInternalOpenHandler(false)
    }

    const setInternalIndexAfterSearch = useCallback((index?: number) => {
      setInternalIndex(index)
      setElementInView(index)

      // Clear internalSearch after the user stops typing
      clearSearchTimeout.current = setTimeout(() => {
        setInternalSearch('')
      }, 500)
    }, [])

    const reset = () => {
      setInternalOpenHandler(false)
      const idx = data.findIndex(i => i.value === value)
      setInternalIndex(idx < 0 ? undefined : idx)
    }

    const getCurrentOption = () => {
      return data?.find(option => option.value === value)
    }

    const onBlur = () => {
      if (ignoreBlur.current) {
        ignoreBlur.current = false
        return
      }

      reset()
    }

    const onClick = () => {
      if (ignoreBlur.current) {
        ignoreBlur.current = false
        return
      }

      setInternalOpenHandler(!internalOpen)
    }

    const setElementInView = (index?: number) => {
      if (!isDefined(index)) return

      const list = document.getElementById(ids.list)
      const element = document.getElementById(ids.getOption(index))

      if (!list || !element) return

      list.scrollTo({ top: index * element.getBoundingClientRect().height })
    }

    const onKeyDown: KeyboardEventHandler<HTMLButtonElement> = event => {
      const { altKey, key, code } = event

      switch (code) {
        case keys.arrowDown: {
          event.preventDefault()

          if (!internalOpen) {
            setInternalOpenHandler(true)
            return
          }

          if (!isDefined(internalIndex)) {
            setInternalIndex(0)
            setElementInView(0)
            return
          }

          if (internalIndex < maxIndex) {
            const newIndex = (internalIndex || 0) + 1
            setInternalIndex(newIndex)
            setElementInView(newIndex)
            return
          }

          return
        }

        case keys.arrowUp: {
          event.preventDefault()

          if (altKey) {
            if (internalIndex) setInternalOptionValue(internalIndex)
            setInternalOpenHandler(false)
            return
          }

          if (!internalOpen) {
            setInternalOpenHandler(true)
            setInternalIndex(0)
            setElementInView(0)
            return
          }

          if (!internalIndex) {
            setInternalIndex(0)
            setElementInView(0)
            return
          }

          if (internalIndex > 0) {
            const newIndex = (internalIndex || maxIndex) - 1
            setInternalIndex(newIndex)
            setElementInView(newIndex)
            return
          }

          return
        }

        case keys.enter:
        case keys.space:
        case keys.tab: {
          ignoreBlur.current = true

          if (!internalOpen && key !== keys.tab) {
            setInternalOpenHandler(true)
            return
          }

          if (!isDefined(internalIndex)) {
            setInternalOpenHandler(false)
            return
          }

          setInternalIndex(internalIndex)
          setInternalOptionValue(internalIndex)
          return
        }

        case keys.home: {
          event.preventDefault()

          if (!internalOpen) setInternalOpenHandler(true)

          setInternalIndex(0)
          setElementInView(0)
          return
        }

        case keys.end: {
          event.preventDefault()

          if (!internalOpen) setInternalOpenHandler(true)

          setInternalIndex(maxIndex)
          setElementInView(maxIndex)
          return
        }

        case keys.escape: {
          reset()
          return
        }

        case keys.pageUp: {
          if (!internalOpen) return

          event.preventDefault()

          if (!isDefined(internalIndex)) {
            setInternalIndex(0)
            setElementInView(0)
            return
          }

          const newIndex = internalIndex - 10

          if (newIndex <= 0) {
            setInternalIndex(0)
            setElementInView(0)
            return
          }

          setInternalIndex(newIndex)
          setElementInView(newIndex)

          return
        }

        case keys.pageDown: {
          if (!internalOpen) return

          event.preventDefault()

          if (!isDefined(internalIndex)) {
            setInternalIndex(0)
            setElementInView(0)
            return
          }

          const newIndex = internalIndex + 10

          if (newIndex > maxIndex) {
            setInternalIndex(maxIndex)
            setElementInView(maxIndex)
            return
          }

          setInternalIndex(newIndex)
          setElementInView(newIndex)

          return
        }

        default: {
          if (key.length !== 1) return

          // Clearing timeout so multiple letters can be typed
          if (clearSearchTimeout.current) {
            clearTimeout(clearSearchTimeout.current)
            clearSearchTimeout.current = undefined
          }

          setInternalOpenHandler(true)
          const newSearch = (internalSearch + key).toLowerCase()
          const newSearchLetters = newSearch.split('')
          setInternalSearch(newSearch)

          // Verifying if the same letter is typed multiple times
          if (
            newSearchLetters.every(letter => letter === newSearchLetters[0])
          ) {
            // Searching for the data indexes for the letter being typed so the focus cycles among the options
            const validIndexes = data
              .filter(
                item => item.label[0].toLowerCase() === newSearchLetters[0]
              )
              .map(item => data.findIndex(i => i.label === item.label))

            // If there is no internal index set, we can set it to the first valid index
            if (!internalIndex) {
              setInternalIndexAfterSearch(validIndexes[0])
              return
            }

            // Verifying if the array has more than one option so we can cycle among the options
            if (validIndexes.length > 1) {
              const currValidIndex = validIndexes.findIndex(
                i => internalIndex === i
              )

              const nextValidIndex = currValidIndex + 1

              // If the next valid index is greater than the array length, set the internalIndex to the first valid index
              if (nextValidIndex > validIndexes.length - 1) {
                setInternalIndexAfterSearch(validIndexes[0])

                return
              }

              setInternalIndexAfterSearch(validIndexes[nextValidIndex])
            }

            return
          }

          // If the user doesn't press the same key multiple times, find the item which starts with the search string
          const targetIndex = data.findIndex(item =>
            item.label.toLocaleLowerCase().startsWith(newSearch)
          )

          // No data item matches
          if (targetIndex <= -1) {
            setInternalIndexAfterSearch(undefined)
            return
          }

          // Data item found
          setInternalIndexAfterSearch(targetIndex)

          return
        }
      }
    }

    const onOptionMouseDown = () => {
      ignoreBlur.current = true
    }

    const onOptionMouseEnter = (index: number) => {
      setInternalIndex(index)
    }

    const onOptionClick = (index: number) => {
      setInternalIndex(index)
      setInternalOptionValue(index)
    }

    const listPosition = useMemo<CSSProperties>(() => {
      return {
        position: 'absolute',
        left: (open && triggerPosition?.left) || undefined,
        top:
          open && triggerPosition
            ? `${triggerPosition.top + triggerPosition.height}px`
            : undefined,
        width: triggerPosition?.width
          ? `${triggerPosition.width}px`
          : undefined,
      }
    }, [open, triggerPosition])

    const triggerProps: SelectTriggerRenderProps = {
      id: ids.trigger,
      ref: triggerRef,
      type: 'button',
      onClick: onClick,
      onBlur: onBlur,
      onKeyDown: onKeyDown,
      tabIndex: 0,
      disabled,
      'aria-controls': ids.list,
      'aria-expanded': internalOpen,
      'aria-haspopup': 'listbox',
      'aria-labelledby': ids.label,
      'aria-activedescendant': ids.getOption(internalIndex) || undefined,
      'aria-label': getCurrentOption()?.label,
      'aria-disabled': disabled,
      'data-disabled': disabled,
      className: getIsVisiblityClassNamesRelative(classNames?.trigger)
        ? cn(
            classNames?.trigger?.default,
            open ? classNames?.trigger?.open : classNames?.trigger?.closed,
            disabled ? classNames?.trigger?.disabled : undefined
          )
        : classNames?.trigger,
      style: getIsVisibilityStylesRelative(styles?.trigger)
        ? mergeObjects(
            styles?.trigger,
            open ? styles?.trigger?.open : styles?.trigger?.closed,
            disabled ? styles?.trigger?.disabled : undefined
          )
        : styles?.trigger,
    }

    const getListItemProps = (
      { value: optionValue }: SelectOption,
      index: number
    ): SelectOptionRenderProps => {
      const isActive = internalIndex === index
      const isSelected = optionValue === value

      return {
        id: ids.getOption(index),
        role: 'option',
        tabIndex: -1,
        'aria-selected': isSelected,
        onClick: () => onOptionClick(index),
        onMouseDown: onOptionMouseDown,
        onMouseEnter: () => onOptionMouseEnter(index),
        className: getIsOptionClassNamesRelative(classNames?.option)
          ? cn(
              classNames?.option?.default,
              isSelected && classNames?.option?.selected,
              isActive && classNames?.option?.active
            )
          : classNames?.option,
        style: getIsOptionStylesRelative(styles?.option)
          ? mergeObjects(
              styles?.option,
              isSelected ? styles?.option?.selected : undefined,
              isActive ? styles?.option?.active : undefined
            )
          : styles?.option,
      }
    }

    useEffect(() => {
      const onWindowKeyDown = (event: KeyboardEvent) => {
        if (event.key === keys.escape) {
          reset()
        }
      }

      if (open) {
        window.addEventListener('keydown', onWindowKeyDown)
      } else {
        window.removeEventListener('keydown', onWindowKeyDown)
      }

      return () => {
        window.removeEventListener('keydown', onWindowKeyDown)
      }
    }, [open])

    useUpdateInternalOnExternalChange({
      setInternalValue,
      defaultValue,
      externalValue,
    })

    useUpdateInternalOnExternalChange({
      setInternalValue: setInternalOpen,
      defaultValue: defaultOpen,
      externalValue: externalOpen,
    })

    return (
      <div
        {...props}
        id={ids.root}
        ref={ref}
        style={mergeObjects(style, styles?.root)}
        className={cn(className, classNames?.root)}
      >
        <label
          id={ids.label}
          className={classNames?.label}
          style={styles?.label}
        >
          {label}
        </label>

        {!renderTrigger && (
          <button {...triggerProps}>
            {getCurrentOption()?.label || placeholder}
          </button>
        )}

        {renderTrigger && (
          <>
            {renderTrigger({
              triggerProps,
              selectedOption: getCurrentOption(),
            })}
          </>
        )}

        <Portal>
          {open && triggerRef.current && (
            <ul
              id={ids.list}
              role='listbox'
              tabIndex={-1}
              className={classNames?.list}
              style={{
                ...listPosition,
                ...styles?.list,
              }}
            >
              {data.map((option, index) => (
                <Fragment key={`${option.value}${index}`}>
                  {!renderOption && (
                    <li {...getListItemProps(option, index)}>{option.label}</li>
                  )}

                  {renderOption && (
                    <>
                      {renderOption({
                        optionProps: getListItemProps(option, index),
                        option,
                        index,
                        state: {
                          selected: option.value === value,
                        },
                      })}
                    </>
                  )}
                </Fragment>
              ))}
            </ul>
          )}
        </Portal>
      </div>
    )
  }
)

Select.displayName = 'FeliceSelect'
