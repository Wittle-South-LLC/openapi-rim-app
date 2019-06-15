/* util.js - Utilities for openapi-rim-app */

var fs = require('fs'),                 // Read/write files
    path = require('path')

export function toCamelCase(str) {
  return str.replace(/_\w/g, (c) => c[1].toUpperCase())
}

export function toMixedCase(str) {
  return str[0].toUpperCase() + toCamelCase(str).slice(1)
}

// Based on StackOverflow answer:
// 
export function ensureDirectoryExists(filePath) {
  var dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  ensureDirectoryExists(dirname);
  fs.mkdirSync(dirname)
}
