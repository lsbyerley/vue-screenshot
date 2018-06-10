const mcache = require("memory-cache");
const env = process.env.NODE_ENV === "development" ? "development" : "production";

function cache(duration) {
  return (req, res, next) => {
    const key = "__express-api-cache-__" + req.originalUrl || req.url;
    const cachedBody = mcache.get(key);

    if (cachedBody) {
      if (env === "development") {
        console.log("CACHED RESPONSE");
      }
      res.send(cachedBody);
      return;
    } else {
      if (env === "development") {
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
