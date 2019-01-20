/* util.js - Utilities for openapi-rim-app */

export function toCamelCase(str) {
  return str.replace(/_\w/g, (c) => c[1].toUpperCase())
}

export function toMixedCase(str) {
  return str[0].toUpperCase() + toCamelCase(str).slice(1)
}