import {
  AccordionIndicator,
  AccordionItem,
  AccordionItemStyleable,
  AccordionStyleable,
} from '@lib/components/accordion/types'
import {
  getIsIndicatorRelative,
  getIsIndicatorStylesRelative,
} from '@lib/components/accordion/utils'
import { cn } from '@lib/utils'
import { CSSProperties, ReactNode, forwardRef, useCallback, useId, useState } from 'react'
import classes from './Accordion.module.css'

/** @todo
 * extended/collapsed external prop
 * multiple/single prop
 */

interface AccordionItemProps extends AccordionItem {
  classNames?: AccordionItemStyleable<string>
  styles?: AccordionItemStyleable<CSSProperties>
  indicator?: AccordionIndicator
}

const AccordionItem = ({
  header,
  content,
  styles,
  classNames,
  indicator,
}: AccordionItemProps) => {
  const headerId = useId()
  const contentId = useId()

  const [expanded, setExpanded] = useState(false)

  const onClick = useCallback(() => {
    setExpanded(prev => !prev)
  }, [])

  const isIndicatorRelative = getIsIndicatorRelative(indicator)

  return (
    <div className={classNames?.item} style={styles?.item}>
      <h3 className={classNames?.header} style={styles?.header}>
        <button
          id={headerId}
          className={classNames?.trigger}
          style={styles?.trigger}
          onClick={onClick}
          aria-expanded={expanded}
          aria-controls={contentId}
          aria-disabled={false}
        >
          <span>{header}</span>

          <span
            aria-hidden
            className={
              typeof classNames?.indicator === 'object'
                ? cn(
                    classes['felice__accordion-indicator'],
                    classNames?.indicator?.default,
                    expanded && classNames?.indicator?.expanded,
                    !expanded && classNames?.indicator?.collapsed
                  )
                : cn(
                    classes['felice__acordion-indicator'],
                    classNames?.indicator
                  )
            }
            style={{
              ...styles?.indicator,
              ...((expanded &&
                getIsIndicatorStylesRelative(styles?.indicator) &&
                styles?.indicator?.expanded) ??
                {}),
              ...((!expanded &&
                getIsIndicatorStylesRelative(styles?.indicator) &&
                styles?.indicator?.collapsed) ??
                {}),
            }}
          >
            {isIndicatorRelative && (
              <>
                {expanded && indicator.expanded}
                {!expanded && indicator.collapsed}
              </>
            )}

            {!isIndicatorRelative && (indicator as ReactNode)}
          </span>
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

export interface AccordionProps {
  data: AccordionItem | AccordionItem[]
  classNames?: AccordionStyleable<string>
  styles?: AccordionStyleable<CSSProperties>
  indicator?: AccordionIndicator
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ data, classNames, styles, indicator }, ref) => {
    const id = useId()

    const isDataArray = Array.isArray(data)

    const getItemProps = (item: AccordionItem): AccordionItemProps => {
      return {
        ...item,
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
      <div id={id} ref={ref} className={classNames?.root} style={styles?.root}>
        {isDataArray &&
          data.map((item, index) => (
            <AccordionItem
              key={`${item.header}@${index}`}
              {...getItemProps(item)}
            />
          ))}

        {!isDataArray && <AccordionItem {...getItemProps(data)} />}
      </div>
    )
  }
)

Accordion.displayName = 'FeliceAccordion'

export default Accordion
