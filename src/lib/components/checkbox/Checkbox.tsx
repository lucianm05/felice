import {
  CheckboxClassNames,
  CheckboxIndicator,
  CheckboxStyle,
} from '@lib/components/checkbox/types'
import {
  getClassNames,
  getIsIndicatorRelative,
  getStyles,
} from '@lib/components/checkbox/utils'
import { HTMLProps, MouseEvent, forwardRef, useState } from 'react'

export interface CheckboxProps
  extends Omit<
    HTMLProps<HTMLButtonElement>,
    'type' | 'aria-checked' | 'role' | 'style' | 'className'
  > {
  label: string
  defaultChecked?: boolean
  checked?: boolean
  onCheckedChanged?: (value: boolean) => void
  indicator?: CheckboxIndicator
  style?: CheckboxStyle
  className?: CheckboxClassNames
}

const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      children,
      label,
      defaultChecked = false,
      checked: externalChecked,
      indicator,
      style,
      className,
      onCheckedChanged,
      onClick,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = useState(
      typeof externalChecked === 'boolean' ? externalChecked : defaultChecked
    )

    const checked =
      typeof externalChecked === 'boolean' ? externalChecked : internalChecked

    const onClickInternal = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)

      if (event.isDefaultPrevented()) return

      setInternalChecked(!checked)
      onCheckedChanged?.(!checked)
    }

    return (
      <button
        {...props}
        type='button'
        ref={ref}
        role='checkbox'
        style={getStyles(style, checked)}
        className={getClassNames(className, checked)}
        onClick={onClickInternal}
        aria-label={label || props['aria-label']}
        aria-checked={checked}
        data-checked={checked}
      >
        {!children && indicator && (
          <>
            {getIsIndicatorRelative(indicator) ? (
              <>
                {checked && indicator.checked}
                {!checked && indicator.unchecked}
              </>
            ) : (
              <>{indicator}</>
            )}
          </>
        )}

        {children}
      </button>
    )
  }
)

Checkbox.displayName = 'FeliceCheckbox'

export default Checkbox
