export const cn = (...classes: (string | undefined | boolean)[]) =>
  classes.filter(Boolean).join(' ')

export const isDefined = (input: unknown): input is NonNullable<typeof input> =>
  input !== undefined && input !== null
