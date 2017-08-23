'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
// const CommonChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin"); 
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Folder path definition
const ROOT_PATH = path.resolve(__dirname, '../');
const NODE_MODULES_PATH = path.resolve(ROOT_PATH, 'node_modules');
const DIST_JS_PATH = path.resolve(ROOT_PATH, 'dist/js');
const DIST_HTML_PATH = path.resolve(ROOT_PATH, 'dist/html');


// Judge if there's an argument '-p' or '--production' in script
var isProduction = false;
for (let i in process.argv) {
  if (process.argv[i] === '-p' || process.argv[i] === '--production') {
    isProduction = true;
    break;
  }
}
var outputName  = isProduction ? 'u.all.min' : 'u.all';

var cleanPath = [
  path.resolve(ROOT_PATH, '*.zip'),
  path.resolve(DIST_HTML_PATH, '*.html'),
];

if(isProduction) {
  cleanPath.push(path.resolve(DIST_JS_PATH, '*.min.js'));
} else {
  cleanPath.push(path.resolve(DIST_JS_PATH, '*.js'));
}


module.exports = {
  entry:  {
    [outputName]: [
      './src/componentA/componentA'
    ],
    'componentA': './src/componentA/componentA',
    'componentB': './src/componentB/componentB',
  },
  output: {
    path: DIST_JS_PATH,
    filename: '[name].js'
  },
  plugins: [
    // Abstract common chunks to vendor.js
    // new CommonChunkPlugin({name: 'vendors', filename:'vendors.js'}),
    // Clean dist folder before compiling
    new CleanWebpackPlugin(cleanPath, {
      root: ROOT_PATH,
      verbose: true // open console information output
    }),
    new HtmlWebpackPlugin({
      title: 'Test APP',
      filename: '../html/index.html',
      chunks: [outputName]
    }),
    new HtmlWebpackPlugin({
      title: 'Test ComponentA',
      filename: '../html/test-componentA.html',
      chunks: ['componentA']
    }),
    new HtmlWebpackPlugin({
      title: 'Test ComponentB',
      filename: '../html/test-componentB.html',
      chunks: ['componentB']
    })
  ],
  module: {
    loaders:[{
      // babel loader
      test:/\.(js|jsx)$/,
      loader: 'babel-loader',
      exclude: /(node_modules)/,
      // include: DIST_JS_PATH,
      query: {
        presets: ['es2015', 'stage-1', 'react'],
        plugins: [
          ["transform-runtime", {
            "helpers": false,
            "polyfill": true,
            "regenerator": true
          }],
          "add-module-exports",
          "transform-es3-member-expression-literals",
          "transform-es3-property-literals"
        ]
      }
    }]
  },

  resolve:{
    extensions:['.js', '.jsx', '.css']
  }



}