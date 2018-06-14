// As cool as this idea was, pooling puppeteer pages is worse on memory than just
// opening and closing new browsers on request
const genericPool = require("generic-pool");
const puppeteer = require("puppeteer");
const browserPromise = async () => await puppeteer.launch({ headless: true });

const factory = {
  create: async function() {
    // reuse the same browser instance to create new pages
    const browser = await browserPromise();
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
  await browserPagePool.drain()
  await browserPagePool.clear()
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection: ', reason.code);
});

module.exports = browserPagePool;
