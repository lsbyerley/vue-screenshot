const env = process.env.NODE_ENV === "development" ? "development" : "production";
const router = require("express").Router();
const puppeteer = require("puppeteer");
const browserPagePool = require("../utils/browserPagePool");
const { isAdUrl } = require('../utils/util');

const isValidViewport = viewport => {
  const validViewports = ["320x569", "360x640", "480x854", "960x540", "1024x640", "1366x768", "1920x1080"];
  return validViewports.includes(viewport);
};

router.get('/screenshot/:url?/:viewportSize?/:fullPage?', async (req, res, next) => {

  const page = await browserPagePool.acquire();

  try {
    if (!req.params.url) throw "url not provided";
    if (!isValidViewport(req.params.viewportSize)) throw "invalid viewport size";

    let viewport = req.params.viewportSize.split("x"),
      width = parseInt(viewport[0]),
      height = parseInt(viewport[1]),
      fullPage = (req.params.fullPage === "true") ? true : false;


    // TODO: URL sanitizing
    const url = decodeURIComponent(req.params.url);

    page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
    );

    let blockedReqs = []
    // TODO: When requesting the same url 3 times, unhandled promise rejection
    // Catch ad scripts and block them
    await page.setRequestInterception(true);
    page.on('request', (interceptedRequest) => {
      //console.log(interceptedRequest)
      const reqUrl = interceptedRequest.url()
      if ( isAdUrl(reqUrl) ) {
        blockedReqs.push(reqUrl)
        interceptedRequest.abort();
      } else {
        interceptedRequest.continue();
      }
    });

    await page.setViewport({ width: width, height: height });
    await page.goto(url, { waitUntil: "networkidle0", timeout: 10000 });
    console.log('page gone too')
    const screenshot = await page.screenshot({ fullPage: fullPage });
    await browserPagePool.release(page);
    console.log('page released')

    return res.status(200).json(screenshot);

  } catch (err) {
    console.error(err);
    await browserPagePool.release(page);
    return res.status(500).json({ error: "FAILED_SCREENSHOT" });
  }
});

module.exports = router;
