export function emptyFilter (value) {
  if (!value || value === '') {
    return '-'
  } else {
    return value
  }
}
