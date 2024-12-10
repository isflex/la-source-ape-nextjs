// https://dev.to/druchan/enrich-an-object-javascript-recipe-4010
interface Enrich {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  match: Record<string, any>
  extract: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: Record<string, any>[]
}

const enrich =
  ({ match, extract = [], source = [] }: Enrich) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (inputObj: Record<string, any>) => {
    if (!match) return inputObj
    if (!extract?.length) return inputObj
    if (!source) return inputObj
    if (!source?.length) return inputObj
    const matchingItem = source.find((s) => s[match.sourceKey] === inputObj[match.inputKey])
    if (!matchingItem) return inputObj
    return extract.reduce((acc, key) => {
      return {
        ...acc,
        [key]: matchingItem?.[key],
      }
    }, inputObj)
  }

export { enrich }
