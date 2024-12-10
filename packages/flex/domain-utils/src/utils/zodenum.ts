// https://github.com/colinhacks/zod/discussions/2125
const zodEnum = <T>(arr: T[]): [T, ...T[]] => arr as [T, ...T[]]

export { zodEnum }
