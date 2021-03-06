const env = process.env.NODE_ENV === "development" ? "development" : "production";
const router = require("express").Router();
const puppeteer = require("puppeteer");
const cache = require('../utils/cache');
const { isAdUrl } = require('../utils/util');

const isValidViewport = viewport => {
  const validViewports = ["320x569", "360x640", "480x854", "960x540", "1024x640", "1366x768", "1366x1000", "1920x1080"];
  return validViewports.includes(viewport);
};

function wait (ms) {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

router.get('/screenshot/:url?/:viewportSize?/:fullPage?', cache(10), async (req, res, next) => {

  const browser = await puppeteer.launch();

  try {
    if (!req.params.url) throw "url not provided";
    if (!isValidViewport(req.params.viewportSize)) throw "invalid viewport size";

    let viewport = req.params.viewportSize.split("x"),
      vWidth = parseInt(viewport[0]),
      vHeight = parseInt(viewport[1]),
      fullPage = (req.params.fullPage === "true") ? true : false;


    // TODO: URL sanitizing
    const url = decodeURIComponent(req.params.url);

    console.time('total')
    const page = await browser.newPage();

    page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
    );

    let blockedReqs = []
    await page.setRequestInterception(true);
    page.on('request', (interceptedRequest) => {
      const reqUrl = interceptedRequest.url()
      if ( isAdUrl(reqUrl) ) {
        blockedReqs.push(reqUrl)
        interceptedRequest.abort();
      } else {
        interceptedRequest.continue();
      }
    });

    await page.setViewport({ width: vWidth, height: vHeight });

    console.time('pagegoto: '+url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 16000 });
    console.timeEnd('pagegoto: '+url);

    if (fullPage) {
      console.time('lazyload viewport images')
      //https://www.screenshotbin.com/blog/handling-lazy-loaded-webpages-puppeteer
      // Get the height of the rendered page
      const bodyHandle = await page.$('body');
      const boundingBox = await bodyHandle.boundingBox();
      const bodyHeight = boundingBox.height
      await bodyHandle.dispose();

      // Scroll one viewport at a time, pausing to let content load
      const viewportHeight = page.viewport().height;
      let viewportIncr = 0;

      while (viewportIncr + viewportHeight < bodyHeight) {
        await page.evaluate(_viewportHeight => {
          window.scrollBy(0, _viewportHeight);
        }, viewportHeight);
        await wait(500);
        viewportIncr = viewportIncr + viewportHeight;
      }

      // Scroll back to top
      await page.evaluate(_ => {
        window.scrollTo(0, 0);
      });

      // Some extra delay to let images load
      await wait(500);
      console.timeEnd('lazyload viewport images')
    }

    console.time('takescreenshot: '+url)
    const screenshot = await page.screenshot({ fullPage: fullPage });
    console.timeEnd('takescreenshot: '+url)

    await browser.close();
    console.timeEnd('total')

    return res.status(200).json(screenshot);

  } catch (err) {
    console.error('catcherror', err);
    await browser.close();
    return res.status(500).json({ error: "FAILED_SCREENSHOT" });
  }
});

module.exports = router;
