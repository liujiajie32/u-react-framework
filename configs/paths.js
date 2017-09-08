'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');

const root = fs.realpathSync(process.cwd());
const resolvePath = relativePath => path.resolve(root, relativePath);

console.log('User_Agent: ', process.env.npm_config_user_agent);
console.log('Package: ', process.env.npm_package_name, process.env.npm_package_version);


// Vendors from CDN
const vendorsFromCDN = {
  'react': 'React',
  'react-dom': 'ReactDOM'
};

// Vendors from local node_modules
const vendorsFromLocal = [
  'react/dist/react.min.js',
  'react-dom/dist/react-dom.min.js'
];

let clean = [

];


// config after eject: we're in ./config/
module.exports = {
  root,
  nodeModules: resolvePath('node_modules'),
  src: resolvePath('src'),
  defaultTemplate: resolvePath('src/test-component.ejs'),
  prodJS: resolvePath('dist/js'),
  prodCSS: resolvePath('dist/css'),
  prodHTML: resolvePath('dist'),
  testJS: resolvePath('test/js'),
  testCSS: resolvePath('test/css'),
  testHTML: resolvePath('test'),
  vendorsFromCDN,
  vendorsFromLocal,
  clean
};