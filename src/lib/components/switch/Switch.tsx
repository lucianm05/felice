import {
  SwitchClassNames,
  SwitchStyle,
  SwitchStyleable,
} from '@lib/components/switch/types'
import { getClassNames, getStyles } from '@lib/components/switch/utils'
import { cn, mergeObjects } from '@lib/utils'
import { HTMLProps, MouseEvent, forwardRef, useState } from 'react'

export interface SwitchProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'role' | 'type' | 'aria-checked'> {
  label?: string
  styles?: SwitchStyleable<SwitchStyle>
  classNames?: SwitchStyleable<SwitchClassNames>
  defaultChecked?: boolean
  checked?: boolean
  onCheckedChange?: (value: boolean) => void
}

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      children,
      label,
      className,
      classNames,
      styles,
      style,
      defaultChecked = false,
      checked: externalChecked,
      onCheckedChange,
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
      onCheckedChange?.(!checked)
    }

    return (
      <button
        {...props}
        ref={ref}
        type='button'
        role='switch'
        style={mergeObjects(style, getStyles(styles?.switch, checked))}
        className={cn(className, getClassNames(classNames?.switch, checked))}
        onClick={onClickInternal}
        aria-checked={checked}
        aria-label={label}
        data-checked={checked}
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

        {children}
      </button>
    )
  }
)

Switch.displayName = 'FeliceSwitch'

export default Switch
