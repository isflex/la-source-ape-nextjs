// https://stackoverflow.com/questions/54736011/custom-typescript-type-guard-for-not-undefined-in-separate-function

function isDefined<T>(unkownTypeVariable: T): unkownTypeVariable is Exclude<T, undefined> {
  return unkownTypeVariable !== undefined
}

function isNotDefined<T>(unkownTypeVariable: T): unkownTypeVariable is Exclude<T, undefined> {
  return unkownTypeVariable === undefined
}

export { isDefined, isNotDefined }
