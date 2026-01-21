'use strict'
function match(message, pattern) {
  if (typeof pattern !== 'object' || pattern === null) return false
  for (const key in pattern) {
    if (Object.hasOwn(pattern, key) === false) continue
    if (Object.hasOwn(message, key) === false) return false
    const messageValue = message[key]
    const patternValue = pattern[key]
    const nested =
      typeof patternValue === 'object' &&
      patternValue !== null &&
      typeof messageValue === 'object' &&
      messageValue !== null
    if (nested) {
      if (match(messageValue, patternValue) === false) return false
    } else if (messageValue !== patternValue) {
      return false
    }
  }
  return true
}

module.exports = match
