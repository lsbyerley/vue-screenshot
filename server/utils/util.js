
const blacklistedUrls = [
  'ib.adnxs.com',
  'adservice.google.com',
  'doubleclick.net',
  'cdn.adligature.com',
  'amazon-adsystem.com',
  '.com/ad',
  '.com/ads'
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

module.exports = {
  isAdUrl
}
