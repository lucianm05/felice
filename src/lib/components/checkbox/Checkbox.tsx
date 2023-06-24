import { HTMLProps, ReactNode, forwardRef, useCallback, useState } from 'react'

export interface CheckboxProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'type' | 'aria-checked'> {
  label: string
  defaultChecked?: boolean
  indication?: ReactNode
}

const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ label, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = useState(false)

    const onClickInternal = useCallback(() => {
      setInternalChecked(prev => !prev)
    }, [])

    return (
      <button
        type='button'
        ref={ref}
        role='checkbox'
        onClick={onClickInternal}
        aria-label={label || props['aria-label']}
        aria-checked={internalChecked}
      ></button>
    )
  }
)

Checkbox.displayName = 'FeliceCheckbox'

export default Checkbox
