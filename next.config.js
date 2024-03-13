/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();
module.exports = {
  reactStrictMode: true,
  target: 'experimental-serverless-trace',
  basePath: '/v',
};
