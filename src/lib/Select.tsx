import { keys } from '@lib/constants/keys'
import useElementPosition from '@lib/hooks/useElementPosition'
import Portal from '@lib/Portal'
import { cn, isDefined } from '@lib/utils'
import {
  CSSProperties,
  forwardRef,
  Fragment,
  HTMLProps,
  KeyboardEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

interface SelectStyleable<T> {
  root?: T
  label?: T
  trigger?: T
  list?: T
  option?: T
  activeOption?: T
  selectedOption?: T
}

export type SelectOption = { label: string; value: string }

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
  id: string
  label: string
  data: SelectOption[]
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

const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      id,
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
    const ignoreBlur = useRef(false)

    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const triggerPosition = useElementPosition(triggerRef)

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

    useEffect(() => {
      if (!onOpenChange) return

      onOpenChange(internalOpen)
    }, [internalOpen])

    const setInternalOptionValue = useCallback(
      (index: number) => {
        const newOption = data[index]
        setInternalOption(newOption)
        onOptionChange?.(newOption)
        setInternalOpen(false)
      },
      [data, onOptionChange]
    )

    const reset = useCallback(() => {
      setInternalOpen(false)
      const idx = data.findIndex(i => i.value === internalOption?.value)
      setInternalIndex(idx < 0 ? undefined : idx)
    }, [data, internalOption])

    const onBlur = useCallback(() => {
      if (ignoreBlur.current) {
        ignoreBlur.current = false
        return
      }

      reset()
    }, [reset])

    const onClick = useCallback(() => {
      if (ignoreBlur.current) {
        ignoreBlur.current = false
        return
      }

      setInternalOpen(prevState => !prevState)
    }, [])

    const onKeyDown: KeyboardEventHandler<HTMLButtonElement> = event => {
      const { code, altKey } = event

      switch (code) {
        case keys.arrowDown: {
          if (!internalOpen) {
            setInternalOpen(true)
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
          if (altKey) {
            if (internalIndex) setInternalOptionValue(internalIndex)
            setInternalOpen(false)
            return
          }

          if (!internalOpen) {
            setInternalOpen(true)
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
            setInternalOpen(true)
            return
          }

          if (!isDefined(internalIndex)) return

          setInternalIndex(internalIndex)
          setInternalOptionValue(internalIndex)
          return
        }

        case keys.home: {
          if (!internalOpen) setInternalOpen(true)
          setInternalIndex(0)
          return
        }

        case keys.end: {
          if (!internalOpen) setInternalOpen(true)
          setInternalIndex(maxIndex)
          return
        }

        case keys.escape: {
          reset()
          return
        }

        case keys.pageUp: {
          if (!internalOpen) return

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
      'aria-activedescendant': ids.getOption(internalIndex),
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
              internalOpen ? 'felice__select_listbox' : 'screenreaders-only',
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

Select.displayName = 'Select'

export default Select
