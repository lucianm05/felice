import {
  SliderClassNames,
  SliderLabels,
  SliderOrientation,
  SliderRef,
  SliderStyles,
  SliderValue,
} from '@lib/components/slider/types'
import {
  getIntervalValues,
  getRangeProperties,
} from '@lib/components/slider/utils'
import { keys } from '@lib/constants/keys'
import { useUpdateInternalOnExternalChange } from '@lib/hooks/useUpdateInternalOnExternalChange'
import { cn, isDefined, mergeObjects } from '@lib/utils'
import {
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

export interface SliderProps
  extends Omit<HTMLProps<HTMLDivElement>, 'value' | 'defaultValue'> {
  labels: SliderLabels
  defaultValue?: SliderValue
  value?: SliderValue
  onValueChange?: (value: SliderValue) => void
  step?: number
  multipleStep?: number
  min?: number
  max?: number
  styles?: SliderStyles
  classNames?: SliderClassNames
  disabled?: boolean
  orientation?: SliderOrientation
}

export const Slider = forwardRef<SliderRef, SliderProps>(
  (
    {
      labels,
      style,
      styles,
      className,
      classNames,
      defaultValue,
      value: externalValue,
      onValueChange,
      step = 1,
      multipleStep = 10,
      min = 0,
      max = 150,
      disabled = false,
      orientation = 'horizontal',
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<SliderValue>(() => {
      if (isDefined(externalValue)) return externalValue

      let minValue = min

      if (!isDefined(defaultValue)) {
        return [minValue]
      }

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
    const [thumbsSize, setThumbsSize] = useState([
      { width: 0, height: 0 },
      { width: 0, height: 0 },
    ])

    const value = isDefined(externalValue) ? externalValue : internalValue

    const isHorizontal = orientation === 'horizontal'

    const movingSlider = useRef<number | null>()

    const internalRef = useRef<SliderRef>(null)
    useImperativeHandle<SliderRef, SliderRef>(
      ref,
      () => internalRef.current,
      []
    )

    const setSliderPosition = (slider: HTMLSpanElement, index: number) => {
      if (!internalRef.current) return

      const { width: rootWidth, height: rootHeight } =
        internalRef.current.getBoundingClientRect()
      const { width: thumbWidth, height: thumbHeight } =
        slider.getBoundingClientRect()

      const baseValue = (value[index] - min) / (max - min)

      slider.style.position = 'absolute'

      if (isHorizontal) {
        slider.style.left = `${baseValue * (rootWidth - thumbWidth)}px`
      } else {
        slider.style.top = `${
          rootHeight - thumbHeight - baseValue * (rootHeight - thumbHeight)
        }px`
      }
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
      const { width: rootWidth, height: rootHeight } = rect
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
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

      const { width: thumbWidth, height: thumbHeight } =
        thumbsSize[movingSlider.current]

      let newVal = 0

      if (isHorizontal) {
        newVal = Math.round(
          ((x + (currentValue + thumbWidth * multiplier)) * 100) / rootWidth
        )
      } else {
        newVal = Math.round(
          ((rootHeight - y + (currentValue + thumbHeight * multiplier)) * 100) /
            rootHeight
        )
      }

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

    useLayoutEffect(() => {
      if (!internalRef.current) return

      internalRef.current
        .querySelectorAll<HTMLSpanElement>('span[role=slider]')
        .forEach((slider, index) => {
          setSliderPosition(slider, index)

          const { width, height } = slider.getBoundingClientRect()

          setThumbsSize(prev => {
            const next = [...prev]
            next[index] = { width, height }
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

    useUpdateInternalOnExternalChange({
      setInternalValue,
      defaultValue,
      externalValue,
    })

    const dataAttributes = {
      'data-disabled': disabled,
      'data-orientation': orientation,
    }

    return (
      <div
        {...props}
        ref={internalRef}
        style={mergeObjects({ position: 'relative' }, style, styles?.root)}
        className={cn(className, classNames?.root)}
        {...dataAttributes}
      >
        <div
          style={styles?.track}
          className={classNames?.track}
          {...dataAttributes}
        >
          <div
            style={mergeObjects(
              getRangeProperties({ min, max, value, orientation }),
              styles?.range
            )}
            className={classNames?.range}
            {...dataAttributes}
          />
        </div>

        {value &&
          (isHorizontal ? value : [...value].reverse())?.map((_, index) => {
            const trueIndex = isHorizontal ? index : value.length - 1 - index

            const { maxValue, minValue } = getIntervalValues({
              max,
              min,
              value,
              index: trueIndex,
            })

            return (
              <span
                key={trueIndex}
                ref={sliderRef => {
                  if (!sliderRef) return
                  setSliderPosition(sliderRef, trueIndex)
                }}
                style={styles?.thumb}
                className={classNames?.thumb}
                role='slider'
                tabIndex={disabled ? -1 : 0}
                onKeyDown={e => onKeyDown(e, trueIndex)}
                onPointerDown={e => onPointerDown(e, trueIndex)}
                aria-label={labels[trueIndex]}
                aria-valuenow={value[trueIndex]}
                aria-valuemin={minValue}
                aria-valuemax={maxValue}
                aria-disabled={disabled}
                aria-orientation={orientation}
                {...dataAttributes}
                data-slider={trueIndex}
              />
            )
          })}
      </div>
    )
  }
)

Slider.displayName = 'FeliceSlider'
