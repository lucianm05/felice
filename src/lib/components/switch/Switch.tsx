import {
  SwitchClassNames,
  SwitchStyle,
  SwitchStyleable,
} from '@lib/components/switch/types'
import { getClassNames, getStyles } from '@lib/components/switch/utils'
import { cn, mergeObjects } from '@lib/utils'
import { CSSProperties, HTMLProps, useState } from 'react'

export interface SwitchProps
  extends Omit<
    HTMLProps<HTMLButtonElement>,
    'role' | 'type' | 'aria-checked' | 'aria-label'
  > {
  label?: string
  styles?: SwitchStyleable<SwitchStyle<CSSProperties>>
  classNames?: SwitchStyleable<SwitchClassNames<string>>
  checked?: boolean
  onCheckedChange?: (value: boolean) => void
}

const Switch = ({
  children,
  label,
  className,
  classNames,
  styles,
  style,
  checked: externalChecked,
  onCheckedChange,
  ...props
}: SwitchProps) => {
  const [internalChecked, setInternalChecked] = useState(
    Boolean(externalChecked)
  )

  const checked =
    typeof externalChecked === 'boolean' ? externalChecked : internalChecked

  const onClickInternal = () => {
    const newChecked = !checked

    setInternalChecked(newChecked)
    onCheckedChange?.(newChecked)
  }

  return (
    <button
      {...props}
      type='button'
      role='switch'
      style={mergeObjects(style, getStyles(styles?.switch, checked))}
      className={cn(className, getClassNames(classNames?.switch, checked))}
      onClick={onClickInternal}
      aria-checked={checked}
      aria-label={label}
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

export default Switch
