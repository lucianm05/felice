import { forwardRef } from 'react'

export interface CheckboxGroupProps {}

const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(() => {
  return <div role='group'></div>
})

CheckboxGroup.displayName = 'FeliceCheckboxGroup'

export default CheckboxGroup
