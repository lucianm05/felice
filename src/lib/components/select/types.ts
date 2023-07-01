export interface SelectStyleable<T> {
  root?: T
  label?: T
  trigger?: T
  list?: T
  option?: T
  activeOption?: T
  selectedOption?: T
}

export interface SelectOption {
  label: string
  value: string
}
