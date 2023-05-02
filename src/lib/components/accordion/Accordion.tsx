import { CSSProperties, ReactNode, forwardRef, useId, useState } from 'react'

export interface AccordionItem {
  header: ReactNode
  content: ReactNode
}

interface AccordionItemStyleable<T> {
  item?: T
  header?: T
  trigger?: T
  content?: T
}

interface AccordionStyleable<T> extends AccordionItemStyleable<T> {
  root?: T
}

interface AccordionItemProps extends AccordionItem {
  classNames?: AccordionItemStyleable<string>
  styles?: AccordionItemStyleable<CSSProperties>
}

const AccordionItem = ({ header, content }: AccordionItemProps) => {
  const headerId = useId()
  const contentId = useId()

  const [expanded, setExpanded] = useState(false)

  const onClick = () => {
    setExpanded(prev => !prev)
  }

  return (
    <div>
      <h3>
        <button
          id={headerId}
          onClick={onClick}
          aria-expanded={expanded}
          aria-controls={contentId}
        >
          {header}
        </button>
      </h3>
      <div
        id={contentId}
        role='region'
        aria-labelledby={headerId}
        hidden={!expanded}
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
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ data, classNames, styles }, ref) => {
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
        },
        styles: {
          content: styles?.content,
          header: styles?.header,
          item: styles?.item,
          trigger: styles?.trigger,
        },
      }
    }

    return (
      <div id={id} ref={ref}>
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
