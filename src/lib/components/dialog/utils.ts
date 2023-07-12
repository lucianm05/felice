export const getFocusableElements = (parent: HTMLElement) => {
  const focusableElements =
    parent.querySelectorAll<HTMLElement>(
      'button:not([data-close-button="true"]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) || []
  const firstFocusableElement = focusableElements[0]
  const lastFocusableElement = focusableElements[focusableElements.length - 1]

  return { focusableElements, firstFocusableElement, lastFocusableElement }
}
