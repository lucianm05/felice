export const getFocusableElements = (parent: HTMLElement, query?: string) => {
  const querySelectors = [
    '[href]',
    'input',
    'select',
    'textarea',
    '[tabindex]:not([tabindex="-1"])',
  ]

  if (query) {
    querySelectors.push(query)
  }

  if (!query || !query.includes('button')) querySelectors.push('button')

  const focusableElements =
    parent.querySelectorAll<HTMLElement>(
      querySelectors.filter(Boolean).join(', ')
    ) || []
  const firstFocusableElement = focusableElements[0]
  const lastFocusableElement = focusableElements[focusableElements.length - 1]

  return { focusableElements, firstFocusableElement, lastFocusableElement }
}
