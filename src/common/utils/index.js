/**
 * @param {string} path
 * @returns {Boolean}
 */
// eslint-disable-next-line import/prefer-default-export
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
