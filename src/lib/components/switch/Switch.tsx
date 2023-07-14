import {
  SwitchClassNames,
  SwitchStyle,
  SwitchStyleable,
} from '@lib/components/switch/types'
import { getClassNames, getStyles } from '@lib/components/switch/utils'
import { CheckableChildren } from '@lib/types'
import { cn, mergeObjects } from '@lib/utils'
import { HTMLProps, MouseEvent, forwardRef, useState } from 'react'

export interface SwitchProps
  extends Omit<
    HTMLProps<HTMLButtonElement>,
    'role' | 'type' | 'aria-checked' | 'children'
  > {
  children?: CheckableChildren
  label: string
  hideLabel?: boolean
  styles?: SwitchStyleable<SwitchStyle>
  classNames?: SwitchStyleable<SwitchClassNames>
  defaultChecked?: boolean
  checked?: boolean
  onCheckedChange?: (value: boolean) => void
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      children,
      label,
      className,
      classNames,
      styles,
      style,
      checked: externalChecked,
      onCheckedChange,
      onClick,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = useState(
      Boolean(externalChecked)
    )

    const checked =
      typeof externalChecked === 'boolean' ? externalChecked : internalChecked

    const onClickInternal = (event: MouseEvent<HTMLButtonElement>) => {
      if (disabled) return

      onClick?.(event)

      if (event.defaultPrevented) return

      const newChecked = !checked

      setInternalChecked(newChecked)
      onCheckedChange?.(newChecked)
    }

    return (
      <button
        {...props}
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
        aria-label={label}
        data-checked={checked}
        data-disabled={disabled}
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
    )
  }
)

Switch.displayName = 'FeliceSwitch'
