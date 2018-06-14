const mcache = require("memory-cache");
const is_dev = process.env.NODE_ENV === "development" ? true : false;

function cache(duration) {
  return (req, res, next) => {
    const key = "__vuescreenshot-api-cache-__" + req.originalUrl || req.url;
    const cachedBody = mcache.get(key);

    if (cachedBody) {
      if (is_dev) {
        console.log("CACHED RESPONSE");
      }
      res.send(cachedBody);
      return;
    } else {
      if (is_dev) {
        console.log("FRESH RESPONSE");
      }
      res.sendResponse = res.send;
      res.send = function(body) {
        if (res.statusCode === 200) {
          // only cache if its a successful response
          mcache.put(key, body, duration * 1000);
        }
        res.sendResponse(body);
      };
      next();
    }
  };
}

module.exports = cache;
