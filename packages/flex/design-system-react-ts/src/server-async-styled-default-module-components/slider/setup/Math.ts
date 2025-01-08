/**
 * Modulo function
 *
 * By default, % operator gives a negative result if the modulo of a negative number is calculated
 */
const modulo = function (n: number, m: number) {
  return ((n % m) + m) % m
}

export { modulo }
