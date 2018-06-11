const env = process.env.NODE_ENV === "development" ? "development" : "production";
const router = require("express").Router();

router.get('/test', async (req, res, next) => {
  return res.status(200).json({ result: 'API WORKING!' });
})

module.exports = router;
