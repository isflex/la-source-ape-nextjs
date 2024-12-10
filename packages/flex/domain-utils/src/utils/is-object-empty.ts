// https://www.freecodecamp.org/news/check-if-an-object-is-empty-in-javascript/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isObjectEmpty = (objectName: { [key: string]: any }) => {
  return objectName && Object.keys(objectName).length === 0 && objectName.constructor === Object
}

export { isObjectEmpty }
