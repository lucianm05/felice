import {
  CheckboxClassName,
  CheckboxIndicator,
  CheckboxStyle,
  CheckboxStyleable,
} from '@lib/components/checkbox/types'
import {
  getClassNames,
  getIsIndicatorRelative,
  getStyles,
} from '@lib/components/checkbox/utils'
import { cn, mergeObjects } from '@lib/utils'
import {
  CSSProperties,
  HTMLProps,
  MouseEvent,
  forwardRef,
  useId,
  useState,
} from 'react'

export interface CheckboxProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'type' | 'aria-checked' | 'role'> {
  label: string
  hideLabel?: boolean
  defaultChecked?: boolean
  checked?: boolean
  onCheckedChanged?: (value: boolean) => void
  indicator?: CheckboxIndicator
  styles?: CheckboxStyleable<CSSProperties, CheckboxStyle>
  classNames?: CheckboxStyleable<string, CheckboxClassName>
}

const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      children,
      label,
      hideLabel,
      defaultChecked = false,
      checked: externalChecked,
      indicator,
      style,
      styles,
      className,
      classNames,
      onCheckedChanged,
      onClick,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = useState(defaultChecked)

    const labelId = useId()

    const checked =
      typeof externalChecked === 'boolean' ? externalChecked : internalChecked

    const onClickInternal = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)

      if (event.isDefaultPrevented()) return

      setInternalChecked(!checked)
      onCheckedChanged?.(!checked)
    }

    return (
      <div style={styles?.root}>
        <button
          {...props}
          type='button'
          ref={ref}
          role='checkbox'
          style={mergeObjects(style, getStyles(styles?.checkbox, checked))}
          className={cn(
            className,
            getClassNames(classNames?.checkbox, checked)
          )}
          onClick={onClickInternal}
          aria-labelledby={labelId}
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

        <label
          id={labelId}
          style={hideLabel ? undefined : styles?.label}
          className={cn(hideLabel ? 'felice__sr-only' : classNames?.label)}
        >
          {label}
        </label>
      </div>
    )
  }
)

Checkbox.displayName = 'FeliceCheckbox'

export default Checkbox
