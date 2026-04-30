const shortDateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const longDateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

export function formatDate(value) {
  return shortDateFormatter.format(new Date(value))
}

export function formatLongDate(value) {
  return longDateFormatter.format(new Date(value))
}

export function formatDateTime(value) {
  return dateTimeFormatter.format(new Date(value))
}