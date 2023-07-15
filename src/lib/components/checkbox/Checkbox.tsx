import {
  CheckboxClassNames,
  CheckboxStyleable,
  CheckboxStyles,
} from '@lib/components/checkbox/types'
import { getClassNames, getStyles } from '@lib/components/checkbox/utils'
import { CheckableChildren } from '@lib/types'
import { cn, isDefined, mergeObjects } from '@lib/utils'
import {
  CSSProperties,
  HTMLProps,
  MouseEvent,
  forwardRef,
  useEffect,
  useId,
  useState,
} from 'react'

export interface CheckboxProps
  extends Omit<
    HTMLProps<HTMLButtonElement>,
    'type' | 'aria-checked' | 'role' | 'children'
  > {
  children?: CheckableChildren
  label: string
  hideLabel?: boolean
  defaultChecked?: boolean
  checked?: boolean
  onCheckedChanged?: (value: boolean) => void
  indicator?: CheckableChildren
  styles?: CheckboxStyleable<CSSProperties, CheckboxStyles>
  classNames?: CheckboxStyleable<string, CheckboxClassNames>
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
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
      id: externalId,
      onCheckedChanged,
      onClick,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = useState(
      isDefined(externalChecked) ? externalChecked : defaultChecked
    )

    const checked = isDefined(externalChecked)
      ? externalChecked
      : internalChecked

    const labelId = useId()
    const internalId = useId()
    const id = externalId || internalId

    const dataAttributes = {
      'data-checked': checked,
      'data-disabled': disabled,
    }

    const state = {
      checked,
      disabled,
    }

    const onClickInternal = (event: MouseEvent<HTMLButtonElement>) => {
      if (disabled) return

      onClick?.(event)

      if (event.isDefaultPrevented()) return

      setInternalChecked(!checked)
      onCheckedChanged?.(!checked)
    }

    useEffect(() => {
      if (isDefined(externalChecked)) {
        setInternalChecked(externalChecked)
        return
      }

      if (!isDefined(defaultChecked)) return

      setInternalChecked(defaultChecked)
    }, [defaultChecked, externalChecked])

    return (
      <div
        style={getStyles(styles?.root, checked, disabled)}
        className={getClassNames(classNames?.root, checked, disabled)}
        {...dataAttributes}
      >
        <button
          {...props}
          ref={ref}
          id={id}
          type='button'
          role='checkbox'
          disabled={disabled}
          style={mergeObjects(
            style,
            getStyles(styles?.checkbox, checked, disabled)
          )}
          className={cn(
            className,
            getClassNames(classNames?.checkbox, checked, disabled)
          )}
          onClick={onClickInternal}
          aria-checked={checked}
          aria-disabled={disabled}
          aria-labelledby={hideLabel ? undefined : labelId}
          aria-label={hideLabel ? label : undefined}
          {...dataAttributes}
        >
          {!children && (
            <>
              {typeof indicator === 'function' && indicator({ state })}

              {typeof indicator !== 'function' && indicator}
            </>
          )}

          {children && (
            <>
              {typeof children === 'function' && children({ state })}

              {typeof children !== 'function' && children}
            </>
          )}
        </button>

        {!hideLabel && (
          <label
            id={labelId}
            htmlFor={id}
            style={styles?.label}
            className={classNames?.label}
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'FeliceCheckbox'
