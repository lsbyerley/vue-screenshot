
const blacklistedUrls = [
  'ib.adnxs.com',
  'adservice.google.com',
  'securepubads.g.doubleclick.net',
  'ad.doubleclick.net',
  'cdn.adligature.com'
]

function isAdUrl(url) {
  let blacklisted = false;
  for (let blacklistedUrl of blacklistedUrls) {
    if (url.includes(blacklistedUrl)) {
      blacklisted = true;
      break;
    }
  }
  return blacklisted
}

function isEmpty(value) {
  if (value == null) {
    return true
  }
  if (isArrayLike(value) &&
      (Array.isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
        isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    return !value.length
  }
  const tag = getTag(value)
  if (tag == '[object Map]' || tag == '[object Set]') {
    return !value.size
  }
  if (isPrototype(value)) {
    return !Object.keys(value).length
  }
  for (const key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false
    }
  }
  return true
}

module.exports = {
  isAdUrl,
  isEmpty
}
