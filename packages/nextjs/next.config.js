const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')(['@ec-backstage/core'])

const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: 'http://cotton-field-admin-web-dev.cloud-interactive.com/api'
    // API_URL: 'http://localhost:8080'
  }
}

module.exports = withPlugins([nextConfig, withTM])
