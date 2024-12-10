export const isNodeRuntime = typeof process !== 'undefined' && process?.release?.name === 'node'
