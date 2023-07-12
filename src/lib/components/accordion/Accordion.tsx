import {
  AccordionIndicator,
  AccordionIndicatorClassNames,
  AccordionIndicatorStyles,
  AccordionItem,
  AccordionItemStyleable,
  AccordionRef,
  AccordionStyleable,
} from '@lib/components/accordion/types'
import {
  getIsIndicatorClassNamesRelative,
  getIsIndicatorStylesRelative,
} from '@lib/components/accordion/utils'
import { cn, isDefined, mergeObjects } from '@lib/utils'
import { CSSProperties, HTMLProps, forwardRef, useId, useState } from 'react'

/** @todo
 * extended/collapsed external prop
 * multiple/single prop
 */

interface AccordionItemProps extends AccordionItem {
  classNames?: AccordionItemStyleable<string, AccordionIndicatorClassNames>
  styles?: AccordionItemStyleable<CSSProperties, AccordionIndicatorStyles>
  indicator?: AccordionIndicator
  expanded?: boolean
  onClick?: VoidFunction
}

const AccordionItem = ({
  header,
  content,
  styles,
  classNames,
  indicator,
  expanded = false,
  onClick,
}: AccordionItemProps) => {
  const headerId = useId()
  const contentId = useId()

  const indicatorProps = {
    style: mergeObjects(
      { display: 'inline-block' },
      styles?.indicator,
      getIsIndicatorStylesRelative(styles?.indicator)
        ? expanded
          ? styles?.indicator?.expanded
          : styles?.indicator?.collapsed
        : undefined
    ),
    className: getIsIndicatorClassNamesRelative(classNames?.indicator)
      ? cn(
          classNames?.indicator?.default,
          expanded
            ? classNames?.indicator?.expanded
            : classNames?.indicator?.collapsed
        )
      : classNames?.indicator,
    'aria-hidden': true,
    'data-expanded': expanded,
  } as const

  return (
    <div className={classNames?.item} style={styles?.item}>
      <h3 id={headerId} className={classNames?.header} style={styles?.header}>
        <button
          className={classNames?.trigger}
          style={styles?.trigger}
          onClick={onClick}
          aria-expanded={expanded}
          aria-controls={contentId}
          aria-disabled={false}
          data-expanded={false}
          data-disabled={false}
        >
          <span>{header}</span>

          {typeof indicator === 'function' &&
            indicator({ state: { expanded }, indicatorProps })}

          {typeof indicator !== 'function' && (
            <span {...indicatorProps}>{indicator}</span>
          )}
        </button>
      </h3>
      <div
        id={contentId}
        className={classNames?.content}
        style={styles?.content}
        role='region'
        hidden={!expanded}
        aria-hidden={!expanded}
        aria-labelledby={headerId}
      >
        {content}
      </div>
    </div>
  )
}

export interface AccordionProps
  extends Omit<HTMLProps<HTMLDivElement>, 'data' | 'defaultValue' | 'value'> {
  data: AccordionItem | AccordionItem[]
  classNames?: AccordionStyleable<string, AccordionIndicatorClassNames>
  styles?: AccordionStyleable<CSSProperties, AccordionIndicatorStyles>
  indicator?: AccordionIndicator
  defaultValue?: number[]
  value?: number[]
  onValueChange?: (value: number[]) => void
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

      setInternalValueHandler([...value, index])
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
