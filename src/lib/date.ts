const monthYear = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' })

/** '2026-08' → 'Aug 2026'. null means the role is ongoing. */
export const formatMonth = (value: string | null): string =>
  value === null ? 'Present' : monthYear.format(new Date(`${value}-01T00:00:00`))
