export function dateWithMilliseconds(date: Date) {
  return `${date.toLocaleString()}.${date.getMilliseconds()}`
}
