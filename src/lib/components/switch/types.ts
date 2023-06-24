export interface SwitchRelativeStyle<T = unknown> {
  checked?: T
  unchecked?: T
}
export type SwitchStyle<T = unknown> = T | SwitchRelativeStyle<T>

export interface SwitchRelativeClassNames<T = unknown>
  extends SwitchRelativeStyle<T> {
  default?: T
}
export type SwitchClassNames<T = unknown> = T | SwitchRelativeClassNames<T>

export interface SwitchStyleable<T> {
  switch?: T
  thumb?: T
}
