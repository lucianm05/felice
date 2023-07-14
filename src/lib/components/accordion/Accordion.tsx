import {
  AccordionIndicator,
  AccordionItem,
  AccordionItemClassNames,
  AccordionItemStyleable,
  AccordionItemStyles,
  AccordionRef,
  AccordionStyleable,
  AccordionType,
} from '@lib/components/accordion/types'
import { getClassNames, getStyles } from '@lib/components/accordion/utils'
import { cn, isDefined, mergeObjects } from '@lib/utils'
import { CSSProperties, HTMLProps, forwardRef, useId, useState } from 'react'

interface AccordionItemProps extends AccordionItem {
  classNames?: AccordionItemStyleable<string, AccordionItemClassNames>
  styles?: AccordionItemStyleable<CSSProperties, AccordionItemStyles>
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
  onClick,
  render,
}: AccordionItemProps) => {
  const headerId = useId()
  const contentId = useId()

  const dataAttributes = {
    'data-expanded': expanded,
    'data-disabled': false,
  } as const

  const indicatorProps = {
    style: mergeObjects(
      { display: 'inline-block' },
      getStyles(styles?.indicator, expanded)
    ),
    className: getClassNames(classNames?.indicator, expanded),
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
    className: getClassNames(classNames?.trigger, expanded),
    style: getStyles(styles?.trigger, expanded),
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
  classNames?: AccordionStyleable<string, AccordionItemClassNames>
  styles?: AccordionStyleable<CSSProperties, AccordionItemStyles>
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
      defaultValue = [],
      value: externalValue,
      onValueChange,
      type = 'multiple',
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(() => {
      if (isDefined(externalValue)) return externalValue

      return defaultValue
    })
    const internalId = useId()

    const value = isDefined(externalValue) ? externalValue : internalValue

    const id = externalId || internalId

    const isDataArray = Array.isArray(data)

    const setInternalValueHandler = (value: number[]) => {
      setInternalValue(value)
      onValueChange?.(value)
    }

    const onItemClick = (index: number) => {
      if (value.includes(index)) {
        setInternalValueHandler(value.filter(idx => idx !== index))
        return
      }

      if (type === 'multiple') {
        setInternalValueHandler([...value, index])
      } else {
        setInternalValueHandler([index])
      }
    }

    const getItemProps = (
      item: AccordionItem,
      index: number
    ): AccordionItemProps => {
      return {
        ...item,
        onClick: () => onItemClick(index),
        expanded: value.includes(index),
        classNames: {
          content: classNames?.content,
          header: classNames?.header,
          item: classNames?.item,
          trigger: classNames?.trigger,
          indicator: classNames?.indicator,
        },
        styles: {
          content: styles?.content,
          header: styles?.header,
          item: styles?.item,
          trigger: styles?.trigger,
          indicator: styles?.indicator,
        },
        indicator,
      }
    }

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
