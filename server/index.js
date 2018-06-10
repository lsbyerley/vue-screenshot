const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const helmet = require("helmet");
const compression = require("compression");
const api = require("./api");
const is_dev = process.env.NODE_ENV === "development" ? true : false;
const { isEmpty } = require('./utils/util');

const app = express();
const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;

console.log(is_dev)

// Set timezone
process.env.TZ = "America/New_York";

// express config
app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser());
app.set("port", port);
app.use(express.static(path.resolve('./dist')));

// Security Settings
// Sets "Referrer-Policy: no-referrer".
app.use(helmet.referrerPolicy());

// Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-eval'",
        "'unsafe-inline'",
        "ajax.googleapis.com",
        "www.google-analytics.com",
        "cdnjs.cloudflare.com"
      ],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "fonts.googleapis.com", "fonts.gstatic.com", "cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "www.google-analytics.com", "blob:"],
      mediaSrc: ["'self'"],
      connectSrc: ["'self'"], // limit the origins (via XHR, WebSockets, and EventSource)
      objectSrc: ["'none'"], // allows control over Flash and other plugins
      frameSrc: ["www.youtube.com"], // origins that can be embedded as frames
      sandbox: ["allow-same-origin", "allow-forms", "allow-scripts", "allow-popups", "allow-presentation"],
      reportUri: "/report-violation" // error reporting
    }
  })
);

app.post("/report-violation", function(req, res) {
  if (is_dev && req.body && !isEmpty(req.body)) {
    const violation = eval(req.body);
    console.log(
      "Violation:",
      violation["csp-report"]["violated-directive"] + " - ",
      violation["csp-report"]["blocked-uri"]
    );
  } else {
    console.log("CSP Violation: No data received!", req.body);
  }
  res.status(204).end();
});

// Use API Routes
app.use("/api", api);

// Starter route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.resolve('./dist/index.html'));
});

async function start() {
  // Listen the server
  app.listen(port, host);
  console.log("Server listening on http://" + host + ":" + port); // eslint-disable-line no-console
}
start();
