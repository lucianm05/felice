import { CSSProperties, HTMLProps, ReactNode } from 'react'

interface TabItemProps {
  onIdLoad?: (id: string) => void
}

export interface TabElementProps
  extends TabItemProps,
    Omit<HTMLProps<HTMLButtonElement>, 'id' | 'type' | 'role' | 'ref'> {}

export interface TabPanelProps
  extends TabItemProps,
    Omit<HTMLProps<HTMLDivElement>, 'id' | 'role' | 'ref'> {}

export type Tab = {
  element: ReactNode
  panel: ReactNode
  elementProps?: TabElementProps
  panelProps?: TabPanelProps
}

export type TabItem = 'element' | 'panel'

export interface TabsStyleable<T> {
  root?: T
  tablist?: T
  element?: T
  panel?: T
}

export type TabsStyles = TabsStyleable<CSSProperties>
export type TabsClassNames = TabsStyleable<string>