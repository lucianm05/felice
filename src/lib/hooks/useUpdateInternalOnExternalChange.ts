import { isDefined } from '@lib/utils'
import { Dispatch, SetStateAction, useEffect } from 'react'

interface Config {
  defaultValue?: unknown
  externalValue?: unknown
  setInternalValue: Dispatch<SetStateAction<any>>
}

const areSameValues = (valueOne: unknown, valueTwo: unknown) => {
  if (Array.isArray(valueOne) && Array.isArray(valueTwo)) {
    return JSON.stringify(valueOne) === JSON.stringify(valueTwo)
  }

  return valueOne === valueTwo
}

export const useUpdateInternalOnExternalChange = ({
  defaultValue,
  externalValue,
  setInternalValue,
}: Config) => {
  useEffect(() => {
    if (isDefined(externalValue)) {
      setInternalValue((prev: unknown) => {
        if (areSameValues(externalValue, prev)) return prev

        return externalValue
      })
      return
    }

    if (!isDefined(defaultValue)) {
      return
    }

    setInternalValue((prev: unknown) => {
      if (areSameValues(defaultValue, prev)) return prev

      return defaultValue
    })
  }, [defaultValue, externalValue])
}
