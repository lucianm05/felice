import {
  ProgressChildren,
  ProgressClassNames,
  ProgressStyles,
} from '@lib/components/progress/types'
import { cn, isDefined, mergeObjects } from '@lib/utils'
import { HTMLProps, ReactNode, forwardRef, useEffect } from 'react'

export interface ProgressProps
  extends Omit<
    HTMLProps<HTMLDivElement>,
    'role' | 'aria-valuemin' | 'aria-valuemax' | 'aria-valuenow' | 'children'
  > {
  label: string
  children?: ProgressChildren
  min?: number
  max?: number
  value?: number
  indicator?: ReactNode
  styles?: ProgressStyles
  classNames?: ProgressClassNames
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
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

    const dataAttributes = {
      'data-min': min,
      'data-max': max,
      'data-value': value,
    } as const

    const indicatorProps = {
      style: styles?.indicator,
      className: classNames?.indicator,
      'aria-hidden': true,
      ...dataAttributes,
    } as const

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
        {...dataAttributes}
      >
        {!children && <div {...indicatorProps} />}

        {children && (
          <>
            {typeof children !== 'function' && children}{' '}
            {typeof children === 'function' &&
              children({
                indicatorProps,
                state: {
                  value,
                  percentageValue: ((value - min) * 100) / (max - min),
                },
              })}
          </>
        )}
      </div>
    )
  }
)

Progress.displayName = 'FeliceProgress'
