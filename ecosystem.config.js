module.exports = {
  apps : [{
    name: "vue-screenshot",
    script: "vue-screenshot/server/index.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
