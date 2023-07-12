import { Portal } from '@lib/components/portal/Portal'
import { keys } from '@lib/constants/keys'
import { useElementPosition } from '@lib/hooks/useElementPosition'
import { cn, isDefined } from '@lib/utils'
import {
  CSSProperties,
  Fragment,
  HTMLProps,
  KeyboardEventHandler,
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
} from 'react'
import classes from './Select.module.css'
import { SelectOption, SelectStyleable } from './types'

export interface SelectTriggerProps
  extends Pick<
      HTMLProps<HTMLButtonElement>,
      | 'aria-controls'
      | 'aria-expanded'
      | 'aria-labelledby'
      | 'aria-activedescendant'
      | 'aria-label'
      | 'aria-haspopup'
      | 'className'
      | 'style'
    >,
    Required<
      Pick<
        HTMLProps<HTMLButtonElement>,
        'id' | 'ref' | 'onClick' | 'onBlur' | 'onKeyDown' | 'tabIndex'
      >
    > {
  type: 'button'
}

export interface SelectOptionProps
  extends Pick<HTMLProps<HTMLLIElement>, 'className' | 'style'>,
    Required<
      Pick<
        HTMLProps<HTMLLIElement>,
        | 'id'
        | 'role'
        | 'tabIndex'
        | 'aria-selected'
        | 'onClick'
        | 'onMouseDown'
        | 'onMouseEnter'
      >
    > {}

