import {
  RadioButton as Radio,
  RadioButtonClassNames,
  RadioButtonState,
  RadioButtonStyles,
  RadioGroupStyleable,
} from '@lib/components/radio-group/types'
import {
  getClassNames,
  getStyles,
  isItemDisabled,
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

interface RadioButtonProps extends Radio, RadioButtonState {}

const RadioButton = ({
  label,
  description,
  value,
  id: externalId,
  checked,
  render,
  style,
  styles,
  className,
  classNames,
  disabled,
  ...props
}: RadioButtonProps) => {
  const internalId = useId()
  const labelId = useId()
  const descriptionId = useId()

  const id = externalId || internalId

  const rootProps = {
    style: getStyles(styles?.root, disabled, checked),
    className: getClassNames(classNames?.root, disabled, checked),
    'data-disabled': disabled,
    'data-checked': checked,
  } as const

  const buttonProps = {
    ...props,
    type: 'button',
    id,
    role: 'radio',
    style: mergeObjects(style, getStyles(styles?.button, disabled, checked)),
    className: cn(
      className,
      getClassNames(classNames?.button, disabled, checked)
    ),
    disabled,
    'aria-labelledby': label ? labelId : undefined,
    'aria-describedby': description ? descriptionId : undefined,
    'aria-label': label ? undefined : value,
    'aria-checked': checked,
    'aria-disabled': disabled,
    'data-disabled': disabled,
    'data-checked': checked,
  } as const

  const textContainerProps = {
    style: styles?.textContainer,
    className: classNames?.textContainer,
  } as const

  const labelProps = {
    id: labelId,
    htmlFor: id,
    style: styles?.label,
    className: classNames?.label,
  } as const

  const descriptionProps = {
    id: descriptionId,
    style: styles?.description,
    className: classNames?.description,
  } as const

  if (render) {
    return render({
      state: { checked, disabled },
      rootProps,
      buttonProps,
      textContainerProps,
      labelProps,
      descriptionProps,
    })
  }

  return (
    <div {...rootProps}>
      <button {...buttonProps} />

      {(label || description) && (
        <div {...textContainerProps}>
          {label && <label {...labelProps}>{label}</label>}

          {description && <p {...descriptionProps}>{description}</p>}
        </div>
      )}
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
  classNames?: RadioGroupStyleable<string, RadioButtonClassNames>
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

    const getTabIndex = (index: number) => {
      const isSelected = index === currentIndex

      const currentElement = data[currentIndex]

      const isCurrentElementDisabled = isItemDisabled(
        groupDisabled,
        currentElement.disabled
      )

      if (isCurrentElementDisabled) {
        const firstEnabledIndex = data.findIndex(
          element => !isItemDisabled(groupDisabled, element.disabled)
        )

        if (firstEnabledIndex >= 0) return index === firstEnabledIndex ? 0 : -1
      }

      return isSelected ? 0 : -1
    }

    const setInternalValueHandler = (
      value: string,
      event: MouseEvent | FocusEvent
    ) => {
      if (event.defaultPrevented) return

      setInternalValue(value)
      onValueChange?.(value)
    }

    const onRadioButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (!internalRef.current || event.defaultPrevented) return

      const elements =
        internalRef.current.querySelectorAll<HTMLDivElement>(
          'button[role=radio]'
        )

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
          const isDisabled = isItemDisabled(groupDisabled, disabled)
          const tabIndex = getTabIndex(index)

          const getClassNamesHandler = (classNames?: RadioButtonClassNames) =>
            getClassNames(classNames, isDisabled, isChecked)

          const radioButtonProps = {
            ...rest,
            value,
            onClick: (event: MouseEvent<HTMLButtonElement>) => {
              if (isDisabled) return
              rest?.onClick?.(event)
              setInternalValueHandler(value, event)
            },
            onFocus: (event: FocusEvent<HTMLButtonElement>) => {
              if (isDisabled) return
              rest?.onFocus?.(event)
              setInternalValueHandler(value, event)
            },
            onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
              if (isDisabled) return
              rest?.onKeyDown?.(event)
              onRadioButtonKeyDown(event)
            },
            tabIndex,
            disabled: isDisabled,
            checked: isChecked,
            styles: {
              root: mergeObjects(styles?.radioButton?.root, rest?.styles?.root),
              button: mergeObjects(
                styles?.radioButton?.button,
                rest?.styles?.button
              ),
              description: mergeObjects(
                styles?.radioButton?.description,
                rest?.styles?.description
              ),
              label: mergeObjects(
                styles?.radioButton?.label,
                rest?.styles?.label
              ),
              textContainer: mergeObjects(
                styles?.radioButton?.textContainer,
                rest?.styles?.textContainer
              ),
            },
            classNames: {
              root: cn(
                getClassNamesHandler(classNames?.radioButton?.root),
                getClassNamesHandler(rest?.classNames?.root)
              ),
              button: cn(
                getClassNamesHandler(classNames?.radioButton?.button),
                getClassNamesHandler(rest?.classNames?.button)
              ),
              description: cn(
                classNames?.radioButton?.description,
                rest?.classNames?.description
              ),
              label: cn(
                classNames?.radioButton?.label,
                rest?.classNames?.label
              ),
              textContainer: cn(
                classNames?.radioButton?.textContainer,
                rest?.classNames?.textContainer
              ),
            },
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
