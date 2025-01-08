export function getStatusBackground(status: string, defaultBg: string): string {
  if (!status && !defaultBg) {
    return ''
  }
  if (!status) {
    return `has-background-${defaultBg}`
  }
  return `has-background-${status}`
}

export function classify(prefix: string): (classname: string) => string {
  return function (classname: string): string {
    return `${prefix}-${classname}`
  }
}

export const is = classify('is')
export const has = classify('has')
