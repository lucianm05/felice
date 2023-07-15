import {
  SwitchClassNames,
  SwitchStyle,
  SwitchStyleable,
} from '@lib/components/switch/types'
import { getClassNames, getStyles } from '@lib/components/switch/utils'
import { useUpdateInternalOnExternalChange } from '@lib/hooks/useUpdateInternalOnExternalChange'
import { CheckableChildren } from '@lib/types'
import { cn, isDefined, mergeObjects } from '@lib/utils'
import {
  CSSProperties,
  HTMLProps,
  MouseEvent,
  forwardRef,
  useId,
  useState,
} from 'react'

export interface SwitchProps
  extends Omit<
    HTMLProps<HTMLButtonElement>,
    'role' | 'type' | 'aria-checked' | 'children' | 'ref'
  > {
  children?: CheckableChildren
  label: string
  hideLabel?: boolean
  styles?: SwitchStyleable<CSSProperties, SwitchStyle>
  classNames?: SwitchStyleable<string, SwitchClassNames>
  defaultChecked?: boolean
  checked?: boolean
  onCheckedChange?: (value: boolean) => void
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      children,
      label,
      hideLabel,
      className,
      classNames,
      styles,
      style,
      defaultChecked = false,
      checked: externalChecked,
      onCheckedChange,
      onClick,
      disabled = false,
      id: externalId,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = useState(
      isDefined(externalChecked) ? externalChecked : defaultChecked
    )

    const checked =
      typeof externalChecked === 'boolean' ? externalChecked : internalChecked

    const labelId = useId()
    const internalId = useId()
    const id = externalId || internalId

    const dataAttributes = {
      'data-checked': checked,
      'data-disabled': disabled,
    }

    const onClickInternal = (event: MouseEvent<HTMLButtonElement>) => {
      if (disabled) return

      onClick?.(event)

      if (event.defaultPrevented) return

      const newChecked = !checked

      setInternalChecked(newChecked)
      onCheckedChange?.(newChecked)
    }

    useUpdateInternalOnExternalChange({
      setInternalValue: setInternalChecked,
      defaultValue: defaultChecked,
      externalValue: externalChecked,
    })

    return (
      <div
        style={styles?.root}
        className={classNames?.root}
        {...dataAttributes}
      >
        <button
          {...props}
          id={id}
          ref={ref}
          type='button'
          role='switch'
          style={mergeObjects(
            style,
            getStyles(styles?.switch, checked, disabled)
          )}
          className={cn(
            className,
            getClassNames(classNames?.switch, checked, disabled)
          )}
          onClick={onClickInternal}
          aria-checked={checked}
          aria-labelledby={hideLabel ? undefined : labelId}
          aria-label={hideLabel ? label : undefined}
          aria-disabled={disabled}
          {...dataAttributes}
        >
          {!children && (
            <>
              <div
                aria-hidden
                style={getStyles(styles?.thumb, checked)}
                className={getClassNames(classNames?.thumb, checked)}
              />
            </>
          )}

          {children && (
            <>
              {typeof children === 'function' &&
                children({ state: { checked, disabled } })}

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

Switch.displayName = 'FeliceSwitch'
