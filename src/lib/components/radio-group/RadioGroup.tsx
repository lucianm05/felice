import {
  RadioButton as Radio,
  RadioButtonClassName,
  RadioButtonStyles,
  RadioGroupStyleable,
} from '@lib/components/radio-group/types'
import {
  isRadioButtonClassNamesRelative,
  isRadioButtonStyleRelative,
} from '@lib/components/radio-group/utils'
import { Orientation } from '@lib/types'
import {
  cn,
  getNextElementInSequence,
  getSequenceDirection,
  isDefined,
  mergeObjects,
} from '@lib/utils'
import {
  CSSProperties,
  FocusEvent,
  Fragment,
  HTMLProps,
  KeyboardEvent,
  MouseEvent,
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

interface RadioButtonProps
  extends Radio,
    Omit<HTMLProps<HTMLDivElement>, 'value' | 'label' | 'content'> {
  checked: boolean
}

const RadioButton = ({
  label,
  description,
  content,
  value,
  id: externalId,
  checked,
  renderChildren,
  style,
  styles,
  className,
  classNames,
  ...props
}: RadioButtonProps) => {
  const internalId = useId()
  const labelId = useId()
  const descriptionId = useId()

  const id = externalId || internalId

  return (
    <div
      {...props}
      id={id}
      role='radio'
      style={mergeObjects(
        style,
        styles?.root,
        isRadioButtonStyleRelative(styles?.root)
          ? checked
            ? styles?.root?.checked
            : styles?.root?.unchecked
          : undefined
      )}
      className={cn(
        className,
        isRadioButtonClassNamesRelative(classNames?.root)
          ? cn(
              classNames?.root?.default,
              checked ? classNames?.root?.checked : classNames?.root?.unchecked
            )
          : classNames?.root
      )}
      aria-labelledby={label || renderChildren ? labelId : undefined}
      aria-describedby={
        description || renderChildren ? descriptionId : undefined
      }
      aria-label={label || renderChildren ? undefined : value}
    >
      {!renderChildren && (
        <>
          <div
            style={styles?.textContainer}
            className={classNames?.textContainer}
          >
            {label && (
              <span
                id={labelId}
                style={styles?.label}
                className={classNames?.label}
              >
                {label}
              </span>
            )}

            {description && (
              <span
                id={descriptionId}
                style={styles?.description}
                className={classNames?.description}
              >
                {description}
              </span>
            )}
          </div>

          {content}
        </>
      )}

      {renderChildren &&
        renderChildren({
          labelProps: { id: labelId },
          descriptionProps: { id: descriptionId },
          state: { checked },
        })}
    </div>
  )
}

export interface RadioGroupProps
  extends Omit<HTMLProps<HTMLDivElement>, 'data'> {
  label: string
  data: Radio[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  orientation?: Orientation
  disabled?: boolean
  styles?: RadioGroupStyleable<CSSProperties, RadioButtonStyles>
  classNames?: RadioGroupStyleable<string, RadioButtonClassName>
}

type RadioGroupRef = HTMLDivElement | null

export const RadioGroup = forwardRef<RadioGroupRef, RadioGroupProps>(
  (
    {
      label,
      data,
      defaultValue = '',
      value: externalValue,
      onValueChange,
      orientation = 'horizontal',
      disabled: groupDisabled = false,
      style,
      styles,
      className,
      classNames,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(() => {
      if (isDefined(externalValue)) return externalValue
      return defaultValue
    })

    useImperativeHandle<RadioGroupRef, RadioGroupRef>(
      ref,
      () => internalRef.current,
      []
    )

    const internalRef = useRef<RadioGroupRef>(null)

    const groupValue = isDefined(externalValue) ? externalValue : internalValue

    const getCurrentIndex = () => {
      const currentIndex = data.findIndex(
        element => element.value === groupValue
      )

      return currentIndex < 0 ? 0 : currentIndex
    }

    const currentIndex = getCurrentIndex()

    const setInternalValueHandler = (
      value: string,
      event: MouseEvent | FocusEvent
    ) => {
      if (event.defaultPrevented) return

      setInternalValue(value)
      onValueChange?.(value)
    }

    const onRadioButtonKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (!internalRef.current || event.defaultPrevented) return

      const elements =
        internalRef.current.querySelectorAll<HTMLDivElement>('div[role=radio]')

      const direction = getSequenceDirection(event.key, orientation)

      if (direction) {
        event.preventDefault()
        event.stopPropagation()

        const nextElement = getNextElementInSequence<HTMLDivElement>(
          currentIndex,
          elements,
          direction
        )

        if (!nextElement) return

        nextElement.focus()
      }
    }

    return (
      <div
        {...props}
        ref={internalRef}
        role='radiogroup'
        style={mergeObjects(style, styles?.root)}
        className={cn(className, classNames?.root)}
        aria-label={label}
      >
        {data.map(({ value, disabled, ...rest }, index) => {
          const isChecked = groupValue === value
          const isDisabled = isDefined(disabled) ? disabled : groupDisabled
          const tabIndex = currentIndex === index ? 0 : -1

          const radioButtonProps = {
            ...rest,
            value,
            onClick: (event: MouseEvent<HTMLDivElement>) => {
              rest?.onClick?.(event)
              setInternalValueHandler(value, event)
            },
            onFocus: (event: FocusEvent<HTMLDivElement>) => {
              rest?.onFocus?.(event)
              setInternalValueHandler(value, event)
            },
            onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
              rest?.onKeyDown?.(event)
              onRadioButtonKeyDown(event)
            },
            tabIndex,
            disabled: isDisabled,
            'aria-checked': isChecked,
            'aria-disabled': isDisabled,
            'data-checked': isChecked,
            'data-disabled': isDisabled,
            checked: isChecked,
          }

          return (
            <Fragment key={`${label}@${value}`}>
              <RadioButton {...radioButtonProps} />
            </Fragment>
          )
        })}
      </div>
    )
  }
)

RadioGroup.displayName = 'FeliceRadioGroup'
