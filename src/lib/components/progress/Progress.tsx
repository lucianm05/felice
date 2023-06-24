import {
  ProgressClassNames,
  ProgressStyles,
} from '@lib/components/progress/types'
import { cn, isDefined, mergeObjects } from '@lib/utils'
import { HTMLProps, ReactNode, forwardRef, useEffect } from 'react'

export interface ProgressProps
  extends Omit<
    HTMLProps<HTMLDivElement>,
    'role' | 'aria-valuemin' | 'aria-valuemax' | 'aria-valuenow'
  > {
  label: string
  min?: number
  max?: number
  value?: number
  indicator?: ReactNode
  styles?: ProgressStyles
  classNames?: ProgressClassNames
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      children,
      label,
      min = 0,
      max = 100,
      value = 0,
      style,
      styles,
      className,
      classNames,
      ...props
    },
    ref
  ) => {
    useEffect(() => {
      if (isDefined(min) && isDefined(max)) {
        if (min > max) {
          console.error(
            `Progress: Minimum value (${min}) cannot be greater than maximum value (${max})`
          )
        }

        if (isDefined(value)) {
          if (min > value) {
            console.error(
              `Progress: Minimum value (${min}) cannot be greater than current value (${value})`
            )
          }

          if (value > max) {
            console.error(
              `Progress: Maximum value (${value}) cannot be greater than maximum value (${max})`
            )
          }
        }
      }
    }, [min, max, value])

    return (
      <div
        {...props}
        ref={ref}
        role='progressbar'
        style={mergeObjects(style, styles?.root)}
        className={cn(className, classNames?.root)}
        aria-label={props['aria-label'] || label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        {!children && (
          <div
            style={styles?.indicator}
            className={classNames?.indicator}
            aria-hidden
            data-min={min}
            data-max={max}
            data-value={value}
          />
        )}

        {children}
      </div>
    )
  }
)

Progress.displayName = 'FeliceProgress'

export default Progress
