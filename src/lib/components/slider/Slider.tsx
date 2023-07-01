import { keys } from '@lib/constants/keys'
import { cn, isDefined, mergeObjects, range } from '@lib/utils'
import {
  CSSProperties,
  HTMLProps,
  KeyboardEvent,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

interface SliderStyleable<T> {
  root?: T
  track?: T
  range?: T
  thumb?: T
}

interface SliderProps
  extends Omit<HTMLProps<HTMLDivElement>, 'value' | 'defaultValue'> {
  labels: string[]
  defaultValue?: number[]
  value?: number[]
  onValueChange?: (value: number[]) => void
  step?: number
  min?: number
  max?: number
  classNames?: SliderStyleable<string>
  styles?: SliderStyleable<CSSProperties>
}

type Ref = HTMLDivElement | null

export const Slider = forwardRef<Ref, SliderProps>(
  (
    {
      labels,
      style,
      styles,
      className,
      classNames,
      defaultValue = [0],
      value: externalValue,
      onValueChange,
      step = 1,
      min = 0,
      max = 150,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue)

    const movingSlider = useRef<number | null>(null)

    // console.log('movingSlider', movingSlider)

    const internalRef = useRef<Ref>(null)

    useImperativeHandle<Ref, Ref>(ref, () => internalRef.current, [])

    const value = isDefined(externalValue) ? externalValue : internalValue

    const setInternalValueHandler = useCallback(
      (index: number, action: 'increase' | 'decrease') => {
        setInternalValue(prev => {
          const currentValue = prev[index]
          let nextValue

          if (action === 'increase') {
            nextValue = currentValue + step

            if (nextValue >= max) nextValue = max
          } else {
            nextValue = currentValue - step

            if (nextValue <= min) nextValue = min
          }

          return [
            ...prev.slice(0, index),
            nextValue,
            ...prev.slice(index, prev.length - 1),
          ]
        })
      },
      [step, min, max]
    )

    const onKeyDown = useCallback(
      (event: KeyboardEvent<HTMLSpanElement>, index: number) => {
        event.preventDefault()

        switch (event.key) {
          case keys.arrowRight:
          case keys.arrowUp:
            {
              console.log('increase value')
              setInternalValueHandler(index, 'increase')
            }
            break

          case keys.arrowLeft:
          case keys.arrowDown:
            {
              console.log('decrease value')
              setInternalValueHandler(index, 'decrease')
            }
            break

          case keys.pageUp:
            {
              console.log('increase value multiple steps')
            }
            break

          case keys.pageDown:
            {
              console.log('decrease value multiple steps')
            }
            break

          case keys.home:
            {
              console.log('set to min val')
            }
            break

          case keys.end:
            {
              console.log('set to max val')
            }
            break
        }

        event.currentTarget.focus()
      },
      [setInternalValueHandler]
    )

    return (
      <div
        {...props}
        ref={internalRef}
        style={mergeObjects(style, styles?.root)}
        className={cn(className, classNames?.root)}
      >
        <div style={styles?.track} className={classNames?.track}>
          <div style={styles?.range} className={classNames?.range}></div>
        </div>

        {range(0, value.length)?.map(index => {
          return (
            <span
              key={index}
              ref={thumbRef => {
                if (
                  !thumbRef ||
                  !internalRef.current ||
                  styles?.thumb?.position ||
                  styles?.thumb?.left ||
                  styles?.thumb?.right
                )
                  return

                const { width: rootWidth } =
                  internalRef.current.getBoundingClientRect()
                const { width: thumbWidth } = thumbRef.getBoundingClientRect()

                thumbRef.style.position = 'absolute'
                thumbRef.style.left = `${
                  ((value[index] - min) / (max - min)) *
                  (rootWidth - thumbWidth)
                }px`
              }}
              style={styles?.thumb}
              className={classNames?.thumb}
              role='slider'
              tabIndex={0}
              onKeyDown={e => onKeyDown(e, index)}
              onPointerDown={e => {
                console.log('onPointerDown', e)
                movingSlider.current = index
                console.log('movingSlider', movingSlider)
              }}
              onPointerUp={e => {
                console.log('onPointerUp', e)
                movingSlider.current = null
                console.log('movingSlider', movingSlider)
              }}
              onPointerMove={e => {
                // console.log('onPointerMove', e)
                // console.log(movingSlider.current)

                if (isDefined(movingSlider.current)) {
                  setInternalValueHandler(index, 'increase')
                }
              }}
              aria-label={labels[index]}
              aria-valuemin={index === 0 ? min : undefined}
              aria-valuemax={index === value.length - 1 ? max : undefined}
              aria-valuenow={value[index]}
            />
          )
        })}
      </div>
    )
  }
)

Slider.displayName = 'FeliceSlider'
