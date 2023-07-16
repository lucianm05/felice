import {
  RadioButton as Radio,
  RadioButtonClassNames,
  RadioButtonStyles,
  RadioGroupClassNames,
  RadioGroupStyles,
} from '@lib/components/radio-group/types'
import {
  getClassNames,
  getCurrentIndex,
  getStyles,
  getTabIndex,
  isItemDisabled,
} from '@lib/components/radio-group/utils'
import { useUpdateInternalOnExternalChange } from '@lib/hooks/useUpdateInternalOnExternalChange'
import { Orientation } from '@lib/types'
import {
  cn,
  getNextElementInSequence,
  getSequenceDirection,
  isDefined,
  mergeObjects,
} from '@lib/utils'
import {
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

export interface RadioGroupProps
  extends Omit<HTMLProps<HTMLDivElement>, 'data'> {
  label: string
  data: Radio[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  orientation?: Orientation
  disabled?: boolean
  styles?: RadioGroupStyles
  classNames?: RadioGroupClassNames
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
      id: externalId,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(() => {
      if (isDefined(externalValue)) return externalValue
      return defaultValue
    })

    const internalRef = useRef<RadioGroupRef>(null)

    useImperativeHandle<RadioGroupRef, RadioGroupRef>(
      ref,
      () => internalRef.current,
      []
    )

    const internalId = useId()
    const id = externalId || internalId

    const ids = {
      radioGroup: id,
      getRoot: (index: number) => `${id}-radio-${index}-root`,
      getRadio: (index: number) => `${id}-radio-${index}-button`,
      getLabel: (index: number) => `${id}-radio-${index}-label`,
      getDescription: (index: number) => `${id}-radio-${index}-description`,
    }

    const groupValue = isDefined(externalValue) ? externalValue : internalValue

    const currentIndex = getCurrentIndex(data, groupValue)

    const setInternalValueHandler = (
      value: string,
      event: MouseEvent | FocusEvent,
      isDisabled: boolean
    ) => {
      if (event.defaultPrevented || isDisabled) return

      setInternalValue(value)
      onValueChange?.(value)
    }

    const onRadioButtonKeyDown = (
      event: KeyboardEvent<HTMLButtonElement>,
      isDisabled: boolean
    ) => {
      if (!internalRef.current || event.defaultPrevented || isDisabled) return

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

    useUpdateInternalOnExternalChange({
      setInternalValue,
      defaultValue,
      externalValue,
    })

    return (
      <div
        {...props}
        ref={internalRef}
        id={ids.radioGroup}
        role='radiogroup'
        style={mergeObjects(style, styles?.root)}
        className={cn(className, classNames?.root)}
        aria-label={label}
      >
        {data.map(
          (
            {
              value,
              disabled,
              classNames: itemClassNames,
              description,
              label,
              render,
              styles: itemStyles,
            },
            index
          ) => {
            const isChecked = groupValue === value
            const isDisabled = isItemDisabled(groupDisabled, disabled)
            const tabIndex = getTabIndex(
              index,
              data,
              currentIndex,
              groupDisabled
            )

            const getStylesHandler = (styles?: RadioButtonStyles) =>
              getStyles(styles, isDisabled, isChecked)

            const getClassNamesHandler = (classNames?: RadioButtonClassNames) =>
              getClassNames(classNames, isDisabled, isChecked)

            const dataAttributes = {
              'data-disabled': isDisabled,
              'data-checked': isChecked,
            } as const

            const rootProps = {
              id: ids.getRoot(index),
              style: mergeObjects(
                getStylesHandler(styles?.radioButton?.root),
                getStylesHandler(itemStyles?.root)
              ),
              className: cn(
                getClassNamesHandler(classNames?.radioButton?.root),
                getClassNamesHandler(itemClassNames?.root)
              ),
              ...dataAttributes,
            } as const

            const buttonProps = {
              id: ids.getRadio(index),
              type: 'button',
              role: 'radio',
              tabIndex,
              style: mergeObjects(
                getStylesHandler(styles?.radioButton?.button),
                getStylesHandler(itemStyles?.button)
              ),
              className: cn(
                getClassNamesHandler(classNames?.radioButton?.button),
                getClassNamesHandler(itemClassNames?.button)
              ),
              disabled: isDisabled,
              onClick: (event: MouseEvent<HTMLButtonElement>) => {
                setInternalValueHandler(value, event, isDisabled)
              },
              onFocus: (event: FocusEvent<HTMLButtonElement>) => {
                setInternalValueHandler(value, event, isDisabled)
              },
              onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
                onRadioButtonKeyDown(event, isDisabled)
              },
              'aria-labelledby': ids.getLabel(index),
              'aria-describedby': ids.getDescription(index),
              'aria-checked': isChecked,
              'aria-disabled': isDisabled,
              ...dataAttributes,
            } as const

            const textContainerProps = {
              style: mergeObjects(
                getStylesHandler(styles?.radioButton?.textContainer),
                getStylesHandler(itemStyles?.textContainer)
              ),
              className: cn(
                getClassNamesHandler(classNames?.radioButton?.textContainer),
                getClassNamesHandler(itemClassNames?.textContainer)
              ),
              ...dataAttributes,
            } as const

            const labelProps = {
              id: ids.getLabel(index),
              htmlFor: internalId,
              style: mergeObjects(
                getStylesHandler(styles?.radioButton?.label),
                getStylesHandler(itemStyles?.label)
              ),
              className: cn(
                getClassNamesHandler(classNames?.radioButton?.label),
                getClassNamesHandler(itemClassNames?.label)
              ),
              ...dataAttributes,
            } as const

            const descriptionProps = {
              id: ids.getDescription(index),
              style: mergeObjects(
                getStylesHandler(styles?.radioButton?.description),
                getStylesHandler(itemStyles?.description)
              ),
              className: cn(
                getClassNamesHandler(classNames?.radioButton?.description),
                getClassNamesHandler(itemClassNames?.description)
              ),
              ...dataAttributes,
            } as const

            const key = `${label}@${value}@${index}`

            if (render) {
              return (
                <Fragment key={key}>
                  {render({
                    state: { checked: isChecked, disabled: isDisabled },
                    rootProps,
                    buttonProps,
                    textContainerProps,
                    labelProps,
                    descriptionProps,
                  })}
                </Fragment>
              )
            }

            return (
              <Fragment key={key}>
                <div {...rootProps}>
                  <button {...buttonProps} />

                  {(label || description) && (
                    <div {...textContainerProps}>
                      {label && <label {...labelProps}>{label}</label>}

                      {description && (
                        <p {...descriptionProps}>{description}</p>
                      )}
                    </div>
                  )}
                </div>
              </Fragment>
            )
          }
        )}
      </div>
    )
  }
)

RadioGroup.displayName = 'FeliceRadioGroup'
