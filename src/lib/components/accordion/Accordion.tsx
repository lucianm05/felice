import {
  AccordionClassNames,
  AccordionIndicator,
  AccordionItem,
  AccordionItemStyleable,
  AccordionRef,
  AccordionStyles,
  AccordionType,
} from '@lib/components/accordion/types'
import { getClassNames, getStyles } from '@lib/components/accordion/utils'
import { useUpdateInternalOnExternalChange } from '@lib/hooks/useUpdateInternalOnExternalChange'
import { cn, isDefined, mergeObjects } from '@lib/utils'
import { CSSProperties, HTMLProps, forwardRef, useId, useState } from 'react'

interface AccordionItemProps
  extends Omit<AccordionItem, 'classNames' | 'styles'> {
  styles?: AccordionItemStyleable<CSSProperties, CSSProperties>
  classNames?: AccordionItemStyleable<string, string>
  indicator?: AccordionIndicator
  expanded?: boolean
  onClick: VoidFunction
}

const AccordionItem = ({
  header,
  content,
  styles,
  classNames,
  indicator,
  expanded = false,
  disabled = false,
  onClick,
  render,
}: AccordionItemProps) => {
  const headerId = useId()
  const contentId = useId()

  const dataAttributes = {
    'data-expanded': expanded,
    'data-disabled': disabled,
  } as const

  const indicatorProps = {
    style: mergeObjects({ display: 'inline-block' }, styles?.indicator),
    className: classNames?.indicator,
    'aria-hidden': true,
    ...dataAttributes,
  } as const

  const rootProps = {
    style: styles?.item,
    className: classNames?.item,
  } as const

  const headerProps = {
    id: headerId,
    className: classNames?.header,
    style: styles?.header,
    ...dataAttributes,
  } as const

  const triggerProps = {
    className: classNames?.trigger,
    style: styles?.trigger,
    onClick: onClick,
    'aria-expanded': expanded,
    'aria-controls': contentId,
    'aria-disabled': false,
    ...dataAttributes,
  } as const

  const contentProps = {
    id: contentId,
    className: classNames?.content,
    style: styles?.content,
    role: 'region',
    hidden: !expanded,
    'aria-hidden': !expanded,
    'aria-labelledby': headerId,
    ...dataAttributes,
  } as const

  const state = { expanded }

  if (render) {
    return (
      <>
        {render({ contentProps, headerProps, state, triggerProps, rootProps })}
      </>
    )
  }

  return (
    <div {...rootProps}>
      <h3 {...headerProps}>
        <button {...triggerProps}>
          <span>{header}</span>

          {typeof indicator === 'function' &&
            indicator({ state, indicatorProps })}

          {typeof indicator !== 'function' && (
            <span {...indicatorProps}>{indicator}</span>
          )}
        </button>
      </h3>
      <div {...contentProps}>{content}</div>
    </div>
  )
}

export interface AccordionProps
  extends Omit<HTMLProps<HTMLDivElement>, 'data' | 'defaultValue' | 'value'> {
  data: AccordionItem | AccordionItem[]
  styles?: AccordionStyles
  classNames?: AccordionClassNames
  indicator?: AccordionIndicator
  defaultValue?: number[]
  value?: number[]
  onValueChange?: (value: number[]) => void
  type?: AccordionType
}

export const Accordion = forwardRef<AccordionRef, AccordionProps>(
  (
    {
      data,
      classNames,
      styles,
      indicator,
      style,
      className,
      id: externalId,
      defaultValue,
      value: externalValue,
      onValueChange,
      type = 'multiple',
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(() => {
      if (isDefined(externalValue)) return externalValue
      if (isDefined(defaultValue)) return defaultValue
      return []
    })
    const internalId = useId()

    const value = isDefined(externalValue) ? externalValue : internalValue

    const id = externalId || internalId

    const isDataArray = Array.isArray(data)

    const setInternalValueHandler = (value: number[], isDisabled: boolean) => {
      if (isDisabled) return

      setInternalValue(value)
      onValueChange?.(value)
    }

    const onItemClick = (index: number, isDisabled: boolean) => {
      if (value.includes(index)) {
        setInternalValueHandler(
          value.filter(idx => idx !== index),
          isDisabled
        )
        return
      }

      if (type === 'multiple') {
        setInternalValueHandler([...value, index], isDisabled)
      } else {
        setInternalValueHandler([index], isDisabled)
      }
    }

    const getItemProps = (
      item: AccordionItem,
      index: number
    ): AccordionItemProps => {
      const isExpanded = value.includes(index)
      const isDisabled = isDefined(item.disabled) ? item.disabled : disabled

      return {
        ...item,
        onClick: () => onItemClick(index, isDisabled),
        expanded: isExpanded,
        classNames: {
          content: cn(classNames?.content, item.classNames?.content),
          header: cn(classNames?.header),
          item: cn(classNames?.item),
          trigger: cn(
            getClassNames(classNames?.trigger, isExpanded, isDisabled),
            getClassNames(item.classNames?.trigger, isExpanded, isDisabled)
          ),
          indicator: cn(
            getClassNames(classNames?.indicator, isExpanded, isDisabled),
            getClassNames(item.classNames?.indicator, isExpanded, isDisabled)
          ),
        },
        styles: {
          content: mergeObjects(styles?.content, item.styles?.content),
          header: mergeObjects(styles?.header, item.styles?.header),
          item: mergeObjects(styles?.item, item.styles?.item),
          trigger: mergeObjects(
            getStyles(styles?.trigger, isExpanded, isDisabled),
            getStyles(item.styles?.trigger, isExpanded, isDisabled)
          ),
          indicator: mergeObjects(
            getStyles(styles?.indicator, isExpanded, isDisabled),
            getStyles(item.styles?.indicator, isExpanded, isDisabled)
          ),
        },
        indicator,
        disabled: isDisabled,
      }
    }

    useUpdateInternalOnExternalChange({
      setInternalValue,
      defaultValue,
      externalValue,
    })

    return (
      <div
        {...props}
        id={id}
        ref={ref}
        style={mergeObjects(style, styles?.root)}
        className={cn(className, classNames?.root)}
      >
        {isDataArray &&
          data.map((item, index) => (
            <AccordionItem
              key={`${item.header}@${index}`}
              {...getItemProps(item, index)}
            />
          ))}

        {!isDataArray && <AccordionItem {...getItemProps(data, 0)} />}
      </div>
    )
  }
)

Accordion.displayName = 'FeliceAccordion'
