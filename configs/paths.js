'use strict';

const path = require('path');
const fs = require('fs');
//const url = require('url');

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

// Scan component source file and add it to cmpnList
// path format: src/{Comonent Name}/{Component Name}.jsx
let cmpnSrcList = {};
let cmpnTestList = {};

fs.readdirSync(resolvePath('src')).forEach(function(dir) {
  let subDir = path.resolve(resolvePath('src'), dir);
  let stat = fs.statSync(subDir);
  if(stat.isDirectory()) {
    let cmpnJSX = path.resolve(subDir, dir+'.jsx');
    let cmpnJS = path.resolve(subDir, dir+'.js');
    let cmpnTestJSX = path.resolve(subDir, 'test-'+dir+'.jsx');
    let cmpnTestJS = path.resolve(subDir, 'test-'+dir+'.js');

    cmpnSrcList[dir] = fs.existsSync(cmpnJSX) ?
      cmpnJSX : fs.existsSync(cmpnJS) ?
        cmpnJS : cmpnList[dir];

    cmpnTestList[dir+'/test-'+dir] = fs.existsSync(cmpnTestJSX) ?
      cmpnTestJSX : fs.existsSync(cmpnTestJS) ?
        cmpnTestJS : cmpnTestList[dir];
  }
});


// config after eject: we're in ./config/
// Folder path definition
module.exports = {
  root,
  nodeModules: resolvePath('node_modules'),

  src: resolvePath('src'),
  cmpnSrcList,
  cmpnTestList,
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