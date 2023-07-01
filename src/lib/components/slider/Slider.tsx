import {
  SliderLabels,
  SliderStyleable,
  SliderValue,
} from '@lib/components/slider/types'
import { keys } from '@lib/constants/keys'
import { cn, isDefined, mergeObjects } from '@lib/utils'
import {
  CSSProperties,
  HTMLProps,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

const getIntervalValues = ({
  max,
  min,
  value,
  index,
}: {
  min: number
  max: number
  value: SliderValue
  index: number
}) => {
  let minValue = min
  let maxValue = max

  if (isDefined(value[0]) && isDefined(value[1])) {
    if (index === 0) maxValue = value[1] - 1

    if (index === 1) minValue = value[0] + 1
  }

  return { minValue, maxValue }
}

interface SliderProps
  extends Omit<HTMLProps<HTMLDivElement>, 'value' | 'defaultValue'> {
  labels: SliderLabels
  defaultValue?: SliderValue
  value?: SliderValue
  onValueChange?: (value: SliderValue) => void
  step?: number
  multipleStep?: number
  min?: number
  max?: number
  classNames?: SliderStyleable<string>
  styles?: SliderStyleable<CSSProperties>
  disabled?: boolean
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
      defaultValue = [1],
      value: externalValue,
      onValueChange,
      step = 1,
      multipleStep = 10,
      min = 0,
      max = 150,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<SliderValue>(() => {
      if (isDefined(externalValue)) return externalValue

      let minValue = min

      if (isDefined(defaultValue[0]) && isDefined(defaultValue[1])) {
        let maxValue = max

        if (defaultValue[0] > min) minValue = defaultValue[0]
        if (defaultValue[1] < max) maxValue = defaultValue[1]

        return [minValue, maxValue]
      } else {
        if (defaultValue[0] > min) minValue = defaultValue[0]

        return [minValue]
      }
    })
    const [thumbWidths, setThumbWidths] = useState([0, 0])

    const value = isDefined(externalValue) ? externalValue : internalValue

    const movingSlider = useRef<number | null>()

    const internalRef = useRef<Ref>(null)
    useImperativeHandle<Ref, Ref>(ref, () => internalRef.current, [])

    const setSliderPosition = (slider: HTMLSpanElement, index: number) => {
      if (!internalRef.current) return

      const { width: rootWidth } = internalRef.current.getBoundingClientRect()
      const { width: thumbWidth } = slider.getBoundingClientRect()
      console.log('v', value)
      slider.style.position = 'absolute'
      slider.style.left = `${
        ((value[index] - min) / (max - min)) * (rootWidth - thumbWidth)
      }px`
    }

    const setInternalValueHandler = useCallback(
      (
        index: number,
        action: 'increase' | 'decrease' | 'min' | 'max',
        s = step,
        value?: number
      ) => {
        if (disabled) return

        setInternalValue(prev => {
          const currentSliderValue = prev[index]
          let newSliderValue
          const { maxValue, minValue } = getIntervalValues({
            max,
            min,
            value: prev,
            index,
          })

          if (isDefined(value)) {
            newSliderValue = value
          } else {
            switch (action) {
              case 'increase':
                {
                  newSliderValue = currentSliderValue + s

                  if (newSliderValue >= maxValue) newSliderValue = maxValue
                }
                break

              case 'decrease':
                {
                  newSliderValue = currentSliderValue - s

                  if (newSliderValue <= minValue) newSliderValue = minValue
                }
                break

              case 'max':
                {
                  newSliderValue = maxValue
                }
                break

              case 'min':
                {
                  newSliderValue = minValue
                }
                break
            }
          }

          const newValue: SliderValue = [...prev]
          newValue[index] = newSliderValue

          return newValue
        })
      },
      [step, min, max, disabled]
    )

    const onKeyDown = (
      event: KeyboardEvent<HTMLSpanElement>,
      index: number
    ) => {
      let prevent = false

      switch (event.key) {
        case keys.arrowRight:
        case keys.arrowUp:
          {
            setInternalValueHandler(index, 'increase')
            prevent = true
          }
          break

        case keys.arrowLeft:
        case keys.arrowDown:
          {
            setInternalValueHandler(index, 'decrease')
            prevent = true
          }
          break

        case keys.pageUp:
          {
            setInternalValueHandler(index, 'increase', multipleStep)
            prevent = true
          }
          break

        case keys.pageDown:
          {
            setInternalValueHandler(index, 'decrease', multipleStep)
            prevent = true
          }
          break

        case keys.home:
          {
            setInternalValueHandler(index, 'min')
            prevent = true
          }
          break

        case keys.end:
          {
            setInternalValueHandler(index, 'max')
            prevent = true
          }
          break

        default:
          break
      }

      if (prevent) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!isDefined(movingSlider.current) || !internalRef.current || disabled)
        return

      const rect = internalRef.current.getBoundingClientRect()
      const width = rect.width

      const x = event.clientX - rect.left
      const currentValue = value[movingSlider.current]

      let multiplier = 0
      const { minValue, maxValue } = getIntervalValues({
        min,
        max,
        value,
        index: movingSlider.current,
      })

      if (currentValue < (maxValue + minValue) / 2) {
        multiplier = 2
      } else {
        multiplier = 0.5
      }

      const newVal = Math.round(
        ((x + (currentValue + thumbWidths[movingSlider.current] * multiplier)) *
          100) /
          width
      )

      setInternalValue(prev => {
        if (!isDefined(movingSlider.current)) return prev

        const newValue: SliderValue = [...prev]

        if (newVal >= maxValue) {
          newValue[movingSlider.current] = maxValue
          return newValue
        }

        if (newVal <= minValue) {
          newValue[movingSlider.current] = minValue
          return newValue
        }

        newValue[movingSlider.current] = newVal
        return newValue
      })
    }

    const onPointerDown = (
      event: ReactPointerEvent<HTMLSpanElement>,
      index: number
    ) => {
      movingSlider.current = index

      event.preventDefault()
      event.stopPropagation()
      event.currentTarget.focus()

      document.addEventListener('pointermove', onPointerMove)
      document.addEventListener('pointerup', onPointerUp)
    }

    const onPointerUp = () => {
      movingSlider.current = null
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointermove', onPointerUp)
    }

    const getRangePosition = (): CSSProperties => {
      if (isDefined(value[0]) && isDefined(value[1])) {
        const left = ((value[0] - min) * 100) / (max - min)

        return {
          position: 'absolute',
          left: `${left}%`,
          width: `${((value[1] - min) * 100) / (max - min) - left}%`,
        }
      }

      return {
        position: 'absolute',
        left: 0,
        width: `${((value[0] - min) * 100) / (max - min)}%`,
      }
    }

    useLayoutEffect(() => {
      if (!internalRef.current) return

      internalRef.current
        .querySelectorAll<HTMLSpanElement>('span[role=slider]')
        .forEach((slider, index) => {
          setSliderPosition(slider, index)

          const { width: thumbWidth } = slider.getBoundingClientRect()

          setThumbWidths(prev => {
            const next = [...prev]
            next[index] = thumbWidth
            return next
          })
        })

      return () => {
        document.removeEventListener('pointerup', onPointerUp)
        document.removeEventListener('pointermove', onPointerMove)
      }
    }, [])

    useEffect(() => {
      onValueChange?.(internalValue)
    }, [internalValue, onValueChange])

    return (
      <div
        {...props}
        ref={internalRef}
        style={mergeObjects(style, styles?.root)}
        className={cn(className, classNames?.root)}
      >
        <div style={styles?.track} className={classNames?.track}>
          <div
            style={mergeObjects(getRangePosition(), styles?.range)}
            className={classNames?.range}
          ></div>
        </div>

        {value?.map((_, index) => {
          return (
            <span
              key={index}
              ref={sliderRef => {
                if (!sliderRef) return
                setSliderPosition(sliderRef, index)
              }}
              style={styles?.thumb}
              className={classNames?.thumb}
              role='slider'
              tabIndex={0}
              onKeyDown={e => onKeyDown(e, index)}
              onPointerDown={e => onPointerDown(e, index)}
              aria-label={labels[index]}
              aria-valuemin={index === 0 ? min : undefined}
              aria-valuemax={index === value.length - 1 ? max : undefined}
              aria-valuenow={value[index]}
              aria-disabled={disabled}
            />
          )
        })}
      </div>
    )
  }
)

Slider.displayName = 'FeliceSlider'