export interface SelectProps {
  label: string
  data: SelectOption[]
  id?: string
  placeholder?: string
  classNames?: SelectStyleable<string>
  styles?: SelectStyleable<CSSProperties>
  renderTrigger?: (
    props: SelectTriggerProps,
    selectedOption?: SelectOption
  ) => JSX.IntrinsicElements['button']
  renderOption?: (
    props: SelectOptionProps,
    option: SelectOption,
    index: number
  ) => JSX.IntrinsicElements['li']
  open?: boolean
  onOpenChange?: (open: boolean) => void
  selectedOption?: SelectOption
  onOptionChange?: (option: SelectOption) => void
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      id: externalId,
      data,
      label,
      placeholder,
      classNames,
      styles,
      renderTrigger,
      renderOption,
      open = false,
      onOpenChange,
      selectedOption,
      onOptionChange,
    },
    ref
  ) => {
    const [internalIndex, setInternalIndex] = useState<number | undefined>()
    const [internalOption, setInternalOption] = useState<
      SelectOption | undefined
    >(selectedOption)
    const [internalOpen, setInternalOpen] = useState(open)
    const [internalSearch, setInternalSearch] = useState('')
    const ignoreBlur = useRef(false)

    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const triggerPosition = useElementPosition(triggerRef)

    const internalId = useId()
    const id = externalId || internalId

    const maxIndex = data.length - 1

    const ids = {
      label: `${id}-label`,
      trigger: id,
      list: `${id}-listbox`,
      getOption: (index?: number) => {
        if (index === undefined) return ''

        return `${id}-option-${index}`
      },
    }

    const clearSearchTimeout = useRef<any | null>(null)

    const setInternalOpenHandler = useCallback(
      (open: boolean) => {
        setInternalOpen(open)
        onOpenChange?.(open)
      },
      [onOpenChange]
    )

    const setInternalOptionValue = useCallback(
      (index: number) => {
        const newOption = data[index]
        setInternalOption(newOption)
        onOptionChange?.(newOption)
        setInternalOpenHandler(false)
      },
      [data, onOptionChange, setInternalOpenHandler]
    )

    const setInternalIndexAfterSearch = useCallback((index?: number) => {
      setInternalIndex(index)

      // Clear internalSearch after the user stops typing
      clearSearchTimeout.current = setTimeout(() => {
        setInternalSearch('')
      }, 500)
    }, [])

    const reset = useCallback(() => {
      setInternalOpenHandler(false)
      const idx = data.findIndex(i => i.value === internalOption?.value)
      setInternalIndex(idx < 0 ? undefined : idx)
    }, [data, internalOption, setInternalOpenHandler])

    const onBlur = useCallback(() => {
      if (ignoreBlur.current) {
        ignoreBlur.current = false
        return
      }

      reset()
    }, [reset])

    const onClick = () => {
      if (ignoreBlur.current) {
        ignoreBlur.current = false
        return
      }

      setInternalOpenHandler(!internalOpen)
    }

    const onKeyDown: KeyboardEventHandler<HTMLButtonElement> = event => {
      const { code, altKey, key } = event

      switch (code) {
        case keys.arrowDown: {
          event.preventDefault()

          if (!internalOpen) {
            setInternalOpenHandler(true)
            return
          }

          if (!isDefined(internalIndex)) {
            setInternalIndex(0)
            return
          }

          if (internalIndex < maxIndex) {
            setInternalIndex(prev => (prev || 0) + 1)
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
            return
          }

          if (!internalIndex) {
            setInternalIndex(0)
            return
          }

          if (internalIndex > 0) {
            setInternalIndex(prev => (prev || maxIndex) - 1)
            return
          }

          return
        }

        case keys.enter:
        case keys.space:
        case keys.tab: {
          ignoreBlur.current = true

          if (!internalOpen && code !== keys.tab) {
            setInternalOpenHandler(true)
            return
          }

          if (!isDefined(internalIndex)) return

          setInternalIndex(internalIndex)
          setInternalOptionValue(internalIndex)
          return
        }

        case keys.home: {
          event.preventDefault()

          if (!internalOpen) setInternalOpenHandler(true)
          setInternalIndex(0)
          return
        }

        case keys.end: {
          event.preventDefault()

          if (!internalOpen) setInternalOpenHandler(true)
          setInternalIndex(maxIndex)
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
            return
          }

          if (internalIndex - 10 <= 0) {
            setInternalIndex(0)
            return
          }

          setInternalIndex(internalIndex - 10)

          return
        }

        case keys.pageDown: {
          if (!internalOpen) return

          event.preventDefault()

          if (!isDefined(internalIndex)) {
            setInternalIndex(0)
            return
          }

          if (internalIndex + 10 > maxIndex) {
            setInternalIndex(maxIndex)
            return
          }

          setInternalIndex(internalIndex + 10)

          return
        }

        default: {
          if (key.length !== 1) return

          // Clearing timeout so multiple letters can be typed
          if (clearSearchTimeout.current) {
            clearTimeout(clearSearchTimeout.current)
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

    const onOptionClick = useCallback(
      (index: number) => {
        setInternalIndex(index)
        setInternalOptionValue(index)
      },
      [setInternalOptionValue]
    )

    const triggerProps: SelectTriggerProps = {
      id: ids.trigger,
      ref: triggerRef,
      type: 'button',
      onClick: onClick,
      onBlur: onBlur,
      onKeyDown: onKeyDown,
      tabIndex: 0,
      'aria-controls': ids.list,
      'aria-expanded': internalOpen,
      'aria-haspopup': 'listbox',
      'aria-labelledby': ids.label,
      'aria-activedescendant': ids.getOption(internalIndex) || undefined,
      'aria-label': internalOption?.label,
      className: classNames?.trigger,
      style: styles?.trigger,
    }

    const getListItemProps = (
      { value }: SelectOption,
      index: number
    ): SelectOptionProps => {
      const isActive = internalIndex === index
      const isSelected = internalOption?.value === value

      return {
        id: ids.getOption(index),
        role: 'option',
        tabIndex: -1,
        'aria-selected': value === internalOption?.value,
        onClick: () => onOptionClick(index),
        onMouseDown: onOptionMouseDown,
        onMouseEnter: () => onOptionMouseEnter(index),
        className: cn(
          classNames?.option,
          isActive && classNames?.activeOption,
          isSelected && classNames?.selectedOption
        ),
        style: {
          ...styles?.option,
          ...(isActive ? styles?.activeOption : {}),
          ...(isSelected ? styles?.selectedOption : {}),
        },
      }
    }

    return (
      <div ref={ref} className={classNames?.root} style={styles?.root}>
        <label
          id={ids.label}
          className={classNames?.label}
          style={styles?.label}
        >
          {label}
        </label>

        {!renderTrigger && (
          <button {...triggerProps}>
            {internalOption?.label || placeholder}
          </button>
        )}

        {renderTrigger && <>{renderTrigger(triggerProps, internalOption)}</>}

        <Portal>
          <ul
            id={ids.list}
            role='listbox'
            tabIndex={-1}
            className={cn(
              internalOpen
                ? classes['felice__select_listbox']
                : 'felice__sr-only',
              classNames?.list
            )}
            style={{
              left: (internalOpen && triggerPosition?.left) || undefined,
              top:
                internalOpen && triggerPosition
                  ? `${triggerPosition.top + triggerPosition.height}px`
                  : undefined,
              ...styles?.list,
            }}
          >
            {data.map((option, index) => (
              <Fragment key={option.value}>
                {!renderOption && (
                  <li
                    {...getListItemProps(option, index)}
                    onMouseEnter={() => {
                      onOptionMouseEnter(index)
                    }}
                  >
                    {option.label}
                  </li>
                )}

                {renderOption && (
                  <>
                    {renderOption(
                      getListItemProps(option, index),
                      option,
                      index
                    )}
                  </>
                )}
              </Fragment>
            ))}
          </ul>
        </Portal>
      </div>
    )
  }
)

Select.displayName = 'FeliceSelect'
