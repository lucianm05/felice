import { Orientation } from '@lib/types'
import {
  getNextElementInSequence,
  getSequenceDirection,
  isDefined,
} from '@lib/utils'
import {
  HTMLProps,
  KeyboardEvent,
  ReactNode,
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

interface Radio {
  label: ReactNode
  value: string
  description?: ReactNode
  content?: ReactNode
}

export interface RadioGroupProps
  extends Omit<HTMLProps<HTMLDivElement>, 'role' | 'data'> {
  label: string
  data: Radio[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  orientation?: Orientation
}

interface RadioButtonProps
  extends Omit<Radio, 'value'>,
    Omit<HTMLProps<HTMLDivElement>, 'value' | 'label' | 'content'> {
  onIdLoad?: (id: string) => void
}

const RadioButton = ({
  label,
  description,
  content,
  id: externalId,
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
      aria-labelledby={labelId}
      aria-describedby={description ? descriptionId : undefined}
    >
      <div>
        <span id={labelId}>{label}</span>

        {description && <span id={descriptionId}>{description}</span>}
      </div>

      {content}
    </div>
  )
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

    const setInternalValueHandler = (value: string) => {
      setInternalValue(value)
      onValueChange?.(value)
    }

    const onRadioButtonKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (!internalRef.current) return

      const elements =
        internalRef.current.querySelectorAll<HTMLDivElement>('div[role=radio]')

      const direction = getSequenceDirection(event.key, orientation)

      if (!direction) return

      const nextElement = getNextElementInSequence<HTMLDivElement>(
        currentIndex,
        elements,
        direction
      )

      if (!nextElement) return

      nextElement.focus()
    }

    return (
      <div {...props} ref={internalRef} role='radiogroup' aria-label={label}>
        {data.map((radio, index) => {
          const { value, label, content, description } = radio
          const isChecked = groupValue === value
          const isDisabled = index === 1
          const tabIndex = currentIndex === index ? 0 : -1

          return (
            <RadioButton
              key={`${label}@${value}`}
              label={label}
              description={description}
              content={content}
              onClick={() => {
                setInternalValueHandler(value)
              }}
              onFocus={() => {
                setInternalValueHandler(value)
              }}
              onKeyDown={onRadioButtonKeyDown}
              tabIndex={tabIndex}
              disabled={isDisabled}
              aria-checked={isChecked}
              data-checked={isChecked}
              data-disabled={isDisabled}
            />
          )
        })}
      </div>
    )
  }
)

RadioGroup.displayName = 'FeliceRadioGroup'
