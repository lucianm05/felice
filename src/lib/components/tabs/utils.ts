import { TabElementProps, TabPanelProps } from '@lib/components/tabs/types'
import { isDefined } from '@lib/utils'

export const isItemDisabled = (
  disabled?: boolean,
  itemProps?: TabElementProps | TabPanelProps
) => {
  if (isDefined(itemProps?.disabled)) return Boolean(itemProps?.disabled)

  return Boolean(disabled)
}

export const getNextIndex = (
  index: number,
  ids: string[],
  direction: 'forward' | 'backward'
) => {
  if (direction === 'forward') {
    if (index === ids.length - 1) {
      return 0
    }
    return index + 1
  }

  if (index === 0) {
    return ids.length - 1
  }
  return index - 1
}
