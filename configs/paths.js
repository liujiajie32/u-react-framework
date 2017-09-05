'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// 3rd party dependencies from CDN
const CDN = [
  'react/dist/react.min.js',
  'react-dom/dist/react-dom.min.js'
];



// config after eject: we're in ./config/
module.exports = {
  depsFromCDN: CDN

};