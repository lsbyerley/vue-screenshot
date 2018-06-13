module.exports = {
  apps : [{
    name: "vue-screenshot",
    script: "./server/index.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
