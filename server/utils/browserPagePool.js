const genericPool = require("generic-pool");
const puppeteer = require("puppeteer");

// puppeteer.launch will return a promise to resolve with a browser instance
//https://gist.github.com/anonymous/c3d9b0d51127ea0bd396432075b2990a
const browserPromise = async () => await puppeteer.launch({ headless: true });

const factory = {
  create: async function() {
    // reuse the same browser instance to create new pages
    const browser = await browserPromise();
    console.log('browser promise')
    return browser.newPage();
  },
  destroy: function(puppeteer) {
    return puppeteer.close();
  }
};

const browserPagePool = genericPool.createPool(factory, {
  max: 10,
  min: 2,
  maxWaitingClients: 50
});

process.on('exit', async (code) => {
  console.log('exiting')
  await browserPagePool.drain()
  await browserPagePool.clear()
});

process.on('unhandledRejection', (reason, p) => {
  //console.log('Unhandled Rejection at:', p, 'reason:', reason);
  console.log('Unhandled Rejection: ', reason);
  // application specific logging, throwing an error, or other logic here
});

module.exports = browserPagePool;
