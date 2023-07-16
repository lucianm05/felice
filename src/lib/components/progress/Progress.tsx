import {
  ProgressChildren,
  ProgressClassNames,
  ProgressStyles,
} from '@lib/components/progress/types'
import { cn, isDefined, mergeObjects } from '@lib/utils'
import { HTMLProps, ReactNode, forwardRef, useEffect, useId } from 'react'

export interface ProgressProps
  extends Omit<
    HTMLProps<HTMLDivElement>,
    'role' | 'aria-valuemin' | 'aria-valuemax' | 'aria-valuenow' | 'children'
  > {
  label: string
  hideLabel?: boolean
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
      hideLabel,
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
    const labelId = useId()

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
              `Progress: Current value (${value}) cannot be greater than maximum value (${max})`
            )
          }
        }
      }
    }, [min, max, value])

    const percentageValue = ((value - min) * 100) / (max - min)

    const dataAttributes = {
      'data-min': min,
      'data-max': max,
      'data-value': value,
      'data-complete': value === max,
    } as const

    const indicatorProps = {
      style: mergeObjects(
        { height: '100%', width: `${percentageValue}%` },
        styles?.indicator
      ),
      className: classNames?.indicator,
      'aria-hidden': true,
      ...dataAttributes,
    } as const

    return (
      <div style={styles?.root} className={classNames?.root} {...dataAttributes}>
        {!hideLabel && (
          <label
            id={labelId}
            style={styles?.label}
            className={classNames?.label}
          >
            {label}
          </label>
        )}

        <div
          {...props}
          ref={ref}
          role='progressbar'
          style={mergeObjects(style, styles?.progressbar)}
          className={cn(className, classNames?.progressbar)}
          aria-label={hideLabel ? label : undefined}
          aria-labelledby={hideLabel ? labelId : undefined}
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
                    percentageValue,
                  },
                })}
            </>
          )}
        </div>
      </div>
    )
  }
)

Progress.displayName = 'FeliceProgress'
