import { isDefined } from '@lib/utils'
import {
  HTMLProps,
  ReactNode,
  forwardRef,
  useId,
  useLayoutEffect,
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
}

interface RadioButtonProps
  extends Radio,
    Omit<HTMLProps<HTMLDivElement>, 'value' | 'label' | 'content'> {
  onIdLoad?: (id: string) => void
}

const RadioButton = ({
  label,
  description,
  content,
  id: externalId,
  onIdLoad,
  ...props
}: RadioButtonProps) => {
  const internalId = useId()
  const labelId = useId()
  const descriptionId = useId()

  const id = externalId || internalId

  useLayoutEffect(() => {
    onIdLoad?.(id)
  }, [])

  return (
    <div
      {...props}
      id={id}
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

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      label,
      data,
      defaultValue = '',
      value: externalValue,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const [ids, setIds] = useState<string[]>([])
    const [internalValue, setInternalValue] = useState(() => {
      if (isDefined(externalValue)) return externalValue
      return defaultValue
    })

    const groupValue = isDefined(externalValue) ? externalValue : internalValue

    const setInternalValueHandler = (index: number, value: string) => {
      setInternalValue(value)
      onValueChange?.(value)
    }

    const getTabIndex = (index: number, value: string) => {
      if (!groupValue) {
        return index === 0 ? 0 : -1
      }

      return groupValue === value ? 0 : -1
    }

    console.log(ids)

    return (
      <div {...props} ref={ref} role='radiogroup' aria-label={label}>
        {data.map((radio, index) => {
          const { value } = radio
          const isChecked = groupValue === value

          return (
            <RadioButton
              key={`${label}@${value}`}
              {...radio}
              onIdLoad={id => setIds(prev => [...prev, id])}
              onClick={() => {
                setInternalValueHandler(index, value)
              }}
              tabIndex={getTabIndex(index, value)}
              aria-checked={isChecked}
              data-checked={isChecked}
            />
          )
        })}
      </div>
    )
  }
)

RadioGroup.displayName = 'FeliceRadioGroup'
